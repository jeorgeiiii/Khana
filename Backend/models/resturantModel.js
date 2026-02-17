const { rainbow } = require('colors');
const mongoose=require('mongoose')

//schema
const ResturantSchema=new mongoose.Schema({
   Title: {
    type:String,
    required:[true,'Resturant Name is Required']
   },
   ImageURL:{
    type:String,

   },
   Foods:{   
    type:Array,
   },
   Time:{
    type:String
},

   Pickup:{
    type:Boolean,
    default:true,
   },

   Delivery:{
    type:Boolean,
    default:true
   },

   isOpen:{
    type:Boolean,
    default:true
   },

   Logourl:{
    type:String
   },
   
   Rating:{
    type:Number,
    default:1,
    min:1,
    max:5
   },

   RatingCount :{
    type:String
   },

   Code:{
    type:String
   },

   Coords:{
    id:{type:String,},
    latitude:{type:Number},
    latitudeDelta:{type:Number},
    longitude:{type:Number},
    longitudeDelta:{type:Number},
    address:{type:String},
    title:{type:String}
   },

},{timestamps:true}
);


//exporting
module.exports=mongoose.model('Resturant',ResturantSchema);