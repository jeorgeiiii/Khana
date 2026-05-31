//Create Resturant
const resturantModel = require("../models/resturantModel");
const foodModel = require("../models/foodModel");
// Comment out models that don't exist yet



const createResturantController = async(req ,res) => {
    try {
        const {
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
            Coords,
            address,
            phone,
            cuisine,
            price
        } = req.body;
        
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
            Coords,
            address,
            phone,
            cuisine,
            price
        });
        
        await newResturant.save();
        res.status(201).send({
            success:true,
            message:'New Restaurant Been Created',
            restaurant: newResturant
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
           success:false,
           message:'Error in Create Restaurant Api',
           error
        });
    }
}

//Get All Restaurants
const getAllResturantController = async(req,res) =>{
    try {
        const restaurants = await resturantModel.find({})
        if(!restaurants || restaurants.length === 0){
            return res.status(404).send({
                success:false,
                message:'Restaurants Unavailable',
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
            message:'Error in Get All Restaurants Api',
            error
        });
    }
};

//Get Restaurant By Id
const getResturantByIdController = async(req,res) =>{
    try {
        const restaurantId = req.params.id;
        
        if(!restaurantId){
            return res.status(404).send({
                success:false,
                message:"Please Provide Restaurant ID"
            })
        }
        
        const restaurant = await resturantModel.findById(restaurantId);
        
        if(!restaurant){
            return res.status(404).send({
                success:false,
                message:"Restaurant Not Found",
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
        });
    }
}

//Get Restaurant Menu
const getRestaurantMenuController = async(req, res) => {
    try {
        const restaurantId = req.params.id;
        
        // Find all food items for this restaurant
        const menu = await foodModel.find({ restaurantId: restaurantId });
        
        res.status(200).send({
            success: true,
            foods: menu  // Change 'menu' to 'foods' to match frontend expectation
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching restaurant menu',
            error
        });
    }
};

//Get Restaurant Categories
const getRestaurantCategoriesController = async(req, res) => {
    try {
        const restaurantId = req.params.id;
        
        // Get unique categories from food items
        const categories = await foodModel.distinct('category', { restaurantId: restaurantId });
        
        res.status(200).send({
            success: true,
            categories: categories.map(cat => ({ name: cat }))
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching restaurant categories',
            error
        });
    }
};

//Get Restaurant Photos
const getRestaurantPhotosController = async(req, res) => {
    try {
        const restaurantId = req.params.id;
        
        const restaurant = await resturantModel.findById(restaurantId);
        
        // Combine restaurant image and food images
        let photos = [];
        
        if (restaurant && restaurant.ImageURL) {
            photos.push({ url: restaurant.ImageURL, type: 'restaurant' });
        }
        
        if (restaurant && restaurant.Logourl) {
            photos.push({ url: restaurant.Logourl, type: 'logo' });
        }
        
        // Get food images
        const foodItems = await foodModel.find({ restaurantId: restaurantId }).select('ImageURL Title');
        foodItems.forEach(item => {
            if (item.ImageURL) {
                photos.push({ 
                    url: item.ImageURL, 
                    type: 'food',
                    title: item.Title 
                });
            }
        });
        
        res.status(200).send({
            success: true,
            photos: photos
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching restaurant photos',
            error
        });
    }
};
// Get restaurants by location
const getRestaurantsByLocationController = async (req, res) => {
    try {
        const { location } = req.params;
        
        // Case-insensitive search
        const restaurants = await resturantModel.find({
            $or: [
                { location: { $regex: new RegExp(location, 'i') } },
                { 'Coords.address': { $regex: new RegExp(location, 'i') } }
            ]
        });
        
        if (!restaurants || restaurants.length === 0) {
            return res.status(404).send({
                success: false,
                message: `No restaurants found in ${location}`,
                restaurants: []
            });
        }
        
        res.status(200).send({
            success: true,
            total: restaurants.length,
            location: location,
            restaurants
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in getting restaurants by location',
            error
        });
    }
};
//Search restaurants
const searchRestaurantsController = async (req, res) => {
    try {
        const { query, cuisine, minRating, maxPrice } = req.query;
        
        let searchQuery = {};
        
        if (query) {
            searchQuery.$or = [
                { Title: { $regex: query, $options: 'i' } },
                { cuisine: { $regex: query, $options: 'i' } },
                { 'Coords.address': { $regex: query, $options: 'i' } }
            ];
        }
        
        if (cuisine) {
            searchQuery.cuisine = { $regex: cuisine, $options: 'i' };
        }
        
        if (minRating) {
            searchQuery.Rating = { $gte: parseFloat(minRating) };
        }

        const restaurants = await resturantModel.find(searchQuery).limit(20);
        
        res.status(200).send({
            success: true,
            total: restaurants.length,
            restaurants
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error searching restaurants',
            error
        });
    }
};

// Get nearby restaurants
const getNearbyRestaurantsController = async (req, res) => {
    try {
        const { latitude, longitude, maxDistance = 5000 } = req.body; // distance in meters

        if (!latitude || !longitude) {
            return res.status(400).send({
                success: false,
                message: 'Please provide latitude and longitude'
            });
        }

        // Find restaurants within radius
        const restaurants = await resturantModel.find({
            'Coords.latitude': { $exists: true },
            'Coords.longitude': { $exists: true }
        });

        // Calculate distance and filter
        const nearbyRestaurants = restaurants.filter(restaurant => {
            if (restaurant.Coords?.latitude && restaurant.Coords?.longitude) {
                const distance = calculateDistance(
                    latitude,
                    longitude,
                    restaurant.Coords.latitude,
                    restaurant.Coords.longitude
                );
                return distance <= maxDistance / 1000; // convert to km
            }
            return false;
        });

        res.status(200).send({
            success: true,
            total: nearbyRestaurants.length,
            restaurants: nearbyRestaurants
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error finding nearby restaurants',
            error
        });
    }
};

//Delete Restaurant
const deleteResturantController = async(req,res) =>{
    try {
        const restaurantId = req.params.id;
        
        if(!restaurantId){
            return res.status(404).send({
                success:false,
                message:'Please Provide Restaurant ID'
            })
        } 
        
        await resturantModel.findByIdAndDelete(restaurantId);
        
        // Also delete associated food items
        await foodModel.deleteMany({ restaurantId: restaurantId });
        
        res.status(200).send({
            success:true,
            message:'Restaurant Deleted Successfully'
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in delete restaurant api',
            error
        });
    }
}

//Update Restaurant
const updateResturantController = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const updates = req.body;

        const updatedRestaurant = await resturantModel.findByIdAndUpdate(
            restaurantId,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedRestaurant) {
            return res.status(404).send({
                success: false,
                message: 'Restaurant not found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Restaurant updated successfully',
            restaurant: updatedRestaurant
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error updating restaurant',
            error
        });
    }
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// Get restaurant statistics
const getRestaurantStatsController = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        
        const restaurant = await resturantModel.findById(restaurantId);
        
        if (!restaurant) {
            return res.status(404).send({
                success: false,
                message: 'Restaurant not found'
            });
        }

        // Get food count
        const foodCount = await foodModel.countDocuments({ restaurantId: restaurantId });

        const stats = {
            totalFoodItems: foodCount,
            rating: restaurant.Rating || 0,
            ratingCount: restaurant.RatingCount || 0,
            isOpen: restaurant.isOpen,
            pickup: restaurant.Pickup,
            delivery: restaurant.Delivery
        };

        res.status(200).send({
            success: true,
            stats
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error getting restaurant stats',
            error
        });
    }
};

