const foodModel = require("../models/foodModel");
const orderModel = require("../models/orderModel");

const createFoodController =async(req,res)=>{
    try {
        const{Title,
            Description,
            Price,
            ImageURL,
            FoodTags,
            Category,
            Code,
            isAvaliable,
            resturant,
            Rating,
            Rating_Count}=req.body;
            if(!Title || !Description || !Price || !resturant){
                return res.status(500).send({
                    success:false,
                    message:'Please Provide All Fields'
                })
            }
            const newFood = new foodModel({Title,
            Description,
            Price,
            ImageURL,
            FoodTags,
            Category,
            Code,
            isAvaliable,
            resturant,
            Rating,
            Rating_Count,
            });
            await newFood.save() 
            res.status(201).send({
                success:true,
                message:'New Food Items Created',
                newFood,
            })
    } catch (error) {
        console.log(error),
        res.status(500).send({
            success:false,
            message:'Error in Food Creating APIs',
            error,
        })
        
    }

};

//Get All Food By  Id
const getAllFoodController=async(req,res)=>{
    try {
        const foods =await foodModel.find({})
        if(!foods){
            return res.status(404).send({
                success:false,
                message:'No Food Items are Found'

            })
        }
        res.status(200).send({
            success:true,
            total_foods : foods.length,
            foods,

        })
    } catch (error) {
        console.log(error)
        res.status().send({
            success:false,
            message:'Error In All Food APIs'
        })
        
    }

}; 

//Get SIngle Food By Id
const getSinglefoodController= async(req,res)=>{
try {
    const foodId =req.params.id
    if(!foodId){
        return res.status(404).send({
            success:false,
            message:'Pleae Prvide Correct Food ID'
        })
    }
    const food =await foodModel.findById(foodId)
    if(!food){
        return res.status(404).send({
            success:false,
            message:'No Food Found With This ID'
        });
    }
    res.status(200).send({
        success:true,
        food,
    })
} catch (error) {
    console.log(error),
    res.status(500).send({
        success:false,
        message:"Error in  Single Food API ",
        error,


    })
    
}
}; 

//Get Food By Resturant 
const getFoodByResturantController= async(req,res)=>{
    try {
        const resturantid =req.params.id
        if(!resturantid){
            return res.status(404).send({
                success:false,
                message:'Pleae Prvide Correct Food ID'
            })
        }
        const food =await foodModel.find({resturant:resturantid})
        if(!food){
            return res.status(404).send({
                success:false,
                message:'No Food Found With This ID'
            });
        }
        res.status(200).send({
            success:true,
            message:'Food Based On Resturant',
            food,
        })
    } catch (error) {
        console.log(error),
        res.status(500).send({
            success:false,
            message:"Error in  Single Food API ",
            error,
    
    
        })
        
    }
    }; 


//Update Food By ID
    const updateFoodController=async(req,res)=>{
        try {
            const foodID=req.params.id
            if(!foodID){
                res.status(404).send({
                    success:false,
                    message:'No Food ID Found'
                })
            }
            const food=await foodModel.findById(foodID)
            if(!food){
                res.status(404).send({
                    success:false,
                    message:'No Food Found'
                })
            }
            const {Title,
                Description,
                Price,
                ImageURL,
                FoodTags,
                Category,
                Code,
                isAvaliable,
                resturant,
                Rating,
                Rating_Count} =req.body
                const  updatedFood=  await foodModel.findByIdAndUpdate(foodID,{ 
                    Title,
                    Description,
                    Price,
                    ImageURL,
                    FoodTags,
                    Category,
                    Code,
                    isAvaliable,
                    resturant,
                    Rating,  
                },{new:true})
                res.status(200).send({
                    success:true,
                    message :"Food Item Was Updated",
                })
            
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success:false,
                message:'Error in Food Update API',
                error,
            })
            
        }

    };

//Delete Food By Id
    const deleteFoodController =async(req,res)=>{
        try {
            const  foodID =req.params.id
            if(!foodID){
                return res.status(404).send({
                    success:false,
                    message:'Food Id Not Found'
                })
            }
            const food= await foodModel.findById(foodID)
            if(!foodID){
                return res.status(404).send({
                    success:false,
                    message:'No Food Found With ID'
                })
            }
            await  foodModel.findByIdAndDelete(foodID)
            res.status(200).send({
                success:true,
                message:'Food Item Deleted'
            })
        } catch (error) {
            console.log(error),
            res.status(500).send({
                success:false,
                message:'Error in Food Delete API',
                error,
            })
            
        }

    };

//Place Order
    const placeOrderController=async(req,res)=>{
    try {
        const  {cart}=req.body
        if(!cart){
            res.status(500).send({
                success:false,
                message:'Please  Provide Food Cart or Payment Method'   
 })
        }
        var total = 0;
        //Calculate
        cart.map((i)=>{
            total +=i.Price;
        });4

        const  newOrder1= new orderModel({
            Foods:cart,
            Payment:total,
            Buyer:res.body.id
        }) ;
        await newOrder1.save();
        res.status(201).send({
            success:true,
            messgae:'Order Placed Successfully',
            newOrder1,
        })
    } catch (error) {
        console.log(error),
        res.status(500).send({
            success:false,
            message:'Error in Order API',
            error
        })
        
    }


}

//CHANGE ORDER STATUS

const orderStatusController = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(404).send({
        success: false,
        message: "Please Provide valid order id",
      });
    }
    const { Status } = req.body;
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { Status },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Order Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Order Status API",
      error,
    });
  }
};



module.exports={createFoodController,
    getAllFoodController,
    getSinglefoodController,
    getFoodByResturantController,
    updateFoodController,
    deleteFoodController,
    placeOrderController,
    orderStatusController,


};