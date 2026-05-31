const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();

// Create COD Order
router.post('/cod-order', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { restaurantId, items, address, subtotal, tax, deliveryFee, totalAmount, estimatedDeliveryTime } = req.body;
        
        // Create order
        const newOrder = new Order({
            userId,
            restaurantId,
            items,
            address,
            paymentInfo: {
                method: 'cod',
                status: 'pending',
                amount: totalAmount
            },
            orderStatus: 'confirmed',
            subtotal,
            tax,
            deliveryFee,
            totalAmount,
            estimatedDeliveryTime: estimatedDeliveryTime || '30-40 min'
        });
        
        await newOrder.save();
        
        // Add order to user
        await User.findByIdAndUpdate(userId, {
            $push: { orders: newOrder._id }
        });
        
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            orderId: newOrder._id
        });
    } catch (error) {
        console.error('COD order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to place order',
            error: error.message
        });
    }
});

// Create Payment Order (Razorpay)
router.post('/create-order', authMiddleware, async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;
        
        // For now, return mock order ID (in production, integrate Razorpay)
        res.status(200).json({
            success: true,
            orderId: `order_${Date.now()}`,
            amount: amount * 100,
            currency
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment order'
        });
    }
});

// Verify Payment
router.post('/verify-payment', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        const { razorpay_order_id, razorpay_payment_id, orderDetails } = req.body;
        
        // Create order
        const newOrder = new Order({
            userId,
            restaurantId: orderDetails.restaurantId,
            items: orderDetails.items,
            address: orderDetails.address,
            paymentInfo: {
                method: orderDetails.paymentMethod,
                transactionId: razorpay_payment_id,
                paymentGateway: 'razorpay',
                status: 'success',
                amount: orderDetails.totalAmount,
                paidAt: Date.now()
            },
            orderStatus: 'confirmed',
            subtotal: orderDetails.subtotal,
            tax: orderDetails.tax,
            deliveryFee: orderDetails.deliveryFee,
            totalAmount: orderDetails.totalAmount,
            estimatedDeliveryTime: orderDetails.estimatedDeliveryTime || '30-40 min'
        });
        
        await newOrder.save();
        
        // Add order to user
        await User.findByIdAndUpdate(userId, {
            $push: { orders: newOrder._id }
        });
        
        res.status(200).json({
            success: true,
            message: 'Payment verified successfully',
            orderId: newOrder._id
        });
    } catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed'
        });
    }
});

// Get Order by ID
router.get('/order/:orderId', authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await Order.findById(orderId)
            .populate('restaurantId', 'Title address')
            .populate('items.foodId', 'Title ImageURL');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }
        
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order'
        });
    }
});

module.exports = router;