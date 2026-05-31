const express = require('express');
const { 
    getUserController, 
    updateUserController, 
    getUserOrdersController,
    resetPasswordController, 
    updatePasswordController, 
    deleteProfileController,
    addAddressController,
    getAddressesController
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get User Data
router.get('/getuser', getUserController);

// Get User Orders
router.get('/orders', getUserOrdersController);

// Update Profile 
router.put('/updateUser', updateUserController);

// Update Password
router.post('/updatePassword', updatePasswordController); 

// Reset password
router.post('/resetPassword', resetPasswordController);

// Delete User
router.delete('/deleteuser/:id', deleteProfileController);


// Get User Addresses
router.get('/addresses', authMiddleware, getAddressesController);

// Add New Address
router.post('/add-address', authMiddleware, addAddressController);

module.exports = router;