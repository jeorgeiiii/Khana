const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    mode: {
        type: String,
        enum: ['fixed', 'cheapest'],
        default: 'fixed',
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resturant'
    },
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
    },
    mealTimes: {
        type: [String],
        required: true
    },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        phone: String
    },
    maxPrice: {
        type: Number,
        default: 300
    },
    active: {
        type: Boolean,
        default: true,
        index: true
    },
    lastOrderedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);