const mongoose = require('mongoose');
require('dotenv').config();

const Food = require('../models/foodModel');
const Restaurant = require('../models/resturantModel');

const restaurantMenus = {
  'Olio - The Wood Fired Pizzeria': [
    { Title: 'Margherita Pizza', Description: 'Classic cheese pizza with basil and tomato', Price: 299, Category: 'Pizza', FoodTags: 'veg,classic', ImageURL: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500' },
    { Title: 'Pepperoni Pizza', Description: 'Loaded with pepperoni and extra cheese', Price: 399, Category: 'Pizza', FoodTags: 'non-veg,spicy', ImageURL: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500' },
    { Title: 'Garlic Bread', Description: 'Crispy garlic bread with herb butter', Price: 149, Category: 'Starters', FoodTags: 'veg,starter', ImageURL: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=500' }
  ],
  'Apna Sweets': [
    { Title: 'Gulab Jamun', Description: 'Soft syrupy dumplings', Price: 120, Category: 'Desserts', FoodTags: 'veg,sweet', ImageURL: 'https://images.unsplash.com/photo-1589119908995-f8830c9f8a5d?w=500' },
    { Title: 'Jalebi', Description: 'Crispy, juicy sweet pretzel', Price: 100, Category: 'Desserts', FoodTags: 'veg,sweet', ImageURL: 'https://images.unsplash.com/photo-1602357285804-1f6f6e5f2b9c?w=500' }
  ],
  'Tandoori Nights': [
    { Title: 'Chicken Biryani', Description: 'Aromatic rice with spicy chicken', Price: 299, Category: 'Main Course', FoodTags: 'non-veg,biryani', ImageURL: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a5f8?w=500' },
    { Title: 'Paneer Tikka', Description: 'Grilled paneer skewers with masala', Price: 249, Category: 'Starters', FoodTags: 'veg,grilled', ImageURL: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500' }
  ],
  'Sagar Gaire Fast Food': [
    { Title: 'Paneer Wrap', Description: 'Spicy paneer wrap with lettuce', Price: 179, Category: 'Wraps', FoodTags: 'veg,fast-food', ImageURL: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500' },
    { Title: 'French Fries', Description: 'Crispy fries with peri-peri seasoning', Price: 99, Category: 'Sides', FoodTags: 'veg,fast-food', ImageURL: 'https://images.unsplash.com/photo-1576107232684-2cc3c0f7b4d3?w=500' }
  ],
  'Cafe Terazza': [
    { Title: 'Cold Coffee', Description: 'Iced coffee with vanilla foam', Price: 149, Category: 'Beverages', FoodTags: 'veg,coffee', ImageURL: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500' },
    { Title: 'Veg Pasta', Description: 'Creamy pasta with fresh herbs', Price: 229, Category: 'Pasta', FoodTags: 'veg,pasta', ImageURL: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500' }
  ]
};

const seedRestaurantMenus = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || 'zomoro_db'
    });

    console.log('Connected to MongoDB');

    for (const [restaurantTitle, dishes] of Object.entries(restaurantMenus)) {
      const restaurant = await Restaurant.findOne({ Title: restaurantTitle });
      if (!restaurant) {
        console.log(`Skipping ${restaurantTitle}: restaurant not found`);
        continue;
      }

      await Food.deleteMany({ resturant: restaurant._id });

      const docs = dishes.map((dish) => ({
        ...dish,
        Price: Number(dish.Price),
        Description: dish.Description || 'Freshly prepared dish',
        isAvaliable: true,
        resturant: restaurant._id,
        Rating: 4.3,
        Rating_Count: '120+',
        mealType: 'both'
      }));

      const inserted = await Food.insertMany(docs);
      await Restaurant.findByIdAndUpdate(restaurant._id, { Foods: inserted.map(item => item._id) });
      console.log(`Seeded ${inserted.length} dishes for ${restaurantTitle}`);
    }

    console.log('Restaurant menu seed complete');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedRestaurantMenus();
