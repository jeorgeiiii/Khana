const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: true,
        index: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 10 * 60 * 1000,
        index: { expires: 0 } // Auto-delete after expiry
    },
    attempts: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Otp', otpSchema);