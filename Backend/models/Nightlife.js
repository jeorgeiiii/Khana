const mongoose = require('mongoose');

const nightlifeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cuisine: {
        type: String,
        required: true
    },
    price: {
        type: String,
        default: "₹1,500 for two"
    },
    rating: {
        type: String,
        default: "4.0"
    },
    imageUrl: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Bar', 'Pub', 'Night Club', 'Lounge', 'Microbrewery'],
        default: 'Bar'
    },
    music: {
        type: String,
        enum: ['Live Band', 'DJ', 'Bollywood', 'EDM', 'Retro'],
        default: 'DJ'
    },
    happyHours: {
        type: String
    },
    featured: {
        type: Boolean,
        default: false
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    openingTime: {
        type: String,
        default: "7:00 PM"
    },
    closingTime: {
        type: String,
        default: "1:00 AM"
    }
}, { timestamps: true });

module.exports = mongoose.model('Nightlife', nightlifeSchema);