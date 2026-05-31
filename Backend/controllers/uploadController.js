const resturantModel = require("../models/resturantModel");
const foodModel = require("../models/foodModel");
const { cloudinary } = require("../config/cloudinary");

// Upload restaurant with image
const uploadRestaurantWithImage = async (req, res) => {
  try {
    // req.file contains the uploaded image info from Cloudinary
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Please upload an image"
      });
    }

    // Cloudinary returns the image URL in req.file.path
    const imageUrl = req.file.path;
    const cloudinaryId = req.file.filename; // For future deletion if needed

    const {
      Title,
      cuisine,
      price,
      discount,
      deliveryTime,
      promoted,
      address,
      phone,
      Time,
      Rating
    } = req.body;

    // Validation
    if (!Title || !cuisine || !address) {
      return res.status(400).send({
        success: false,
        message: "Please provide Title, cuisine and address"
      });
    }

    const newResturant = new resturantModel({
      Title,
      ImageURL: imageUrl, // Store Cloudinary URL in MongoDB
      cloudinaryId, // Store ID for later deletion
      cuisine,
      price: price || "₹200 for two",
      discount: discount || "50% OFF",
      deliveryTime: deliveryTime || "30 min",
      promoted: promoted === 'true' || promoted === true,
      address,
      phone,
      Time: Time || "30-40 min",
      Rating: Rating || 4.0,
      RatingCount: 0
    });

    await newResturant.save();

    res.status(201).send({
      success: true,
      message: 'Restaurant created successfully with image',
      restaurant: newResturant,
      imageUrl: imageUrl // Send back the Cloudinary URL
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error creating restaurant',
      error
    });
  }
};

// Upload food item with image
const uploadFoodWithImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Please upload an image"
      });
    }

    const imageUrl = req.file.path;
    const cloudinaryId = req.file.filename;

    const {
      Title,
      Category,
      Price,
      Description,
      restaurantId,
      veg
    } = req.body;

    if (!Title || !restaurantId) {
      return res.status(400).send({
        success: false,
        message: "Please provide Title and restaurantId"
      });
    }

    const newFood = new foodModel({
      Title,
      Category: Category || "Other",
      Price: Price || 199,
      Description: Description || "",
      ImageURL: imageUrl,
      cloudinaryId,
      restaurantId,
      veg: veg === 'true' || veg === true
    });

    await newFood.save();

    // Also add food reference to restaurant
    await resturantModel.findByIdAndUpdate(
      restaurantId,
      { $push: { Foods: newFood._id } }
    );

    res.status(201).send({
      success: true,
      message: 'Food item created successfully',
      food: newFood,
      imageUrl: imageUrl
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error creating food item',
      error
    });
  }
};

// Delete image from Cloudinary
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    res.status(200).send({
      success: true,
      message: 'Image deleted successfully',
      result
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error deleting image',
      error
    });
  }
};

module.exports = {
  uploadRestaurantWithImage,
  uploadFoodWithImage,
  deleteImage
};