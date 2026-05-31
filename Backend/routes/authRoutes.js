const express = require('express');
const { signup, login } = require('../controllers/Auth_Controller');
const { signupValidation, loginValidation } = require('../middlewares/AuthValidation');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);

// Profile route (protected)
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const UserModel = require('../models/User');
        // FIXED: Use req.user.id (from authMiddleware)
        const userId = req.user?.id || req.body?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const user = await UserModel.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                usertype: user.usertype,
                profile: user.profile,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile'
        });
    }
});

// Update profile route
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const UserModel = require('../models/User');
        const userId = req.user?.id || req.body?.id;
        const { name, phone, address, password } = req.body;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            user.password = await bcrypt.hash(password, salt);
        }
        
        await user.save();
        
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile'
        });
    }
});

module.exports = router;