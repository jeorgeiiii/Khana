const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Food = require('../models/foodModel');
const Restaurant = require('../models/resturantModel');

const dataPath = path.join(__dirname, '..', '..', 'menu-data-continental.json');
const menuData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const seedMenuData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || 'zomoro_db'
    });

    console.log('Connected to MongoDB');

    for (const entry of menuData) {
      let restaurant = await Restaurant.findOne({ Title: entry.restaurantTitle });
      if (!restaurant) {
        restaurant = await Restaurant.create({
          Title: entry.restaurantTitle,
          ImageURL: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500',
          Time: '10:00 AM - 10:00 PM',
          Pickup: true,
          Delivery: true,
          isOpen: true,
          Logourl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
          Rating: 4.3,
          RatingCount: 100,
          Coords: {
            latitude: 22.7196,
            longitude: 75.8577,
            address: 'Indore'
          },
          address: 'Indore',
          location: 'Indore',
          phone: '+919999999999',
          cuisine: 'International',
          price: '₹200 for two',
          description: 'Restaurant created from continental menu seed data',
          category: 'Casual Dining',
          paymentMethods: ['Cash', 'Card', 'UPI'],
          facilities: ['Home Delivery', 'Takeaway'],
          minOrder: 0,
          deliveryFee: 0,
          preparationTime: '20-30 min',
          featured: false,
          status: 'active'
        });
        console.log(`Created restaurant: ${restaurant.Title}`);
      }

      const uniqueItemTitles = new Set();
      const docs = [];

      for (const item of entry.items) {
        const title = item.Title.trim();
        if (uniqueItemTitles.has(title)) continue;
        uniqueItemTitles.add(title);

        docs.push({
          Title: title,
          Description: item.Description || 'Freshly prepared dish',
          Price: Number(item.Price),
          ImageURL: item.ImageURL,
          FoodTags: item.FoodTags,
          Category: item.Category,
          isAvaliable: item.isAvaliable !== false,
          resturant: restaurant._id,
          Rating: item.Rating || 4,
          Rating_Count: `${item.Rating || 4}★`,
          mealType: item.mealType || 'both'
        });
      }

      await Food.deleteMany({ resturant: restaurant._id });
      const inserted = await Food.insertMany(docs);
      await Restaurant.findByIdAndUpdate(restaurant._id, { Foods: inserted.map(item => item._id) });
      console.log(`Seeded ${inserted.length} dishes for ${restaurant.Title}`);
    }

    console.log('Continental menu data seeded successfully');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedMenuData();
