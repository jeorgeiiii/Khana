const bcrypt = require('bcryptjs');
const UserModel = require("../models/User");

// Get user Info
const getUserController = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.id;
        
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: 'User not authenticated'
            });
        }

        const user = await UserModel.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User Not Found'
            });
        }
        
        res.status(200).send({
            success: true,
            message: 'User fetched successfully',
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Get User API',
            error: error.message
        });
    }
};

// Update User
const updateUserController = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.id;
        
        if (!userId) {
            return res.status(401).send({
                success: false,
                message: 'User not authenticated'
            });
        }
        
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }
        
        const { name, UserName, address, phone, password } = req.body;
        
        if (name) user.name = name;
        if (UserName) user.UserName = UserName;
        if (address) user.address = address;
        if (phone) user.phone = phone;
        
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            user.password = await bcrypt.hash(password, salt);
        }
        
        await user.save();
        
        res.status(200).send({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                usertype: user.usertype
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in User Update API',
            error: error.message
        });
    }
};

// Get User Orders
const getUserOrdersController = async (req, res) => {
    try {
        res.status(200).send({
            success: true,
            orders: []
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// Reset Password
const resetPasswordController = async (req, res) => {
    try {
        const { email, newpassword, answer } = req.body;
        if (!email || !newpassword || !answer) {
            return res.status(400).send({
                success: false,
                message: 'Please Provide All Fields'
            });
        }
        const user = await UserModel.findOne({ email, answer });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User Not Found Or Invalid Answer'
            });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newpassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Password Reset Successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Reset API',
            error: error.message
        });
    }
};

// Update Password
const updatePasswordController = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.id;
        const { oldpassword, newpassword } = req.body;
        
        if (!oldpassword || !newpassword) {
            return res.status(400).send({
                success: false,
                message: 'Please Provide Old or New Password'
            });
        }
        
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(oldpassword, user.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: 'Invalid Old Password'
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newpassword, salt);
        user.password = hashedPassword;
        await user.save();
        
        res.status(200).send({
            success: true,
            message: 'Password Updated Successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Password Update',
            error: error.message
        });
    }
};

// Delete User
const deleteProfileController = async (req, res) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success: true,
            message: 'Your Account Has Been Deleted'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Delete Profile',
            error: error.message
        });
    }
};

// Get User Addresses
const getAddressesController = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.id;
        
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).send({
            success: true,
            addresses: user.address || []
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching addresses',
            error: error.message
        });
    }
};

// Add New Address
const addAddressController = async (req, res) => {
    try {
        const userId = req.user?.id || req.body?.id;
        const { street, city, state, pincode, type } = req.body;
        
        if (!street || !city || !state || !pincode) {
            return res.status(400).send({
                success: false,
                message: 'Please provide all address fields'
            });
        }
        
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }
        
        const newAddress = {
            street,
            city,
            state,
            pincode,
            type: type || 'home',
            isDefault: user.address.length === 0 // First address becomes default
        };
        
        user.address.push(newAddress);
        await user.save();
        
        res.status(201).send({
            success: true,
            message: 'Address added successfully',
            address: newAddress,
            addresses: user.address
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error adding address',
            error: error.message
        });
    }
};

// Update module.exports to include new functions
module.exports = {
    getUserController,
    updateUserController,
    getUserOrdersController,
    resetPasswordController,
    updatePasswordController,
    deleteProfileController,
    getAddressesController,  
    addAddressController      
};