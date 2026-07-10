// Backend/controllers/chatbotController.js
//
// Turns natural language into a validated Subscription.
// The LLM ONLY parses intent into JSON. It never touches the database.
// The backend validates every field before writing anything.
//
// SETUP:
//   npm install @anthropic-ai/sdk
//   Add to .env:  ANTHROPIC_API_KEY=sk-ant-...
//
// SECURITY: treat the model's output as untrusted user input. Validate it all.

const Anthropic = require('@anthropic-ai/sdk');
const Subscription = require('../models/Subscription');
const Restaurant = require('../models/resturantModel');
const { findCheapestThali } = require('../services/thaliService');

const anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

const SYSTEM_PROMPT = `You convert a user's food-subscription request into JSON.

Return ONLY a JSON object. No prose, no markdown fences, no explanation.

Schema:
{
  "action": "create_subscription" | "cancel_subscription" | "unclear",
  "mode": "fixed" | "cheapest",
  "restaurantName": string | null,
  "mealTimes": ["HH:MM", ...],
  "maxPrice": number | null
}

Rules:
- "afternoon"/"lunch" -> "14:00". "night"/"dinner" -> "21:00".
- If the user names a restaurant, mode = "fixed" and set restaurantName.
- If the user says "cheapest" or "cheap", mode = "cheapest", restaurantName = null.
- If you cannot tell what they want, return {"action":"unclear"}.
- mealTimes must be 24-hour "HH:MM" strings.`;

const convertTo24Hour = (value) => {
    if (!value) return null;

    const text = String(value).toLowerCase().trim();
    const match = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (!match) return null;

    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2] || '00', 10);
    const suffix = match[3];

    if (suffix === 'pm' && hour < 12) hour += 12;
    if (suffix === 'am' && hour === 12) hour = 0;

    if (hour < 0 || hour > 23 || minute > 59) return null;

    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const buildFallbackIntent = (message) => {
    const lower = String(message || '').toLowerCase();
    const isCheapest = lower.includes('cheapest') || lower.includes('cheap');
    const restaurantMatch = lower.match(/from\s+([a-z0-9\s&.-]+)/i);

    const mealTimes = [];
    const timeMatches = lower.matchAll(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/g);
    for (const match of timeMatches) {
        const normalized = convertTo24Hour(`${match[1]}${match[2] ? `:${match[2]}` : ''}${match[3] || ''}`);
        if (normalized) mealTimes.push(normalized);
    }

    if (mealTimes.length === 0 && (lower.includes('lunch') || lower.includes('afternoon'))) mealTimes.push('14:00');
    if (mealTimes.length === 0 && (lower.includes('dinner') || lower.includes('night'))) mealTimes.push('21:00');

    return {
        action: mealTimes.length ? 'create_subscription' : 'unclear',
        mode: isCheapest ? 'cheapest' : (restaurantMatch ? 'fixed' : 'cheapest'),
        restaurantName: restaurantMatch ? restaurantMatch[1].trim() : null,
        mealTimes,
        maxPrice: 300
    };
};

const parseUserIntent = async (message) => {
    if (!anthropic) {
        return buildFallbackIntent(message);
    }

    try {
        const completion = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 500,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: message }]
        });

        const raw = completion.content
            .map(block => (block.type === 'text' ? block.text : ''))
            .join('')
            .replace(/```json|```/g, '')
            .trim();

        return JSON.parse(raw);
    } catch (error) {
        console.warn('Anthropic parsing failed, using fallback parser:', error.message);
        return buildFallbackIntent(message);
    }
};

/**
 * POST /api/v1/chatbot/message
 * Body: { message: "order me the cheapest thali every day at 2pm and 9pm" }
 * Auth: optional for the chat UI; subscriptions require a real user session
 */
const handleChatMessage = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || typeof message !== 'string') {
            return res.status(400).json({ success: false, message: 'message is required' });
        }

        if (!req.user?.id) {
            return res.status(200).json({
                success: false,
                reply: 'Please log in to create daily thali orders.'
            });
        }

        const parsed = await parseUserIntent(message);

        // 2) VALIDATE. Never trust the model's output.
        if (!parsed || parsed.action === 'unclear' || parsed.action !== 'create_subscription') {
            return res.status(200).json({
                success: false,
                reply: "I can set up a daily thali order. Try: \"order the cheapest thali daily at 2pm and 9pm\"."
            });
        }

        if (!['fixed', 'cheapest'].includes(parsed.mode)) {
            return res.status(400).json({ success: false, reply: 'Invalid mode.' });
        }

        const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
        const mealTimes = Array.isArray(parsed.mealTimes)
            ? parsed.mealTimes.filter(t => timeRegex.test(t))
            : [];

        if (mealTimes.length === 0) {
            return res.status(200).json({
                success: false,
                reply: 'What time should I order? For example, "2pm and 9pm".'
            });
        }

        // Clamp maxPrice to something sane — never trust a model-supplied number
        const maxPrice = Math.min(Math.max(Number(parsed.maxPrice) || 300, 50), 1000);

        // 3) Resolve the restaurant, if a fixed one was named
        let restaurantId = null;
        if (parsed.mode === 'fixed') {
            if (!parsed.restaurantName) {
                return res.status(200).json({
                    success: false,
                    reply: 'Which restaurant should I order from?'
                });
            }
            const restaurant = await Restaurant.findOne({
                Title: { $regex: new RegExp(parsed.restaurantName, 'i') }
            });
            if (!restaurant) {
                return res.status(200).json({
                    success: false,
                    reply: `I couldn't find a restaurant called "${parsed.restaurantName}".`
                });
            }
            restaurantId = restaurant._id;
        } else {
            // Sanity check: is there even a thali under maxPrice?
            const cheapest = await findCheapestThali({ maxPrice });
            if (!cheapest) {
                return res.status(200).json({
                    success: false,
                    reply: `No thali found under ₹${maxPrice}. Try a higher budget.`
                });
            }
        }

        // 4) Create the subscription — scoped to the AUTHENTICATED user only.
        //    Never take userId from the model or the request body.
        const subscription = await Subscription.create({
            userId: req.user.id,
            mode: parsed.mode,
            restaurantId,
            mealTimes,
            maxPrice,
            active: true
        });

        const when = mealTimes.join(' and ');
        const what = parsed.mode === 'cheapest'
            ? `the cheapest thali under ₹${maxPrice}`
            : `a thali from ${parsed.restaurantName}`;

        return res.status(201).json({
            success: true,
            reply: `Done. I'll order ${what} every day at ${when}. You'll get a payment notification each time.`,
            subscription
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        const friendlyReply = error?.message?.includes('buffering timed out') || error?.name === 'MongooseError'
            ? 'I’m having trouble reaching the food catalog right now. Please try again in a moment.'
            : 'I’m having trouble processing that request right now. Please try again in a moment.';

        return res.status(200).json({ success: false, reply: friendlyReply });
    }
};

/** GET /api/v1/chatbot/subscriptions — list the user's subscriptions */
const listSubscriptions = async (req, res) => {
    const subs = await Subscription.find({ userId: req.user.id }).populate('restaurantId');
    res.json({ success: true, subscriptions: subs });
};

/** DELETE /api/v1/chatbot/subscriptions/:id — cancel one (own only) */
const cancelSubscription = async (req, res) => {
    const sub = await Subscription.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },  // ownership check!
        { active: false },
        { new: true }
    );
    if (!sub) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Subscription cancelled' });
};

module.exports = { handleChatMessage, listSubscriptions, cancelSubscription };