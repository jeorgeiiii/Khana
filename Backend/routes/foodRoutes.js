const express = require('express')

const authMiddleware = require('../middlewares/authMiddleware');
const { 
    createFoodController, 
    getAllFoodController, 
    getSinglefoodController, 
    getFoodByResturantController, 
    updateFoodController, 
    deleteFoodController, 
    placeOrderController, 
    orderStatusController,
    getRestaurantMenuController  // ADD THIS
} = require('../controllers/foodController');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

//routes
//Create Food
router.post('/create', authMiddleware, createFoodController);

//Get All Food
router.get('/getAll', getAllFoodController);

//Single Food
router.get('/get/:id', getSinglefoodController);

//Get Food By Resturant (for menu) - ADD THIS
router.get('/restaurant/:id', getFoodByResturantController);

// NEW: Get restaurant menu (alias for getFoodByResturantController)
router.get('/menu/:restaurantId', getFoodByResturantController);

//Update Food
router.put('/update/:id', authMiddleware, updateFoodController);

//Delete Food
router.delete('/delete/:id', authMiddleware, deleteFoodController);

//Place Order
router.post('/placeorders', authMiddleware, placeOrderController);

// Order Status
router.post('/orderStatus/:id', authMiddleware, adminMiddleware, orderStatusController);

module.exports = router;