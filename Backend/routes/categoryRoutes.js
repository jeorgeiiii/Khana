const express = require('express')

const authMiddleware = require('../middlewares/authMiddleware');
const { createCatController, getAllController, updateCategoryControllers, deleteCategoryController } = require('../controllers/categoryController');
const router = express.Router();

//routes

//Create Category
router.post('/create',authMiddleware,createCatController);

//GET ALL Category
router.get('/getALL',getAllController);


// UPDATE Category
router.put('/update/:id',authMiddleware,updateCategoryControllers);

//Delete Category
 router.delete('/delete/:id',authMiddleware,deleteCategoryController);


module.exports=router