const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/User"); // FIXED: Capital U

const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ 
                message: 'User already exists, you can login', 
                success: false 
            });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const userModel = new UserModel({ 
            name, 
            email, 
            password: hashedPassword,
            phone: phone || "0000000000",
            isEmailLogin: true
        });
        
        await userModel.save();
        
        res.status(201).json({
            message: "Signup successfully",
            success: true,
            user: {
                id: userModel._id,
                name: userModel.name,
                email: userModel.email
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid email or password', 
                success: false 
            });
        }
        
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(401).json({ 
                message: 'Invalid email or password', 
                success: false 
            });
        }
        
        // FIXED: Send 'id' instead of '_id' in token
        const token = jwt.sign(
            { id: user._id, email: user.email, usertype: user.usertype },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login Success",
            success: true,
             token: token,
            jwtToken: token,
            
            email: user.email,
            name: user.name,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        });
    }
};

module.exports = {
    signup,
    login
};