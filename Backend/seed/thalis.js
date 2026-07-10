// Backend/seed/thalis.js
//
// Inserts thali dishes into the Food collection, linked to restaurants
// that already exist in your database.
//
// RUN ONCE:  node seed/thalis.js
// Safe to re-run: deletes existing thalis first, then re-inserts.
//
// NOTE: your foodModel names the restaurant link `resturant` (not restaurantId)
//       and the availability flag `isAvaliable`. Both spellings matter.

require('dotenv').config();
const mongoose = require('mongoose');

const THALI_TEMPLATES = [
    {
        Title: 'Mini Thali',
        Description: 'Dal, 1 sabzi, 3 roti, rice - light lunch portion',
        basePrice: 90,
        mealType: 'afternoon'
    },
    {
        Title: 'Regular Veg Thali',
        Description: 'Dal, 2 sabzi, 4 roti, rice, salad, papad',
        basePrice: 140,
        mealType: 'both'
    },
    {
        Title: 'Special Veg Thali',
        Description: 'Paneer sabzi, dal makhani, 4 roti, jeera rice, sweet, salad',
        basePrice: 190,
        mealType: 'dinner'
    }
];

const seedThalis = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME || 'zomoro_db'
        });
        console.log('Connected to MongoDB');

        const Food = require('../models/foodModel');
        const Restaurant = require('../models/resturantModel');

        const restaurants = await Restaurant.find({
            $or: [
                { location: { $regex: /indore/i } },
                { 'Coords.address': { $regex: /indore/i } }
            ]
        }).limit(6);

        if (restaurants.length === 0) {
            console.error('No Indore restaurants found. Seed restaurants first.');
            await mongoose.disconnect();
            process.exit(1);
        }

        console.log(`Found ${restaurants.length} Indore restaurant(s)`);

        const deleted = await Food.deleteMany({ Category: 'Thali' });
        if (deleted.deletedCount > 0) {
            console.log(`Removed ${deleted.deletedCount} existing thali(s)`);
        }

        const docs = [];
        restaurants.forEach((r, idx) => {
            THALI_TEMPLATES.forEach(t => {
                docs.push({
                    Title: t.Title,
                    Description: t.Description,
                    Price: t.basePrice + (idx * 10),
                    Category: 'Thali',
                    ImageURL: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500',
                    resturant: r._id,          // <-- correct field name from your schema
                    mealType: t.mealType,      // <-- requires adding mealType to foodModel
                    isAvaliable: true,         // <-- yes, misspelled in your schema
                    FoodTags: 'thali,veg,meal'
                });
            });
        });

        const inserted = await Food.insertMany(docs, { ordered: false });
        console.log(`Inserted ${inserted.length} thalis`);

        // Verify the link actually saved
        const cheapest = await Food.findOne({ Category: 'Thali' })
            .sort({ Price: 1 })
            .populate('resturant');   // <-- correct path

        console.log('\nCheapest thali (what auto-order will buy):');
        console.log(`   ${cheapest.Title} - Rs.${cheapest.Price}`);
        console.log(`   at ${cheapest.resturant?.Title || 'NOT LINKED - problem!'}`);
        console.log(`   mealType: ${cheapest.mealType || 'MISSING - add mealType to foodModel'}`);

        const total = await Food.countDocuments({ Category: 'Thali' });
        console.log(`\nDone. ${total} thalis now in the database.`);

    } catch (err) {
        console.error('Seed failed:', err.message);
        if (err.errors) {
            Object.keys(err.errors).forEach(k => {
                console.error(`   field "${k}": ${err.errors[k].message}`);
            });
        }
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
        process.exit();
    }
};

seedThalis();