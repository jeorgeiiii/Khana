
require('dotenv').config();
const mongoose = require('mongoose');
const Subscription = require('./models/Subscription');

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME || 'zomoro_db' });

  // Set this to 1-2 minutes from now, in 24h HH:MM
  const now = new Date();
  now.setMinutes(now.getMinutes() + 2);
  const testTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  const sub = await Subscription.create({
    userId: '69b075c71c4392f5b8c0f88d',   // ← your user _id (from your JWT earlier)
    mode: 'cheapest',
    mealTimes: [testTime],
    maxPrice: 300,
    deliveryAddress: {
      street: '12 Test Lane', city: 'Indore', state: 'MP', pincode: '452001'
    }
  });

  console.log('✅ Subscription created for', testTime);
  console.log(sub);
  await mongoose.disconnect();
  process.exit();
})();