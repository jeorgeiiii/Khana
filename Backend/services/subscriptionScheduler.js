// Backend/services/subscriptionScheduler.js
//
// Runs inside your live server process (started from index.js).
// Every minute it checks whether any active subscription has a mealTime
// matching the current HH:MM, and if so creates a pending_payment order.
//
// It also expires unpaid subscription orders after their expiresAt passes.
//
// ⚠️ NEVER call mongoose.disconnect() in here — it would kill your app's
//    DB connection (this is what broke your nightlife seed).
//
// SETUP:
//   1. npm install node-cron
//   2. In index.js, AFTER the DB connects:
//        require('./services/subscriptionScheduler').start(io);

const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const Order = require('../models/Order');
const { pickThaliForSubscription, mealTypeForTime } = require('./thaliService');

// How long an unpaid order stays open before it's auto-expired.
const PAYMENT_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

// Delivery fee / tax settings — adjust to match your checkout logic.
const DELIVERY_FEE = 40;
const TAX_RATE = 0.05; // 5%

/**
 * Creates an unpaid order from a subscription + chosen thali.
 * Field names match Backend/models/Order.js exactly.
 */
const createPendingOrder = async (subscription, thali) => {
    const price = thali.Price || thali.price || 0;
    const subtotal = price;
    const tax = Math.round(subtotal * TAX_RATE);
    const totalAmount = subtotal + tax + DELIVERY_FEE;

    const order = new Order({
        userId: subscription.userId,
        restaurantId: thali.resturant?._id || thali.resturant,   // Food schema calls it `resturant`

        items: [{
            foodId: thali._id,
            name: thali.Title || thali.name,
            quantity: 1,
            price: price,
            total: price
        }],

        // NOTE: your schema calls this `address`, not `deliveryAddress`
        address: {
            street: subscription.deliveryAddress?.street,
            city: subscription.deliveryAddress?.city,
            state: subscription.deliveryAddress?.state,
            pincode: subscription.deliveryAddress?.pincode
        },

        // paymentInfo.method is required by the schema, so we set a
        // placeholder. The real method is chosen when the user pays.
        // The "not paid yet" signal is paymentInfo.status = 'pending'.
        paymentInfo: {
            method: 'upi',
            status: 'pending',
            amount: totalAmount
        },

        // Your schema field is `orderStatus`, not `status`
        orderStatus: 'pending_payment',

        subtotal,
        tax,
        deliveryFee: DELIVERY_FEE,
        totalAmount,

        expiresAt: new Date(Date.now() + PAYMENT_WINDOW_MS),
        isSubscriptionOrder: true,
        subscriptionId: subscription._id
    });

    await order.save();
    return order;
};

/**
 * Core tick: find subscriptions due right now and create their orders.
 */
const runTick = async (io) => {
    const now = new Date();
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const due = await Subscription.find({ active: true, mealTimes: hhmm });
    if (due.length === 0) return;

    console.log(`[scheduler] ${hhmm} — ${due.length} subscription(s) due`);

    for (const sub of due) {
        try {
            // Guard against double-ordering if the tick runs twice
            if (sub.lastOrderedAt && (now - sub.lastOrderedAt) < 5 * 60 * 1000) {
                console.log(`[scheduler] skipping ${sub._id} (ordered recently)`);
                continue;
            }

            const mealType = mealTypeForTime(hhmm);
            const thali = await pickThaliForSubscription(sub, mealType);

            if (!thali) {
                console.warn(`[scheduler] no thali found for subscription ${sub._id}`);
                continue;
            }

            const order = await createPendingOrder(sub, thali);

            sub.lastOrderedAt = now;
            await sub.save();

            console.log(`[scheduler] order ${order._id} created — Rs.${order.totalAmount} for user ${sub.userId}`);

            // Real-time "please pay" notification
            if (io) {
                io.to(`user-${sub.userId}`).emit('payment-required', {
                    orderId: order._id,
                    amount: order.totalAmount,
                    itemName: thali.Title || thali.name,
                    restaurantName: thali.resturant?.Title,
                    expiresAt: order.expiresAt
                });
            }
        } catch (err) {
            // One bad subscription must never kill the whole tick
            console.error(`[scheduler] error on subscription ${sub._id}:`, err.message);
        }
    }
};

/**
 * Expire unpaid subscription orders whose payment window has passed.
 */
const expireStaleOrders = async () => {
    const result = await Order.updateMany(
        {
            orderStatus: 'pending_payment',
            expiresAt: { $lt: new Date() }
        },
        {
            $set: { orderStatus: 'expired' }
        }
    );
    if (result.modifiedCount > 0) {
        console.log(`[scheduler] expired ${result.modifiedCount} unpaid order(s)`);
    }
};

/**
 * Start the scheduler. Call once, from index.js, after DB connect.
 */
const start = (io) => {
    // Every minute: create due orders
    cron.schedule('* * * * *', () => {
        runTick(io).catch(err => console.error('[scheduler] tick failed:', err.message));
    });

    // Every 5 minutes: clean up unpaid orders
    cron.schedule('*/5 * * * *', () => {
        expireStaleOrders().catch(err => console.error('[scheduler] expiry failed:', err.message));
    });

    console.log('✅ Subscription scheduler started (checks every minute)');
};

module.exports = { start, runTick, createPendingOrder, expireStaleOrders };