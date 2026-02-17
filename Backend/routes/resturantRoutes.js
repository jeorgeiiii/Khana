const express = require('express')

const authMiddleware = require('../middlewares/authMiddleware');
const { createResturantController, getAllResturantController, getResturantByIdController, deleteResturantController } = require('../controllers/resturantController');
const router = express.Router();

//routes
//Create Resturant || Post
router.post('/create',authMiddleware,createResturantController);

//Get All Resturant ||Get

router.get('/getAll',getAllResturantController);

// Get Resturant By Id
router.get('/get/:id',getResturantByIdController);

//Delete Resturant
router.delete('/delete/:id',authMiddleware,deleteResturantController);


module.exports=router