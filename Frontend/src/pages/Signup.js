import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './Auth.css';

function Signup() {
    const [signupType, setSignupType] = useState('email');
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
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

    useEffect(() => {
        let interval;
        if (otpInfo.timer > 0) {
            interval = setInterval(() => {
                setOtpInfo(prev => ({ ...prev, timer: prev.timer - 1 }));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpInfo.timer]);

    const handleEmailChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo({ ...signupInfo, [name]: value });
    };

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        const { name, email, password, phone } = signupInfo;
        if (!name || !email || !password) {
            return handleError('Name, email and password are required');
        }
        setLoading(true);
        try {
            const url = 'http://localhost:5000/api/v1/auth/signup';
            // Send phone with default value if empty
            const requestBody = {
                name,
                email,
                password,
                phone: phone && phone.trim() ? phone : "0000000000"
            };
            
            const response = await fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            const result = await response.json();
            const { success, message, error } = result;
            
            if (success) {
                handleSuccess(message);
                setTimeout(() => navigate('/login'), 1000);
            } else if (error) {
                handleError(error?.details?.[0]?.message || message);
            } else if (!success) {
                handleError(message);
            }
        } catch (err) {
            handleError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
        if (!otpInfo.name.trim()) {
            handleError('Please enter your name');
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
                localStorage.setItem('token', data.token);
                localStorage.setItem('loggedInUser', data.user.name);
                localStorage.setItem('user', JSON.stringify(data.user));
                handleSuccess('Account created successfully!');
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
                    <div className="input-group">
                        <label>Your Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={otpInfo.name}
                            onChange={(e) => setOtpInfo(prev => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>
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
                        {loading ? 'Verifying...' : 'Signup & Login'}
                    </button>
                    <div className="edit-number">
                        <span onClick={() => setOtpInfo(prev => ({ ...prev, step: 'mobile', otp: ['', '', '', '', '', ''] }))}>
                            Edit Number
                        </span>
                    </div>
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
                
                <h2 className="auth-title">Join Zomoro</h2>
                <p className="auth-subtitle">Create an account to start ordering</p>
                
                <div className="auth-tabs">
                    <button 
                        className={`tab-btn ${signupType === 'email' ? 'active' : ''}`}
                        onClick={() => {
                            setSignupType('email');
                            setOtpInfo({ mobile: '', otp: ['', '', '', '', '', ''], step: 'mobile', timer: 0, name: '' });
                        }}
                    >
                        📧 Email
                    </button>
                    <button 
                        className={`tab-btn ${signupType === 'otp' ? 'active' : ''}`}
                        onClick={() => {
                            setSignupType('otp');
                            setSignupInfo({ name: '', email: '', password: '', phone: '' });
                        }}
                    >
                        📱 Mobile OTP
                    </button>
                </div>

                {signupType === 'email' ? (
                    <form onSubmit={handleEmailSignup}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={signupInfo.name}
                                onChange={handleEmailChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={signupInfo.email}
                                onChange={handleEmailChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={signupInfo.password}
                                onChange={handleEmailChange}
                            />
                        </div>
                        <div className="input-group">
                            <label>Phone Number (Optional)</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="Enter your phone"
                                value={signupInfo.phone}
                                onChange={handleEmailChange}
                            />
                        </div>
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>
                    </form>
                ) : (
                    renderOtpForm()
                )}
                
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login" className="auth-link">Log in</Link></p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Signup;