const mongoose=require('mongoose')

//schema
const userSchema=new mongoose.Schema({
    UserName:{
        type:String,
        required:[true,'USername is Required']
    },
    email:{
        type:String,
        required:[true,'Email is Required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Password is Required']
    },
    address:{
        type:Array
    },
    phone:{
        type:String,
        required:[true,'Phone Number is Required']
    },
    usertype:{
        type:String,
        required:[true,'User Type is Required'],
        default:'Client',
        enum:['Client','Admin','Vendor','Driver']
    },
    profile:{
        type:String,
        default:"C:\Users\Prince\Desktop\Study\profile-default-icon-2048x2045-u3j7s5nj.png"
    },
    answer:{
        type:String,
        required:[true,'Answer is Required'], 
    }, 

},
{timestamps:true})

//exporting
module.exports=mongoose.model('USer',userSchema);