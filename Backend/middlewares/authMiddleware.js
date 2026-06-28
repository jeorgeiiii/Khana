const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized, JWT token is required'
        });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            usertype: decoded.usertype
        };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized, JWT token wrong or expired'
        });
    }
};

module.exports = authMiddleware;