const express = require('express')
const { getUserController, updateUserController, resetPasswordController,  updatepasswordcontroller, deleteProfileController } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router()

//routes
//Get User Data
router.get('/getuser',authMiddleware,getUserController);

// Update Profile 
router.put('/updateUser',authMiddleware,updateUserController);

//Update Password
router.post("/UpdatePassword",authMiddleware,updatepasswordcontroller); 

//Reset password
router.post('/ResetPassword',authMiddleware,resetPasswordController);

//Delete User
router.delete('/deleteuser/:id',authMiddleware,deleteProfileController);



module.exports=router