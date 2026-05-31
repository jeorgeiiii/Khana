const express = require('express');
const { 
    getAllNightlife, 
    getNightlifeByLocation,
    getNightlifeById,
    addNightlife 
} = require('../controllers/nightlifeController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

// Public routes
router.get('/all', getAllNightlife);
router.get('/location/:location', getNightlifeByLocation);
router.get('/:id', getNightlifeById);

// Protected routes (admin only)
router.post('/add', authMiddleware, adminMiddleware, addNightlife);

module.exports = router;