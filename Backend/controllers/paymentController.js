const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create payment order
const createPaymentOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        const options = {
            amount: amount * 100, // Razorpay accepts in paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error('Error creating payment order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment order',
            error: error.message
        });
    }
};

// Verify payment
const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderDetails
        } = req.body;

        // Generate signature for verification
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        // Verify signature
        if (expectedSignature === razorpay_signature) {
            // Payment verified - create order in database
            const newOrder = new Order({
                userId: req.user.id,
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
                estimatedDeliveryTime: orderDetails.estimatedDeliveryTime
            });

            await newOrder.save();

            // Update user's orders
            await User.findByIdAndUpdate(req.user.id, {
                $push: { orders: newOrder._id }
            });

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                orderId: newOrder._id
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid signature'
            });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying payment',
            error: error.message
        });
    }
};

// Cash on Delivery order
const createCodOrder = async (req, res) => {
    try {
        const orderDetails = req.body;

        const newOrder = new Order({
            userId: req.user.id,
            restaurantId: orderDetails.restaurantId,
            items: orderDetails.items,
            address: orderDetails.address,
            paymentInfo: {
                method: 'cod',
                status: 'pending',
                amount: orderDetails.totalAmount
            },
            orderStatus: 'confirmed',
            subtotal: orderDetails.subtotal,
            tax: orderDetails.tax,
            deliveryFee: orderDetails.deliveryFee,
            totalAmount: orderDetails.totalAmount,
            estimatedDeliveryTime: orderDetails.estimatedDeliveryTime
        });

        await newOrder.save();

        // Update user's orders
        await User.findByIdAndUpdate(req.user.id, {
            $push: { orders: newOrder._id }
        });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully (COD)',
            orderId: newOrder._id
        });
    } catch (error) {
        console.error('Error creating COD order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

// Get order status
const getOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate('restaurantId', 'Title address phone')
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
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
};

// Get user orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate('restaurantId', 'Title ImageURL')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
    createCodOrder,
    getOrderStatus,
    getUserOrders
};