const express = require('express');
const { 
  uploadRestaurantImage, 
  uploadFoodImage 
} = require('../config/cloudinary');
const {
  uploadRestaurantWithImage,
  uploadFoodWithImage,
  deleteImage
} = require('../controllers/uploadController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Upload restaurant with image
router.post(
  '/restaurant',
  authMiddleware,
  uploadRestaurantImage.single('image'),
  uploadRestaurantWithImage
);

// Upload food item with image
router.post(
  '/food',
  authMiddleware,
  uploadFoodImage.single('image'),
  uploadFoodWithImage
);

// Delete image from Cloudinary
router.delete('/image/:publicId', authMiddleware, deleteImage);

module.exports = router;