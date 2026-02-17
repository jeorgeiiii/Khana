const express = require('express')
const { registerController, loginController } = require('../controllers/authController')

const router = express.Router()

//routes
//Register || Post
router.post('/register',registerController);

//Login ||Post
router.post('/login',loginController);

module.exports=router