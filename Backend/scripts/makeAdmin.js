require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const email = process.argv[2];
const newRole = process.argv[3] || 'Admin';

const VALID_ROLES = ['Client', 'Admin', 'Vendor', 'Driver'];

if (!email) {
    console.log('Usage: node scripts/makeAdmin.js liberlismtor@gmail.com [Admin|Vendor|Driver|Client]');
    console.log('Example: node scripts/makeAdmin.js prince@gmail.com Admin');
    process.exit(1);
}

if (!VALID_ROLES.includes(newRole)) {
    console.log(`❌ Invalid role: ${newRole}`);
    console.log(`   Must be one of: ${VALID_ROLES.join(', ')}`);
    process.exit(1);
}

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const user = await User.findOneAndUpdate(
            { email },
            { usertype: newRole },
            { new: true }
        );

        if (!user) {
            console.log(`❌ User not found: ${email}`);
        } else {
            console.log(`✅ ${user.email} is now ${user.usertype}`);
            console.log(`   (User must log out and log back in for the new role to take effect)`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();