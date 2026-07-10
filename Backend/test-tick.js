require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME || 'zomoro_db' });

  const Subscription = require('./models/Subscription');
  const { pickThaliForSubscription } = require('./services/thaliService');
  const { createPendingOrder } = require('./services/subscriptionScheduler');

  // 1. Find an active subscription
  const sub = await Subscription.findOne({ active: true });
  if (!sub) { console.log('❌ No active subscription found. Run: node test-sub.js'); process.exit(); }
  console.log('✅ Found subscription:', sub._id.toString(), '| mode:', sub.mode);

  // 2. Pick a thali for it
  const thali = await pickThaliForSubscription(sub, 'afternoon');
  if (!thali) { console.log('❌ No thali found. Run: node seed/thalis.js'); process.exit(); }
  console.log('✅ Found thali:', thali.Title, '| Rs.' + thali.Price, '| at', thali.resturant?.Title);

  // 3. Create the pending-payment order
  const order = await createPendingOrder(sub, thali);
  console.log('✅ Order created:', order._id.toString());
  console.log('   Total: Rs.' + order.totalAmount);
  console.log('   Status:', order.orderStatus);
  console.log('   Expires:', order.expiresAt);

  process.exit();
})().catch(e => { console.error('❌ FAILED:', e.message); process.exit(); });