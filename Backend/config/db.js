const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MONGO_URI is not defined in .env file');
            console.log('Please add MONGO_URI to your .env file');
            process.exit(1);
        }

        console.log('🔄 Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME || 'zomoro_db',
        });
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`✅ Database: ${conn.connection.name}`);
        
        return conn;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;