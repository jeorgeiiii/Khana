const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Order = require('../models/Order');

const router = express.Router();

// Get logged-in user's orders
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Orders fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders'
        });
    }
});

// Get a single order by ID
router.get('/:orderId', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            userId: req.user.id
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('Order fetch error:', error);
        res.status(500).json({ success: false, message: 'Error fetching order' });
    }
});

module.exports = router;