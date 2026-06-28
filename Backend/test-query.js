require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || 'zomoro_db'
    });
    const R = require('./models/resturantModel');

    const r = await R.find({
      $or: [
        { location: { $regex: new RegExp('Indore', 'i') } },
        { 'Coords.address': { $regex: new RegExp('Indore', 'i') } }
      ]
    });

    console.log('✅ Query worked! Found:', r.length, 'restaurants in Indore');
  } catch (e) {
    console.error('❌ QUERY FAILED:', e.message);
  } finally {
    process.exit();
  }
})();