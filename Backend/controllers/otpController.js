const OTP = require('../models/Otp');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Send OTP
const sendOTP = async (req, res) => {
    try {
        const { mobile } = req.body;
        
        if (!mobile || mobile.length !== 10) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 10-digit mobile number'
            });
        }

        const fullMobile = `+91${mobile}`;
        
        // Delete existing OTPs
        await OTP.deleteMany({ mobile: fullMobile });
        
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP to database
        const newOTP = new OTP({
            mobile: fullMobile,
            otp: otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
        });
        await newOTP.save();

        // For development, log OTP to console
        console.log(`📱 OTP for ${mobile}: ${otp}`);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            devOTP: otp // Only for testing, remove in production
        });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP'
        });
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { mobile, otp, name } = req.body;
        
        if (!mobile || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Mobile and OTP are required'
            });
        }

        const fullMobile = `+91${mobile}`;

        // Find OTP record
        const otpRecord = await OTP.findOne({ mobile: fullMobile, otp: otp });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Check if OTP expired
        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({
                success: false,
                message: 'OTP expired. Please request a new one.'
            });
        }

        // Check if user exists
        let user = await User.findOne({ mobile: fullMobile });

        if (!user) {
            // New user - need name
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide your name to complete signup',
                    isNewUser: true
                });
            }

            // Create new user
            user = new User({
                name: name,
                mobile: fullMobile,
                isMobileVerified: true,
                phone: fullMobile,
                UserName: name
            });
            await user.save();
        } else {
            // Existing user - update verification
            user.isMobileVerified = true;
            await user.save();
        }

        // Delete used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                mobile: user.mobile,
                usertype: user.usertype 
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            message: user.name ? 'Login successful' : 'Signup successful',
            token,
            user: {
                id: user._id,
                name: user.name || user.mobile,
                mobile: user.mobile,
                usertype: user.usertype,
                isNewUser: !user.name
            }
        });

    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({
            success: false,
            message: 'Verification failed'
        });
    }
};

// Resend OTP
const resendOTP = async (req, res) => {
    try {
        const { mobile } = req.body;
        
        if (!mobile || mobile.length !== 10) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid 10-digit mobile number'
            });
        }

        const fullMobile = `+91${mobile}`;

        // Rate limiting - max 3 attempts per hour
        const recentOTPs = await OTP.countDocuments({
            mobile: fullMobile,
            createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) }
        });

        if (recentOTPs >= 3) {
            return res.status(429).json({
                success: false,
                message: 'Too many attempts. Please try again after an hour.'
            });
        }

        // Delete existing OTPs
        await OTP.deleteMany({ mobile: fullMobile });

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save to database
        const newOTP = new OTP({
            mobile: fullMobile,
            otp: otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        });
        await newOTP.save();

        console.log(`📱 New OTP for ${mobile}: ${otp}`);

        res.status(200).json({
            success: true,
            message: 'OTP resent successfully',
            devOTP: otp
        });
    } catch (error) {
        console.error('Resend OTP Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resend OTP'
        });
    }
};

module.exports = { sendOTP, verifyOTP, resendOTP };