const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware'); // You'll need to create this
const { 
    createResturantController, 
    getAllResturantController, 
    getResturantByIdController, 
    deleteResturantController,
    updateResturantController,
    getRestaurantStatsController,
    searchRestaurantsController,
    getNearbyRestaurantsController
} = require('../controllers/resturantController');

const router = express.Router();

// Public routes (no authentication required)
// Get all restaurants
router.get('/getAll', getAllResturantController);

// Get restaurant by ID
router.get('/get/:id', getResturantByIdController);

// Search restaurants
router.get('/search', searchRestaurantsController);

// Get nearby restaurants
router.post('/nearby', getNearbyRestaurantsController);

// Get restaurant statistics
router.get('/stats/:id', getRestaurantStatsController);

// Protected routes (authentication required)
// Create restaurant (admin only)
router.post('/create', authMiddleware, adminMiddleware, createResturantController);

// Update restaurant (admin only)
router.put('/update/:id', authMiddleware, adminMiddleware, updateResturantController);

// Delete restaurant (admin only)
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteResturantController);

module.exports = router;