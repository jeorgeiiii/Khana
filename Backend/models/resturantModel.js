const mongoose = require('mongoose');

//schema
const ResturantSchema = new mongoose.Schema({
   Title: {
    type: String,
    required: [true, 'Restaurant Name is Required']
   },
   ImageURL: {
    type: String,
   },
   Foods: {   
    type: Array,
    default: []
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
    type: String
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
    type: String
   },
   Coords: {
    id: { type: String },
    latitude: { type: Number },
    latitudeDelta: { type: Number },
    longitude: { type: Number },
    longitudeDelta: { type: Number },
    address: { type: String },
    title: { type: String }
   },
   // Additional fields for better UI
   address: {
    type: String
   },
   phone: {
    type: String
   },
   cuisine: {
    type: String
   },
   price: {
    type: String,
    default: "₹200 for two"
   },
   description: {
    type: String
   }
}, { timestamps: true }
);

// Virtual for average rating
ResturantSchema.virtual('averageRating').get(function() {
  return this.Rating;
});

// Method to update rating
ResturantSchema.methods.updateRating = function(newRating) {
  const total = this.Rating * this.RatingCount + newRating;
  this.RatingCount += 1;
  this.Rating = (total / this.RatingCount).toFixed(1);
  return this.save();
};

module.exports = mongoose.model('Resturant', ResturantSchema);