const mongoose = require('mongoose');

//schema
const ResturantSchema = new mongoose.Schema({
   Title: {
    type: String,
    required: [true, 'Restaurant Name is Required'],
    trim: true
   },
   ImageURL: {
    type: String,
    default: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500"
   },
   Foods: {   
    type: Array,
    default: [],
    ref: 'Food'  // Reference to Food model
   },
   Time: {
    type: String,
    default: "10:00 AM - 10:00 PM"
   },
   Pickup: {
    type: Boolean,
    default: true,
   },
   Delivery: {
    type: Boolean,
    default: true
   },
   isOpen: {
    type: Boolean,
    default: true
   },
   Logourl: {
    type: String,
    default: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200"
   },
   Rating: {
    type: Number,
    default: 4.0,
    min: 1,
    max: 5
   },
   RatingCount: {
    type: Number,
    default: 0
   },
   Code: {
    type: String,
    unique: true,
    sparse: true
   },
   Coords: {
    id: { type: String },
    latitude: { type: Number, required: true },
    latitudeDelta: { type: Number, default: 0.01 },
    longitude: { type: Number, required: true },
    longitudeDelta: { type: Number, default: 0.01 },
    address: { type: String, required: true },
    title: { type: String }
   },
   // Additional fields for better UI
   address: {
    type: String,
    required: true
   },
   location: {
    type: String,
    required: true,
    default: "Indore"
},

   phone: {
    type: String,
    required: true
   },
   cuisine: {
    type: String,
    required: true
   },
   price: {
    type: String,
    default: "₹200 for two"
   },
   description: {
    type: String,
    default: "Experience the best dining with our delicious food and excellent service."
   },
   // New fields for better functionality
   category: {
    type: String,
    enum: ['Fine Dining', 'Casual Dining', 'Fast Food', 'Cafe', 'Bakery', 'Street Food'],
    default: 'Casual Dining'
   },
   paymentMethods: {
    type: [String],
    enum: ['Cash', 'Card', 'UPI', 'Wallet'],
    default: ['Cash', 'Card', 'UPI']
   },
   facilities: {
    type: [String],
    enum: ['Parking', 'WiFi', 'AC', 'Outdoor Seating', 'Home Delivery', 'Takeaway'],
    default: ['Home Delivery', 'Takeaway']
   },
   minOrder: {
    type: Number,
    default: 0
   },
   deliveryFee: {
    type: Number,
    default: 0
   },
   preparationTime: {
    type: String,
    default: "15-20 min"
   },
   views: {
    type: Number,
    default: 0
   },
   featured: {
    type: Boolean,
    default: false
   },
   status: {
    type: String,
    enum: ['active', 'inactive', 'closed'],
    default: 'active'
   },
   ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
   }
}, { 
   timestamps: true,
   toJSON: { virtuals: true },
   toObject: { virtuals: true }
});

// Virtual for average rating (already exists but kept for clarity)
ResturantSchema.virtual('averageRating').get(function() {
  return this.Rating;
});

// Virtual for total number of food items
ResturantSchema.virtual('totalFoodItems').get(function() {
  return this.Foods?.length || 0;
});

// Method to update rating
ResturantSchema.methods.updateRating = function(newRating) {
  const total = this.Rating * this.RatingCount + newRating;
  this.RatingCount += 1;
  this.Rating = (total / this.RatingCount).toFixed(1);
  return this.save();
};

// Method to increment views
ResturantSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Static method to find nearby restaurants
ResturantSchema.statics.findNearby = function(lat, lng, maxDistance = 5) {
  return this.find({
    'Coords.latitude': { $exists: true },
    'Coords.longitude': { $exists: true }
  }).then(restaurants => {
    return restaurants.filter(restaurant => {
      const distance = calculateDistance(
        lat, lng,
        restaurant.Coords.latitude,
        restaurant.Coords.longitude
      );
      return distance <= maxDistance;
    });
  });
};

// Helper function for distance calculation
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Index for better query performance
ResturantSchema.index({ Title: 'text', cuisine: 'text', 'Coords.address': 'text' });
ResturantSchema.index({ 'Coords.latitude': 1, 'Coords.longitude': 1 });
ResturantSchema.index({ Rating: -1 });
ResturantSchema.index({ featured: 1 });
ResturantSchema.index({ status: 1 });

module.exports = mongoose.model('Resturant', ResturantSchema);