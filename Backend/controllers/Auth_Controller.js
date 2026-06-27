const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

// ⚠️ Security: never let the public signup endpoint set usertype.
// Otherwise anyone could sign up as Admin. Roles are assigned via
// admin endpoints or scripts only.
const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const existing = await UserModel.findOne({ email });
        if (existing) {
            return res.status(409).json({
                message: 'User already exists, you can login',
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            phone: phone || '0000000000',
            usertype: 'Client'   // ← forced, ignoring anything in req.body
        });

        await newUser.save();

        res.status(201).json({
            message: 'Signup successfully',
            success: true,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                usertype: newUser.usertype
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({
            message: 'Internal server error',
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

        // Embed role in token so middleware can read it without a DB query
        const token = jwt.sign(
            { id: user._id, email: user.email, usertype: user.usertype },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login Success',
            success: true,
            token,
            jwtToken: token, // legacy field; some old frontend code reads this
            email: user.email,
            name: user.name,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                usertype: user.usertype   // ← frontend needs this to render role-based UI
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message
        });
    }
};

module.exports = { signup, login };