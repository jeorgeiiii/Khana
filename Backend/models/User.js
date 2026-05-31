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
    
    // Optional fields with defaults
    UserName: {
        type: String,
        default: function() { return this.name; }
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
    usertype: {
        type: String,
        default: 'Client',
        enum: ['Client', 'Admin', 'Vendor', 'Driver']
    },
    profile: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    },
    answer: {
        type: String,
        default: "default_answer"
    },
    // New fields for Zomato-like features
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
userSchema.virtual('fullProfile').get(function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        phone: this.phone,
        addresses: this.address,
        profilePic: this.profile,
        memberSince: this.createdAt,
        favoritesCount: this.favorites?.length || 0,
        ordersCount: this.orders?.length || 0
    };
});

// Method to get default address
userSchema.methods.getDefaultAddress = function() {
    return this.address.find(addr => addr.isDefault) || this.address[0];
};

// Method to add to favorites
userSchema.methods.addToFavorites = function(restaurantId) {
    if (!this.favorites.includes(restaurantId)) {
        this.favorites.push(restaurantId);
        return this.save();
    }
    return Promise.resolve(this);
};

// Method to remove from favorites
userSchema.methods.removeFromFavorites = function(restaurantId) {
    this.favorites = this.favorites.filter(id => id.toString() !== restaurantId.toString());
    return this.save();
};

// Clear cache
if (mongoose.models['User']) {
    delete mongoose.models['User'];
}

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;