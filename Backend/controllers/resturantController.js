//Create Resturant

const resturantModel = require("../models/resturantModel");

const createResturantController = async(req ,res) => {
    try {
        const {Title,
            ImageURL,
            Foods,
            Time,
            Pickup,
            Delivery,
            isOpen,
            Logourl,
            Rating,
            RatingCount,
            Code,
            Coords}=req.body
        //Validation
        if(!Title || !Coords){
            return res.status(500).send({
                success:false,
                message:"Please Provide Title and Address",
            });
        }
        const newResturant = new resturantModel({
            Title,
            ImageURL,
            Foods,
            Time,
            Pickup,
            Delivery,
            isOpen,
            Logourl,
            Rating,
            RatingCount,
            Code,
            Coords });
            await newResturant.save()
            res.status(201).send({
                success:true,
                message:'New Resturant Been Created',

            })


    } catch (error) {
        console.log(error)
        res.status(500).send({
           success:false,
           message:'Error in Create Resturant Api',
           error
        })
        
    }
}

//Get All Resturant

const getAllResturantController = async(req,res) =>{
    try {
        const restaurants =await resturantModel.find({})
        if(!restaurants){
            return res.status(404).send({
                success:false,
                message:'Resturant Unavaliable',
            })
        }
        res.status(200).send({
            success:true,
            totalcount:restaurants.length,
            restaurants  
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Get All Resturant Api'
        })
        
    }

};

//Get Resturant By Id

const getResturantByIdController =async(req,res) =>{
    try {
        const   restaurantId=req.params.id
        //Find Resturant
        if(!restaurantId){
            return res.status(404).send({
                success:false,
                message:"Please Provide Resturant ID"
            })
        }
        const restaurant = await resturantModel.findById(restaurantId)
        if(!restaurant){
            return res.status(404).send({
                success:false,
                message:"Resturant Not Found",
              
            })
        }
        res.status(200).send({
            success:true,
            restaurant,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Getting API By ID',
            error
        })
        
    }


}

//Delete Resturent
const deleteResturantController =async(req,res) =>{
    try {
        const resturantId=req.params.id
        if(!resturantId){
            return res.status(404).send({
                success:false,
                message:'Please Provide Resturant ID'
            })
        } 
        await resturantModel.findByIdAndDelete(resturantId)
        res.status(200).send({
            success:true,
            message:'Resturant Deleted Successfully'
        })
        if(!resturantId){
            return res.status(404).send({
                success:false,
                message:'No Resturant Found or Provide Resturant By ID'
            })
        }

        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in delete resturant api',
            error

        })
        
    }

}


module.exports ={
    createResturantController,
     getAllResturantController,
     getResturantByIdController,
     deleteResturantController,
    
 };