const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Food = require('../models/foodModel');
const Nightlife = require('../models/Nightlife');

const dataPath = path.join(__dirname, '..', '..', 'menu-data-bar.json');
const menuData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const seedBarNightlife = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || 'zomoro_db'
    });

    console.log('Connected to MongoDB');

    for (const entry of menuData) {
      let nightlife = await Nightlife.findOne({ name: entry.restaurantTitle });
      if (!nightlife) {
        nightlife = await Nightlife.create({
          name: entry.restaurantTitle,
          cuisine: 'Bar & Lounge',
          price: '₹1,500 for two',
          rating: '4.3',
          imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500',
          location: 'Indore',
          address: 'Indore',
          type: 'Bar',
          music: 'DJ',
          happyHours: '5 PM - 8 PM',
          featured: true,
          isOpen: true,
          openingTime: '7:00 PM',
          closingTime: '1:00 AM'
        });
        console.log(`Created nightlife place: ${nightlife.name}`);
      }

      const uniqueItemTitles = new Set();
      const docs = [];

      for (const item of entry.items) {
        const title = item.Title.trim();
        if (uniqueItemTitles.has(title)) continue;
        uniqueItemTitles.add(title);

        docs.push({
          Title: title,
          Description: item.Description || 'Freshly prepared bar food and drinks',
          Price: Number(item.Price),
          ImageURL: item.ImageURL,
          FoodTags: item.FoodTags,
          Category: item.Category,
          isAvaliable: item.isAvaliable !== false,
          resturant: nightlife._id,
          Rating: item.Rating || 4,
          Rating_Count: `${item.Rating || 4}★`,
          mealType: item.mealType || 'both'
        });
      }

      await Food.deleteMany({ resturant: nightlife._id });
      const inserted = await Food.insertMany(docs);
      console.log(`Seeded ${inserted.length} dishes for ${nightlife.name}`);
    }

    console.log('Bar/nightlife menu data seeded successfully');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

seedBarNightlife();
