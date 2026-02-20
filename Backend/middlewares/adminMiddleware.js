const User = require('../models/User'); // Adjust path as needed

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(401).send({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is admin (you can modify this based on your user schema)
        if (user.role !== 'admin' && user.role !== 'superadmin') {
            return res.status(403).send({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in admin middleware',
            error
        });
    }
};

module.exports = adminMiddleware;