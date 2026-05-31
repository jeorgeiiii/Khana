import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './Auth.css';

function Login() {
    const [loginType, setLoginType] = useState('email');
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });
    const [otpInfo, setOtpInfo] = useState({
        mobile: '',
        otp: ['', '', '', '', '', ''],
        step: 'mobile',
        timer: 0,
        name: ''
    });
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    // Centralized session saver — single source of truth
    const saveSession = (token, user) => {
        if (!token) {
            console.error('saveSession called without a token!');
            return;
        }
        localStorage.setItem('token', token);
        localStorage.setItem('loggedInUser', user?.name || '');
        localStorage.setItem('user', JSON.stringify(user || {}));
    };

    useEffect(() => {
        let interval;
        if (otpInfo.timer > 0) {
            interval = setInterval(() => {
                setOtpInfo(prev => ({ ...prev, timer: prev.timer - 1 }));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpInfo.timer]);

    // Email Login Handler
    const handleEmailChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({ ...loginInfo, [name]: value });
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required');
        }
        setLoading(true);
        try {
            const url = 'http://localhost:5000/api/v1/auth/login';
            const response = await fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            const { success, message, jwtToken, token, user, name, error } = result;

            if (success) {
                // Accept either jwtToken or token from backend — defensive
                const authToken = jwtToken || token;
                const userObj = user || { name, email };
                saveSession(authToken, userObj);
                handleSuccess(message);
                setTimeout(() => navigate('/home'), 1000);
            } else if (error) {
                handleError(error?.details?.[0]?.message || message);
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // OTP Handlers
    const handleMobileSubmit = async (e) => {
        e.preventDefault();
        if (otpInfo.mobile.length !== 10) {
            handleError('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/v1/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: otpInfo.mobile })
            });
            const data = await response.json();

            if (data.success) {
                handleSuccess('OTP sent successfully!');
                setOtpInfo(prev => ({
                    ...prev,
                    step: 'otp',
                    timer: 60
                }));
                if (data.devOTP) console.log('Dev OTP:', data.devOTP);
            } else {
                handleError(data.message);
            }
        } catch (error) {
            handleError('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otpInfo.otp];
        newOtp[index] = value;
        setOtpInfo(prev => ({ ...prev, otp: newOtp }));

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpVerify = async (e) => {
        e.preventDefault();
        const otpValue = otpInfo.otp.join('');
        if (otpValue.length !== 6) {
            handleError('Please enter complete 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/v1/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mobile: otpInfo.mobile,
                    otp: otpValue,
                    name: otpInfo.name
                })
            });
            const data = await response.json();

            if (data.success) {
                if (data.user?.isNewUser && !otpInfo.name) {
                    setOtpInfo(prev => ({ ...prev, step: 'name' }));
                    return;
                }
                // Accept either token or jwtToken from backend
                const authToken = data.token || data.jwtToken;
                saveSession(authToken, data.user);
                handleSuccess(data.message);
                setTimeout(() => navigate('/home'), 1500);
            } else {
                handleError(data.message);
            }
        } catch (error) {
            handleError('Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (otpInfo.timer > 0) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/v1/otp/resend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile: otpInfo.mobile })
            });
            const data = await response.json();

            if (data.success) {
                setOtpInfo(prev => ({
                    ...prev,
                    timer: 60,
                    otp: ['', '', '', '', '', '']
                }));
                handleSuccess('OTP resent successfully!');
                if (data.devOTP) console.log('New OTP:', data.devOTP);
            } else {
                handleError(data.message);
            }
        } catch (error) {
            handleError('Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleNameSubmit = async (e) => {
        e.preventDefault();
        if (!otpInfo.name.trim()) {
            handleError('Please enter your name');
            return;
        }
        await handleOtpVerify(e);
    };

    const renderOtpForm = () => {
        if (otpInfo.step === 'mobile') {
            return (
                <form onSubmit={handleMobileSubmit}>
                    <div className="mobile-input-group">
                        <span className="country-code">+91</span>
                        <input
                            type="tel"
                            placeholder="9876543210"
                            value={otpInfo.mobile}
                            onChange={(e) => setOtpInfo(prev => ({
                                ...prev,
                                mobile: e.target.value.replace(/\D/g, '').slice(0, 10)
                            }))}
                            maxLength="10"
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
            );
        }

        if (otpInfo.step === 'otp') {
            return (
                <form onSubmit={handleOtpVerify}>
                    <p className="otp-desc">Enter the 6-digit code sent to +91 {otpInfo.mobile}</p>
                    <div className="otp-input-group">
                        {otpInfo.otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                ref={(el) => inputRefs.current[index] = el}
                                className="otp-input"
                            />
                        ))}
                    </div>
                    <div className="timer">
                        {otpInfo.timer > 0 ? (
                            <span>Resend OTP in {Math.floor(otpInfo.timer / 60)}:{String(otpInfo.timer % 60).padStart(2, '0')}</span>
                        ) : (
                            <span className="resend" onClick={handleResendOTP}>Resend OTP</span>
                        )}
                    </div>
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify & Login'}
                    </button>
                    <div className="edit-number">
                        <span onClick={() => setOtpInfo(prev => ({ ...prev, step: 'mobile', otp: ['', '', '', '', '', ''] }))}>
                            Edit Number
                        </span>
                    </div>
                </form>
            );
        }

        if (otpInfo.step === 'name') {
            return (
                <form onSubmit={handleNameSubmit}>
                    <p className="welcome-text">Welcome! Please enter your name to complete signup</p>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={otpInfo.name}
                        onChange={(e) => setOtpInfo(prev => ({ ...prev, name: e.target.value }))}
                        autoFocus
                    />
                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Complete Signup'}
                    </button>
                </form>
            );
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <img src="/zomato-logo.png" alt="Zomoro" className="logo-img" />
                    <span className="logo-text">zomoro</span>
                </div>

                <h2 className="auth-title">Welcome back!</h2>
                <p className="auth-subtitle">Log in to continue your food journey</p>

                <div className="auth-tabs">
                    <button
                        className={`tab-btn ${loginType === 'email' ? 'active' : ''}`}
                        onClick={() => {
                            setLoginType('email');
                            setOtpInfo({ mobile: '', otp: ['', '', '', '', '', ''], step: 'mobile', timer: 0, name: '' });
                        }}
                    >
                        📧 Email
                    </button>
                    <button
                        className={`tab-btn ${loginType === 'otp' ? 'active' : ''}`}
                        onClick={() => {
                            setLoginType('otp');
                            setLoginInfo({ email: '', password: '' });
                        }}
                    >
                        📱 Mobile OTP
                    </button>
                </div>

                {loginType === 'email' ? (
                    <form onSubmit={handleEmailLogin}>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={loginInfo.email}
                                onChange={handleEmailChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={loginInfo.password}
                                onChange={handleEmailChange}
                            />
                        </div>
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                ) : (
                    renderOtpForm()
                )}

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link></p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;