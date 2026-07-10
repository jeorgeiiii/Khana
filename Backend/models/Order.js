// Order Schema (Backend/models/Order.js)
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resturant',
        required: true
    },
    items: [{
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
        name: String,
        quantity: Number,
        price: Number,
        total: Number
    }],
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    paymentInfo: {
        method: {
            type: String,
            enum: ['card', 'upi', 'netbanking', 'wallet', 'cod'],
            required: true
        },
        transactionId: String,
        paymentGateway: String,
        status: {
            type: String,
            enum: ['pending', 'success', 'failed', 'refunded'],
            default: 'pending'
        },
        amount: Number,
        paidAt: Date
    },
    orderStatus: {
        type: String,
        enum: ['pending_payment','pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled','expired'],
        default: 'pending'
    },
    subtotal: Number,
    tax: Number,
    deliveryFee: Number,
    totalAmount: Number,
    estimatedDeliveryTime: String,
     expiresAt: {
        type: Date
    },
    isSubscriptionOrder: {
        type: Boolean,
        default: false
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);