const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Check if environment variables are loaded
console.log('Cloudinary Config Check:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Loaded' : '❌ Missing');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Loaded' : '❌ Missing');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Loaded' : '❌ Missing');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for restaurant images
const restaurantStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zomoro/restaurants',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 500, height: 300, crop: 'limit' }],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split('.')[0];
      return `${originalName}-${timestamp}`;
    }
  }
});

// Configure storage for food images
const foodStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zomoro/foods',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 300, height: 200, crop: 'limit' }]
  }
});

// Create multer upload instances
const uploadRestaurantImage = multer({ storage: restaurantStorage });
const uploadFoodImage = multer({ storage: foodStorage });

console.log('✅ Cloudinary upload functions created');

module.exports = {
  cloudinary,
  uploadRestaurantImage,
  uploadFoodImage
  // REMOVED connectDB from here - it belongs in db.js
};