// Backend/routes/subscriptionRoutes.js
//
// Register in index.js with:
//   app.use('/api/v1/subscriptions', require('./routes/subscriptionRoutes'));

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    createSubscription,
    listSubscriptions,
    cancelSubscription
} = require('../controllers/subscriptionController');

const router = express.Router();

// All routes require a logged-in user
router.post('/', authMiddleware, createSubscription);
router.get('/', authMiddleware, listSubscriptions);
router.delete('/:id', authMiddleware, cancelSubscription);

module.exports = router;
