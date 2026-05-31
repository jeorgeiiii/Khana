const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Placeholder for reviews - return empty array
router.get('/get/:restaurantId', async (req, res) => {
    res.status(200).json({
        success: true,
        reviews: []
    });
});

module.exports = router;