const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('URI:', process.env.MONGO_URI.replace(/:[^:]*@/, ':****@')); // Hide password
        
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Successfully connected to MongoDB!');
        
        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📚 Available collections:');
        collections.forEach(col => console.log(`   - ${col.name}`));
        
        // Count restaurants
        const resturantCount = await mongoose.connection.db
            .collection('resturants')
            .countDocuments();
        console.log(`\n🍽️  Total restaurants: ${resturantCount}`);
        
        // Show sample restaurant
        if (resturantCount > 0) {
            const sample = await mongoose.connection.db
                .collection('resturants')
                .findOne();
            console.log('\n📋 Sample restaurant:');
            console.log(`   Name: ${sample.Title}`);
            console.log(`   Cuisine: ${sample.cuisine}`);
            console.log(`   Rating: ${sample.Rating} ⭐`);
        }
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
};

testConnection();