// Comment out these controllers for now (they need models that don't exist yet)
/*
//Get Restaurant Reviews
const getRestaurantReviewsController = async(req, res) => {
    try {
        const restaurantId = req.params.id;
        
        // You'll need a review model - this is a placeholder
        const reviews = await reviewModel.find({ restaurantId: restaurantId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        
        res.status(200).send({
            success: true,
            reviews: reviews
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching restaurant reviews',
            error
        });
    }
};

//Get Restaurant Offers
const getRestaurantOffersController = async(req, res) => {
    try {
        const restaurantId = req.params.id;
        
        // You'll need an offer model - this is a placeholder
        const offers = await offerModel.find({ 
            restaurantId: restaurantId,
            isActive: true 
        });
        
        res.status(200).send({
            success: true,
            offers: offers
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching restaurant offers',
            error
        });
    }
};
*/

// Export only the controllers that are implemented
module.exports = {
    createResturantController,
    getAllResturantController,
    getResturantByIdController,
    deleteResturantController,
    updateResturantController,
    searchRestaurantsController,
    getNearbyRestaurantsController,
    getRestaurantStatsController,
    getRestaurantMenuController,
    getRestaurantCategoriesController,
    getRestaurantPhotosController,
    getRestaurantsByLocationController,
    // getRestaurantReviewsController,  // Commented out for now
    // getRestaurantOffersController     // Commented out for now
};