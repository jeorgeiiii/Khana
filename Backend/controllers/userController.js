const bcrypt1 = require("bcryptjs");
const Usermodel = require("../models/Usermodel");
var bcrypt2=require('bcryptjs');

//Get user Info
const getUserController=async(req,res) =>{
    try {
        //Find User
        const user = await Usermodel.findById({_id:req.body.id},)
        //Validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'User Not Found'
            });
        }
        //Hide Password
        user.password =undefined;
        //response
        res.status(200).send({
            success:true,
            message:'User get Successfully',
            user
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Get User API',
            error
        })

        
    }

};

//Update User
const updateUserController=async(req,res) =>{
    try { 
        //Find User
        const user=await Usermodel.findById({_id:req.body.id})
        //Validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'User not found'
            })

        }
        //Update
        const {UserName,address,phone,} =req.body
        if(UserName) user.UserName=UserName
        if(address) user.address=address
        if(phone) user.phone=phone    
        //Save User
        await user.save()
        res.status(200).send({ 
            success:true,
            message:'User is Updated Sucessfully' 
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in User Update Apis',
            error,
        })
        
    }
};
//Reset Password
const resetPasswordController = async(req,res) =>{
    try {
        const {email,newpassword,answer}=req.body
        if(!email || !newpassword || !answer){
            return res.status(500).send({
                success:false,
                message:'Please Provide All Fields'
            })
        }
        const user = await Usermodel.findOne({email,answer})
        if(!user){
            return res.status(500).send({
                success:false,
                message:'User Not Found Or Invalid Answer'
            })
        }
          //Hashing Password  
    var salti = bcrypt2.genSaltSync(10);
    const hashed_p= await bcrypt2.hash(newpassword,salti); 
    await user.save()
        res.status(200).send({
            success:true,
            message:'Password  Reset Sucessfully'
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Reset Api',
            error
        })
        
    }

}
//Update User Password 
const updatepasswordcontroller= async(req,res) =>{
    try {
        //Find User
        const user=await Usermodel.findById({_id:req.body.id})
        //Validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'User not found'
            })
        }
        //Get Data From User
        const {oldpassword,newpassword}=req.body
        if(!oldpassword || !newpassword){
            return res.status(500).send({
                success:false,
                message:'Please Provide Old or New Password'
            })
        }
        
        //Check User Password | Compare  Password
            const  isMatch = await bcrypt2.compare( oldpassword,user.password)
        if(!isMatch){
            return res.status(500).send({
                success:false,
                message:' Inavlid Password'
            });
        } 


            //Hasing Password  
            var salti = bcrypt2.genSaltSync(10);
            const hashed_p= await bcrypt2.hash(password,salti);
            user.password=hashed_p
             await user.save()
             res.status(200).send({
                success:true,
                message:' Passsword  Updated',
             })
        
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Password Reset',
            error
        })
        
    }

};

//Delete User
const deleteProfileController =async(req,res)=>{
    try {
        await Usermodel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success:true,
            message:'Your Account Has Been Deleted'
        });

        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Delete Profile',
            error
        })
        
    }

}

module.exports={getUserController,updateUserController,resetPasswordController,updatepasswordcontroller,deleteProfileController};