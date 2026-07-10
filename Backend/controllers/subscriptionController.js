// Backend/controllers/subscriptionController.js
//
// Plain CRUD for subscriptions. No AI, no external API, no credits needed.
// Everything is validated server-side; the client is never trusted.

const Subscription = require('../models/Subscription');
const Restaurant = require('../models/resturantModel');
const { findCheapestThali } = require('../services/thaliService');

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * POST /api/v1/subscriptions
 * Body: { mode, restaurantId?, mealTimes[], maxPrice, deliveryAddress }
 */
const createSubscription = async (req, res) => {
    try {
        const { mode, restaurantId, mealTimes, maxPrice, deliveryAddress } = req.body;

        // --- validate mode ---
        if (!['fixed', 'cheapest'].includes(mode)) {
            return res.status(400).json({ success: false, message: 'mode must be "fixed" or "cheapest"' });
        }

        // --- validate mealTimes ---
        if (!Array.isArray(mealTimes) || mealTimes.length === 0) {
            return res.status(400).json({ success: false, message: 'Pick at least one meal time' });
        }
        const validTimes = mealTimes.filter(t => TIME_REGEX.test(t));
        if (validTimes.length !== mealTimes.length) {
            return res.status(400).json({ success: false, message: 'Meal times must be HH:MM (24-hour)' });
        }

        // --- clamp maxPrice to something sane ---
        const price = Math.min(Math.max(Number(maxPrice) || 300, 50), 1000);

        // --- mode-specific checks ---
        let resolvedRestaurantId = null;
        if (mode === 'fixed') {
            if (!restaurantId) {
                return res.status(400).json({ success: false, message: 'Choose a restaurant' });
            }
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                return res.status(404).json({ success: false, message: 'Restaurant not found' });
            }
            resolvedRestaurantId = restaurant._id;
        } else {
            // Sanity check: is there even a thali under this ceiling?
            const cheapest = await findCheapestThali({ maxPrice: price });
            if (!cheapest) {
                return res.status(400).json({
                    success: false,
                    message: `No thali found under Rs.${price}. Try a higher budget.`
                });
            }
        }

        // --- validate address ---
        if (!deliveryAddress?.street) {
            return res.status(400).json({ success: false, message: 'Delivery address is required' });
        }

        // --- create, scoped to the AUTHENTICATED user only ---
        const subscription = await Subscription.create({
            userId: req.user.id,          // never from the request body
            mode,
            restaurantId: resolvedRestaurantId,
            mealTimes: [...new Set(validTimes)].sort(),
            maxPrice: price,
            deliveryAddress,
            active: true
        });

        return res.status(201).json({
            success: true,
            message: 'Daily order created',
            subscription
        });

    } catch (error) {
        console.error('Create subscription error:', error);
        return res.status(500).json({ success: false, message: 'Could not create subscription', error: error.message });
    }
};

/** GET /api/v1/subscriptions — the logged-in user's subscriptions */
const listSubscriptions = async (req, res) => {
    try {
        const subs = await Subscription.find({ userId: req.user.id })
            .populate('restaurantId')
            .sort({ createdAt: -1 });
        return res.json({ success: true, subscriptions: subs });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Could not load subscriptions' });
    }
};

/** DELETE /api/v1/subscriptions/:id — cancel (soft delete), own only */
const cancelSubscription = async (req, res) => {
    try {
        const sub = await Subscription.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },   // ownership check
            { active: false },
            { new: true }
        );
        if (!sub) return res.status(404).json({ success: false, message: 'Not found' });
        return res.json({ success: true, message: 'Subscription cancelled' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Could not cancel' });
    }
};

module.exports = { createSubscription, listSubscriptions, cancelSubscription };