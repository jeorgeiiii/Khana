const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required']
    },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is Required']
    },

    UserName: {
        type: String,
        default: function () { return this.name; }
    },

    address: [{
        type: {
            type: String,
            enum: ['home', 'work', 'other'],
            default: 'home'
        },
        street: String,
        city: String,
        state: String,
        pincode: String,
        isDefault: {
            type: Boolean,
            default: false
        }
    }],

    phone: {
        type: String,
        default: "0000000000"
    },

    // ROLE FIELD — controls what this user can do
    usertype: {
        type: String,
        default: 'Client',
        enum: ['Client', 'Admin', 'Vendor', 'Driver']
    },

    // For Vendor — which restaurants they own
    ownedRestaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resturant'
    }],

    // For Driver — track availability
    isAvailableForDelivery: {
        type: Boolean,
        default: false
    },

    profile: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    },
    answer: {
        type: String,
        default: "default_answer"
    },

    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resturant'
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    savedCards: [{
        cardType: String,
        lastFour: String,
        cardHolderName: String,
        expiryDate: String,
        isDefault: { type: Boolean, default: false }
    }],
    preferences: {
        cuisinePreferences: [String],
        dietaryRestrictions: [String],
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            push: { type: Boolean, default: true }
        }
    }
}, { timestamps: true });

// Virtual for full profile
userSchema.virtual('fullProfile').get(function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        phone: this.phone,
        addresses: this.address,
        profilePic: this.profile,
        usertype: this.usertype,
        memberSince: this.createdAt,
        favoritesCount: this.favorites?.length || 0,
        ordersCount: this.orders?.length || 0
    };
});

// Role helper methods — use these in controllers when you want readable checks
userSchema.methods.isAdmin = function () { return this.usertype === 'Admin'; };
userSchema.methods.isVendor = function () { return this.usertype === 'Vendor'; };
userSchema.methods.isDriver = function () { return this.usertype === 'Driver'; };
userSchema.methods.isClient = function () { return this.usertype === 'Client'; };

// Default address
userSchema.methods.getDefaultAddress = function () {
    return this.address.find(addr => addr.isDefault) || this.address[0];
};

// Favorites
userSchema.methods.addToFavorites = function (restaurantId) {
    if (!this.favorites.includes(restaurantId)) {
        this.favorites.push(restaurantId);
        return this.save();
    }
    return Promise.resolve(this);
};

userSchema.methods.removeFromFavorites = function (restaurantId) {
    this.favorites = this.favorites.filter(id => id.toString() !== restaurantId.toString());
    return this.save();
};

module.exports = mongoose.model('user', userSchema);