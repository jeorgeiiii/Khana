const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food'
        },
        name: String,
        price: Number,
        quantity: {
            type: Number,
            default: 1,
            min: 1
        },
        image: String
    }],
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resturant'
    },
    restaurantName: String,
    restaurantAddress: String,
    subtotal: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);