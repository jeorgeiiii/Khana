const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        // Get Token from Authorization header
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            return res.status(401).send({
                success: false,
                message: "Please Provide Auth Token"
            });
        }

        // Extract token (Bearer token format)
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
        
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Invalid Token Format"
            });
        }
        
        // Verify token
        JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('JWT Verification Error:', err.message);
                return res.status(401).send({
                    success: false,
                    message: err.name === 'TokenExpiredError' ? "Token Expired. Please Login Again." : "Unauthorized User"
                });
            } else {
                // Set both req.user and req.body.id for compatibility
                req.user = decoded;
                req.body.id = decoded.id;
                next();
            }
        });

    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).send({
            success: false,
            message: 'Authentication Error',
            error: error.message,
        });
    }
};