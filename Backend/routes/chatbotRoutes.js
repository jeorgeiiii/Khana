const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    handleChatMessage,
    listSubscriptions,
    cancelSubscription
} = require('../controllers/chatbotController');

const router = express.Router();

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
        req.user = { id: null };
        return next();
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            usertype: decoded.usertype
        };
        return next();
    } catch (error) {
        req.user = { id: null };
        return next();
    }
};

router.post('/message', optionalAuth, handleChatMessage);
router.get('/subscriptions', authMiddleware, listSubscriptions);
router.delete('/subscriptions/:id', authMiddleware, cancelSubscription);

module.exports = router;