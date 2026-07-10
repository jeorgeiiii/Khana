const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const resturantModel = require('./models/resturantModel');

(async () => {
  try {
    await connectDB();
    const docs = await resturantModel.find({
      $or: [
        { location: { $regex: 'Indore', $options: 'i' } },
        { 'Coords.address': { $regex: 'Indore', $options: 'i' } }
      ]
    });
    console.log('COUNT', docs.length);
    console.log(JSON.stringify(docs.slice(0, 2), null, 2));
  } catch (err) {
    console.error('QUERY ERROR');
    console.error(err);
    console.error(err.stack);
  } finally {
    await mongoose.disconnect();
  }
})();
