// Backend/services/thaliService.js
//
// Pure query logic for finding thalis. No HTTP, no cron - just data.
// Used by both the API endpoint and the cron scheduler.
//
// IMPORTANT: your foodModel calls the restaurant link `resturant`
// (not `restaurantId`). All queries and populates below use that spelling.

const Food = require('../models/foodModel');

/**
 * Find the cheapest thali across all restaurants.
 */
const findCheapestThali = async ({ maxPrice = 300, mealType } = {}) => {
    const query = {
        Category: 'Thali',
        Price: { $lte: maxPrice }
    };

    if (mealType) {
        query.$or = [
            { mealType: mealType },
            { mealType: 'both' },
            { mealType: { $exists: false } }
        ];
    }

    return Food.findOne(query)
        .sort({ Price: 1 })       // ascending -> cheapest first
        .populate('resturant');   // <-- your schema's field name
};

/**
 * Find a thali at a specific restaurant.
 */
const findThaliAtRestaurant = async (restaurantId, { mealType, foodId } = {}) => {
    if (foodId) {
        return Food.findById(foodId).populate('resturant');
    }

    const query = { resturant: restaurantId, Category: 'Thali' };
    if (mealType) {
        query.$or = [
            { mealType: mealType },
            { mealType: 'both' },
            { mealType: { $exists: false } }
        ];
    }

    return Food.findOne(query).sort({ Price: 1 }).populate('resturant');
};

/**
 * Decide which thali to order for a given subscription right now.
 */
const pickThaliForSubscription = async (subscription, mealType) => {
    if (subscription.mode === 'cheapest') {
        return findCheapestThali({ maxPrice: subscription.maxPrice, mealType });
    }
    return findThaliAtRestaurant(subscription.restaurantId, {
        mealType,
        foodId: subscription.foodId
    });
};

/**
 * Map a clock time to a meal type. Before 17:00 -> afternoon, else dinner.
 */
const mealTypeForTime = (hhmm) => {
    const hour = parseInt(hhmm.split(':')[0], 10);
    return hour < 17 ? 'afternoon' : 'dinner';
};

module.exports = {
    findCheapestThali,
    findThaliAtRestaurant,
    pickThaliForSubscription,
    mealTypeForTime
};