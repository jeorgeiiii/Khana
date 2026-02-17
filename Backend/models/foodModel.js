const { rainbow } = require('colors');
const mongoose=require('mongoose');
const resturantModel = require('./resturantModel');

//schema
const foodSchema=new mongoose.Schema( 
    {
        Title:{
            type:String,
            required:[true,'Food Title is required']
        },

        Description:{ 
            type:String,
            required:[true,'Description is required'],


        },

        Price:{
            type:Number,
            required:[true,'Food Price is required']
        },

        ImageURL:{
            type:String,
            default: "https://image.similarpng.com/very-thumbnail/2021/09/Good-food-logo-design-on-transparent-background-PNG.png"
        },
        

        FoodTags:{
            type:String

        },
        Category:{
            type:String,  

        },
       Code:{
        type:String,
       },

       isAvaliable :{
        type:Boolean,
        default:true,
       },
       resturant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Resturant'
       },

       Rating:{
        type:Number,
        default:3,
        min:1,
        max:5
       },
       
       Rating_Count:{
        type:String,

       }




},
   {timestamps:true}
);


//exporting
module.exports=mongoose.model('Food',foodSchema);