const { rainbow } = require('colors');
const mongoose=require('mongoose');
const resturantModel = require('./resturantModel');

//schema
const OrderSchema=new mongoose.Schema( 
    {
        Foods:[ 
            {type:mongoose.Schema.Types.ObjectId,
            ref:'Food'}
        ],
        Payment:{

        },
        Buyer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'USer',

        },
        Status:{
            type:String,
            enum:['Preparing','Prepared,On the way','Delivered'],
                default:'Preparing',
            
        }       
        }
,
   {timestamps:true}
);


//exporting
module.exports=mongoose.model('Order',OrderSchema);