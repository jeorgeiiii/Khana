const { rainbow } = require('colors');
const mongoose=require('mongoose')

//schema
const categorySchema=new mongoose.Schema( 
    {
        Title:{
            type:String,
            required:[true,'category title is required']
        },
        ImageURL:{
            type:String,
            default: "https://image.similarpng.com/very-thumbnail/2021/09/Good-food-logo-design-on-transparent-background-PNG.png",
        },




},
   {timestamps:true}
);


//exporting
module.exports=mongoose.model('Category',categorySchema);