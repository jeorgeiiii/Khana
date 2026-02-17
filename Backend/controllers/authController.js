const Usermodel = require("../models/Usermodel");
var bcrypt1 = require('bcryptjs');
const JWT=require('jsonwebtoken');
//Register
const registerController=async(req,res) =>{
try {
    const {UserName,email,password,phone,address,answer}=req.body
    //validation
    if(!UserName || !email || !password || !address ||!phone || !answer ){
        return res.status(500).send({
            success:false,
            message:'Please Provide All Details'

        })
    }
    //Check Existing USer
    const existing =await Usermodel.findOne({email});
    if(existing){
        return res.status(500).send({
            success:false,
            message:'Email Already Exist.Please Login'
        });
    }

    //Hasing Password  
    var salti = bcrypt1.genSaltSync(10);
    const hashed_p= await bcrypt1.hash(password,salti);

    //Create New USer
    const user =await Usermodel.create({UserName,
        email,
        password:hashed_p,
        phone,
        address
        ,answer});
    res.status(201).send({
        success:true,
        message:'Successfully Registered',
        user,
    });

    
} catch (error) {
    console.log(error)
    res.status(500).send({
        sucess:false,
        message:'Error in Register API',
        error,
    })

    
}
};


//Login
const loginController = async(req,res) =>{
    try {
        
        const {email,password}=req.body
        //Validation
        if(!email || !password){
            return res.status(500).send({
                success:false,
                message:'Please Provide Email or Password'
            });
        }
        //Check User
        const user = await Usermodel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'User Not Found '
            });
        }
        //Check Password
        const  isMatch = await bcrypt1.compare(password,user.password)
        if(!isMatch){
            return res.status(500).send({
                success:false,
                message:' Inavlid Credential'
            });
        }
        user.password=undefined;
        //Token
        const token =JWT.sign({
            id:user._id
        },process.env.JWT_SECRET,{
            expiresIn:'7d'
        });
        res.status(200).send({
            success:true,
            message:"Login Successfully",
            user,
            token,
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Login API',
            error
        })
        
    }

};








module.exports={
    registerController,
    loginController
};