//Create Category

const categoryModel = require("../models/categoryModel")

const  createCatController=async(req,res)=>{
    try {
        const {Title,ImageURL}=req.body
        //Validation
        if(!Title){
            return res.status(500).send({
                success:false,
                message:'Please Provide Category Title or Image'

            })
        }
        const newCategory =new  categoryModel({Title,ImageURL})
        await newCategory.save()
        res.status(201).send({
            success:true,
            message:'Category Created',
            newCategory,

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Create Category API'
        })
        
    }
}

//Get All Category
const getAllController =async(req,res)=>{
    try {
        const categories = await categoryModel.find({})
       if(!categories){
        res.status(404).send({
            success:false,
            message:'No Categories Found'
        })
       } 
       res.status(200).send({
        success: true,
        total_Cat:categories.length,
        categories,
       })
    } catch (error) {
        console.log(error),
        res.status(500).send({
            success:false,
            message:'Error in Get All Category API'

        })
    }
};

//Update Category
const updateCategoryControllers =async(req,res) =>{
    try {
        const {id}=req.params 
        const {Title,ImageURL}= req.body
        const updatedcategory = await categoryModel.findByIdAndUpdate(id,{Title,ImageURL},{new:true})
        if(!updatedcategory){
            return res.status(500).send({
                success:false,
                message:'No Category Found'
            })
        }
        res.status(200).send({
            success:true,
            message:'Category Updated Succesfully'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Update APIs'
        })
        
    }
};

//Delete Category
const deleteCategoryController =async(req,res)=>{
    try {
        const {id}= req.params
        if(!id){
            return res.status(500).send({
                success:false,
                message:'Please Provide Category Types'
            })
        }
        const category= await  categoryModel.findById(id)
        if(!category){
            return res.status(500).send({
                success:false,
                message:'No  Categories Found with Id'
            })
        }
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:'Category Deleted Succesfully'
        })
        
    } catch (error) {
        console.log()
        res.status(500).send({
            success:false,
            message:'Error in Delete APIs'
        })
        
    }

}


module.exports={createCatController,getAllController,updateCategoryControllers,deleteCategoryController};