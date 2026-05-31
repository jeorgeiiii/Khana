const express = require('express');
const ensureAuthenticated = require('../middlewares/Auth');

const router = express.Router();

// This route is protected - only authenticated users can access
router.get('/', ensureAuthenticated, (req, res) => {
    console.log('Logged in user detail:', req.user);
    
    res.status(200).json([
        {
            name: "Paneer Tikka",
            price: 200,
            category: "Indian",
            rating: 4.5,
            description: "Grilled cottage cheese with spices"
        },
        {
            name: "Butter Chicken",
            price: 300,
            category: "Indian",
            rating: 4.7,
            description: "Creamy tomato based curry with chicken"
        },
        {
            name: "Chowmein",
            price: 150,
            category: "Chinese",
            rating: 4.5,
            description: "Stir-fried noodles with vegetables"
        },
        {
            name: "Fried Rice",
            price: 180,
            category: "Chinese",
            rating: 4.6,
            description: "Wok-tossed rice with veggies and eggs"
        },
        {
            name: "Margherita Pizza",
            price: 250,
            category: "Italian",
            rating: 4.4,
            description: "Classic cheese and tomato pizza"
        }
    ]);
});

module.exports = router;