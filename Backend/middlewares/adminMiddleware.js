const UserModel = require('../models/User'); // Fixed path

const adminMiddleware = async (req, res, next) => {
    try {
        // Get user ID from auth middleware
        const userId = req.user?.id || req.body?.id;
        
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: 'User not authenticated'
            });
        }

        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(401).send({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is admin (based on usertype field)
        if (user.usertype !== 'Admin' && user.usertype !== 'SuperAdmin') {
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
            error: error.message
        });
    }
};

module.exports = adminMiddleware;