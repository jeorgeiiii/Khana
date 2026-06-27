require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const users = await User.find({}).select('email name usertype createdAt');

        console.log(`\nFound ${users.length} users:\n`);
        console.log('─'.repeat(80));
        users.forEach((u, i) => {
            console.log(`${i + 1}. ${u.email}`);
            console.log(`   Name:     ${u.name}`);
            console.log(`   Role:     ${u.usertype || 'Client (default)'}`);
            console.log(`   Created:  ${u.createdAt?.toLocaleDateString() || 'unknown'}`);
            console.log('─'.repeat(80));
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();