const mongoose = require('mongoose');
require('dotenv').config();

const sampleFoods = [
  // Food for Olio Pizzeria
  {
    Title: "Margherita Pizza",
    ImageURL: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500",
    Category: "Pizza",
    Price: 299,
    Description: "Classic delight with 100% mozzarella cheese",
    restaurantId: null, // Will be filled after getting restaurant ID
    veg: true,
    rating: 4.5,
    ratingCount: 120
  },
  {
    Title: "Pepperoni Pizza",
    ImageURL: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500",
    Category: "Pizza",
    Price: 399,
    Description: "Spicy pepperoni with extra cheese",
    restaurantId: null,
    veg: false,
    rating: 4.7,
    ratingCount: 89
  },
  {
    Title: "Garlic Bread",
    ImageURL: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500",
    Category: "Starters",
    Price: 149,
    Description: "Crispy bread with garlic butter",
    restaurantId: null,
    veg: true,
    rating: 4.3,
    ratingCount: 45
  },
  // Food for Apna Sweets
  {
    Title: "Gulab Jamun",
    ImageURL: "https://images.unsplash.com/photo-1589119908995-f8830c9f8a5d?w=500",
    Category: "Desserts",
    Price: 120,
    Description: "5 pieces of soft, syrupy dumplings",
    restaurantId: null,
    veg: true,
    rating: 4.8,
    ratingCount: 230
  },
  {
    Title: "Jalebi",
    ImageURL: "https://images.unsplash.com/photo-1602357285804-1f6f6e5f2b9c?w=500",
    Category: "Desserts",
    Price: 100,
    Description: "Crispy, juicy spiral sweets",
    restaurantId: null,
    veg: true,
    rating: 4.6,
    ratingCount: 156
  },
  // Food for Tandoori Nights
  {
    Title: "Chicken Biryani",
    ImageURL: "https://images.unsplash.com/photo-1563379091339-03b21ab4a5f8?w=500",
    Category: "Main Course",
    Price: 299,
    Description: "Aromatic rice with spicy chicken",
    restaurantId: null,
    veg: false,
    rating: 4.7,
    ratingCount: 345
  },
  {
    Title: "Paneer Tikka",
    ImageURL: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500",
    Category: "Starters",
    Price: 249,
    Description: "Grilled cottage cheese with spices",
    restaurantId: null,
    veg: true,
    rating: 4.5,
    ratingCount: 178
  }
];

const seedFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || 'zomoro_db'
    });
    
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Get restaurants to get their IDs
    const restaurants = await db.collection('resturants').find({}).toArray();
    
    if (restaurants.length === 0) {
      console.log('❌ No restaurants found. Run seed-data.js first');
      return;
    }
    
    // Map food items to restaurants
    const foodItems = [];
    
    // Assign foods to Olio
    const olio = restaurants.find(r => r.Title.includes('Olio'));
    if (olio) {
      sampleFoods.slice(0, 3).forEach(food => {
        foodItems.push({
          ...food,
          restaurantId: olio._id
        });
      });
    }
    
    // Assign foods to Apna Sweets
    const apna = restaurants.find(r => r.Title.includes('Apna'));
    if (apna) {
      sampleFoods.slice(3, 5).forEach(food => {
        foodItems.push({
          ...food,
          restaurantId: apna._id
        });
      });
    }
    
    // Assign foods to Tandoori Nights
    const tandoori = restaurants.find(r => r.Title.includes('Tandoori'));
    if (tandoori) {
      sampleFoods.slice(5, 7).forEach(food => {
        foodItems.push({
          ...food,
          restaurantId: tandoori._id
        });
      });
    }
    
    // Clear existing foods
    await db.collection('foods').deleteMany({});
    console.log('✅ Cleared existing foods');
    
    // Insert new foods
    const result = await db.collection('foods').insertMany(foodItems);
    console.log(`✅ Added ${result.insertedCount} food items`);
    
    // Update restaurants with food references
    for (const restaurant of restaurants) {
      const restaurantFoods = foodItems
        .filter(f => f.restaurantId.toString() === restaurant._id.toString())
        .map(f => f._id);
      
      await db.collection('resturants').updateOne(
        { _id: restaurant._id },
        { $set: { Foods: restaurantFoods } }
      );
    }
    
    console.log('✅ Updated restaurants with food references');
    
  } catch (error) {
    console.error('❌ Error seeding foods:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
};

seedFoods();