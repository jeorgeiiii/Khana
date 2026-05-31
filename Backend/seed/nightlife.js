const mongoose = require('mongoose');
const Nightlife = require('../models/Nightlife');
require('dotenv').config();

const nightlifePlaces = [
    // ========== INDORE ==========
    {
        name: "Firangi Cafe And Bar",
        cuisine: "North Indian, Continental",
        price: "₹1,500 for two",
        rating: "4.7",
        imageUrl: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=500",
        location: "Indore",
        address: "12, Old Palasia, Indore",
        type: "Bar",
        music: "Live Band",
        happyHours: "5 PM - 8 PM (Buy 1 Get 1)",
        featured: true,
        openingTime: "5:00 PM",
        closingTime: "1:00 AM"
    },
    {
        name: "Terazza Bar and Kitchen",
        cuisine: "North Indian, Chinese, Italian",
        price: "₹1,300 for two",
        rating: "4.1",
        imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500",
        location: "Indore",
        address: "54, Vijay Nagar, Indore",
        type: "Bar",
        music: "DJ",
        happyHours: "6 PM - 9 PM (20% OFF)",
        featured: false,
        openingTime: "6:00 PM",
        closingTime: "12:00 AM"
    },
    {
        name: "Underdoggs",
        cuisine: "Continental, Pasta, Desserts",
        price: "₹1,500 for two",
        rating: "4.5",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
        location: "Indore",
        address: "Race Course Road, Indore",
        type: "Pub",
        music: "DJ",
        happyHours: "4 PM - 7 PM (Happy Hours)",
        featured: true,
        openingTime: "4:00 PM",
        closingTime: "1:30 AM"
    },
    {
        name: "The Beer Cafe",
        cuisine: "Continental, Fast Food",
        price: "₹1,200 for two",
        rating: "4.3",
        imageUrl: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500",
        location: "Indore",
        address: "Treasure Island Mall, Indore",
        type: "Microbrewery",
        music: "Bollywood",
        happyHours: "12 PM - 7 PM (Special Offers)",
        featured: false,
        openingTime: "12:00 PM",
        closingTime: "11:30 PM"
    },
    {
        name: "Altitude Lounge",
        cuisine: "Continental, Chinese",
        price: "₹1,800 for two",
        rating: "4.6",
        imageUrl: "https://images.unsplash.com/photo-1566411520896-01e7ca4726af?w=500",
        location: "Indore",
        address: "Sayaji Hotel, Indore",
        type: "Lounge",
        music: "EDM",
        happyHours: "8 PM - 11 PM (Ladies Night)",
        featured: true,
        openingTime: "7:00 PM",
        closingTime: "2:00 AM"
    },

    // ========== MUMBAI ==========
    {
        name: "Trilogy Nightclub",
        cuisine: "Continental, Finger Food",
        price: "₹2,500 for two",
        rating: "4.8",
        imageUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=500",
        location: "Mumbai",
        address: "Juhu, Mumbai",
        type: "Night Club",
        music: "EDM",
        happyHours: "9 PM - 11 PM",
        featured: true,
        openingTime: "8:00 PM",
        closingTime: "3:00 AM"
    },
    {
        name: "Bombay High",
        cuisine: "Continental, Chinese",
        price: "₹2,000 for two",
        rating: "4.5",
        imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a1a5b2?w=500",
        location: "Mumbai",
        address: "Bandra West, Mumbai",
        type: "Pub",
        music: "Live Band",
        happyHours: "6 PM - 9 PM",
        featured: false,
        openingTime: "6:00 PM",
        closingTime: "1:30 AM"
    },
    {
        name: "Hype",
        cuisine: "Continental, Italian",
        price: "₹2,200 for two",
        rating: "4.6",
        imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0a17cc34?w=500",
        location: "Mumbai",
        address: "Lower Parel, Mumbai",
        type: "Night Club",
        music: "EDM",
        happyHours: "8 PM - 10 PM",
        featured: true,
        openingTime: "8:00 PM",
        closingTime: "2:30 AM"
    },
    {
        name: "Aer Lounge",
        cuisine: "Continental, Sushi",
        price: "₹3,000 for two",
        rating: "4.7",
        imageUrl: "https://images.unsplash.com/photo-1580820267682-426da823b514?w=500",
        location: "Mumbai",
        address: "Worli, Mumbai",
        type: "Lounge",
        music: "Chill",
        happyHours: "5 PM - 8 PM",
        featured: false,
        openingTime: "5:00 PM",
        closingTime: "1:00 AM"
    },

    // ========== DELHI ==========
    {
        name: "Lord of the Drinks",
        cuisine: "Continental, Italian",
        price: "₹1,800 for two",
        rating: "4.5",
        imageUrl: "https://images.unsplash.com/photo-1566411520896-01e7ca4726af?w=500",
        location: "Delhi",
        address: "Connaught Place, Delhi",
        type: "Bar",
        music: "Bollywood",
        happyHours: "4 PM - 7 PM",
        featured: true,
        openingTime: "4:00 PM",
        closingTime: "1:00 AM"
    },
    {
        name: "Social",
        cuisine: "Continental, Fast Food",
        price: "₹1,500 for two",
        rating: "4.4",
        imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a1a5b2?w=500",
        location: "Delhi",
        address: "Hauz Khas Village, Delhi",
        type: "Pub",
        music: "DJ",
        happyHours: "12 PM - 7 PM",
        featured: false,
        openingTime: "12:00 PM",
        closingTime: "12:30 AM"
    },
    {
        name: "Privee",
        cuisine: "Continental, Asian",
        price: "₹2,500 for two",
        rating: "4.7",
        imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0a17cc34?w=500",
        location: "Delhi",
        address: "Mehrauli, Delhi",
        type: "Night Club",
        music: "EDM",
        happyHours: "8 PM - 10 PM",
        featured: true,
        openingTime: "8:00 PM",
        closingTime: "2:30 AM"
    },

    // ========== BANGALORE ==========
    {
        name: "Toit",
        cuisine: "Continental, Pizza",
        price: "₹1,600 for two",
        rating: "4.6",
        imageUrl: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500",
        location: "Bangalore",
        address: "Indiranagar, Bangalore",
        type: "Microbrewery",
        music: "Live Band",
        happyHours: "4 PM - 7 PM",
        featured: true,
        openingTime: "12:00 PM",
        closingTime: "11:30 PM"
    },
    {
        name: "Hard Rock Cafe",
        cuisine: "American, Continental",
        price: "₹2,000 for two",
        rating: "4.5",
        imageUrl: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=500",
        location: "Bangalore",
        address: "St. Marks Road, Bangalore",
        type: "Bar",
        music: "Live Rock",
        happyHours: "4 PM - 7 PM",
        featured: false,
        openingTime: "11:00 AM",
        closingTime: "11:30 PM"
    },
    {
        name: "Skyye Lounge",
        cuisine: "Continental, Italian",
        price: "₹2,200 for two",
        rating: "4.6",
        imageUrl: "https://images.unsplash.com/photo-1580820267682-426da823b514?w=500",
        location: "Bangalore",
        address: "UB City, Bangalore",
        type: "Lounge",
        music: "EDM",
        happyHours: "6 PM - 9 PM",
        featured: true,
        openingTime: "6:00 PM",
        closingTime: "1:00 AM"
    },

    // ========== JAIPUR ==========
    {
        name: "100% Rock",
        cuisine: "Continental, Finger Food",
        price: "₹1,400 for two",
        rating: "4.4",
        imageUrl: "https://images.unsplash.com/photo-1566411520896-01e7ca4726af?w=500",
        location: "Jaipur",
        address: "MI Road, Jaipur",
        type: "Pub",
        music: "Rock",
        happyHours: "5 PM - 8 PM",
        featured: true,
        openingTime: "5:00 PM",
        closingTime: "12:30 AM"
    },
    {
        name: "Blackout",
        cuisine: "Continental, Chinese",
        price: "₹1,500 for two",
        rating: "4.3",
        imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0a17cc34?w=500",
        location: "Jaipur",
        address: "C Scheme, Jaipur",
        type: "Night Club",
        music: "EDM",
        happyHours: "8 PM - 10 PM",
        featured: false,
        openingTime: "7:00 PM",
        closingTime: "2:00 AM"
    },

    // ========== KOLKATA ==========
    {
        name: "Someplace Else",
        cuisine: "Continental, Indian",
        price: "₹1,500 for two",
        rating: "4.5",
        imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a1a5b2?w=500",
        location: "Kolkata",
        address: "Park Street, Kolkata",
        type: "Pub",
        music: "Live Band",
        happyHours: "5 PM - 8 PM",
        featured: true,
        openingTime: "5:00 PM",
        closingTime: "12:00 AM"
    },
    {
        name: "Roxy",
        cuisine: "Continental, Italian",
        price: "₹1,800 for two",
        rating: "4.5",
        imageUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=500",
        location: "Kolkata",
        address: "Park Street, Kolkata",
        type: "Bar",
        music: "DJ",
        happyHours: "6 PM - 9 PM",
        featured: false,
        openingTime: "6:00 PM",
        closingTime: "1:00 AM"
    },

    // ========== HYDERABAD ==========
    {
        name: "10 Downing Street",
        cuisine: "Continental, Italian",
        price: "₹1,800 for two",
        rating: "4.5",
        imageUrl: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=500",
        location: "Hyderabad",
        address: "Jubilee Hills, Hyderabad",
        type: "Bar",
        music: "DJ",
        happyHours: "5 PM - 8 PM",
        featured: true,
        openingTime: "5:00 PM",
        closingTime: "1:00 AM"
    },
    {
        name: "Hard Rock Cafe",
        cuisine: "American, Continental",
        price: "₹2,000 for two",
        rating: "4.5",
        imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a1a5b2?w=500",
        location: "Hyderabad",
        address: "Gachibowli, Hyderabad",
        type: "Bar",
        music: "Live Rock",
        happyHours: "4 PM - 7 PM",
        featured: false,
        openingTime: "11:00 AM",
        closingTime: "11:30 PM"
    },

    // ========== PUNE ==========
    {
        name: "High Spirits",
        cuisine: "Continental, Fast Food",
        price: "₹1,200 for two",
        rating: "4.3",
        imageUrl: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500",
        location: "Pune",
        address: "Koregaon Park, Pune",
        type: "Pub",
        music: "Bollywood",
        happyHours: "4 PM - 7 PM",
        featured: true,
        openingTime: "4:00 PM",
        closingTime: "1:00 AM"
    },
    {
        name: "The Doolally",
        cuisine: "Continental, Pizza",
        price: "₹1,500 for two",
        rating: "4.5",
        imageUrl: "https://images.unsplash.com/photo-1566411520896-01e7ca4726af?w=500",
        location: "Pune",
        address: "Koregaon Park, Pune",
        type: "Microbrewery",
        music: "Live Band",
        happyHours: "4 PM - 7 PM",
        featured: false,
        openingTime: "12:00 PM",
        closingTime: "11:30 PM"
    },

    // ========== AHMEDABAD ==========
    {
        name: "10 Downing Street",
        cuisine: "Continental, Italian",
        price: "₹1,500 for two",
        rating: "4.4",
        imageUrl: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=500",
        location: "Ahmedabad",
        address: "CG Road, Ahmedabad",
        type: "Bar",
        music: "DJ",
        happyHours: "5 PM - 8 PM",
        featured: true,
        openingTime: "5:00 PM",
        closingTime: "1:00 AM"
    },
    {
        name: "The House of Commons",
        cuisine: "Continental, Chinese",
        price: "₹1,600 for two",
        rating: "4.3",
        imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0a17cc34?w=500",
        location: "Ahmedabad",
        address: "Satellite, Ahmedabad",
        type: "Pub",
        music: "DJ",
        happyHours: "6 PM - 9 PM",
        featured: false,
        openingTime: "6:00 PM",
        closingTime: "12:30 AM"
    },

    // ========== CHENNAI ==========
    {
        name: "Dublin",
        cuisine: "Continental, Irish",
        price: "₹1,800 for two",
        rating: "4.4",
        imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a1a5b2?w=500",
        location: "Chennai",
        address: "Nungambakkam, Chennai",
        type: "Pub",
        music: "Live Band",
        happyHours: "5 PM - 8 PM",
        featured: true,
        openingTime: "5:00 PM",
        closingTime: "12:30 AM"
    },
    {
        name: "Skyline",
        cuisine: "Continental, Asian",
        price: "₹2,000 for two",
        rating: "4.5",
        imageUrl: "https://images.unsplash.com/photo-1580820267682-426da823b514?w=500",
        location: "Chennai",
        address: "Egmore, Chennai",
        type: "Lounge",
        music: "EDM",
        happyHours: "7 PM - 10 PM",
        featured: false,
        openingTime: "7:00 PM",
        closingTime: "1:00 AM"
    },

    // ========== LUCKNOW ==========
    {
        name: "F Club",
        cuisine: "Continental, Chinese",
        price: "₹1,400 for two",
        rating: "4.2",
        imageUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=500",
        location: "Lucknow",
        address: "Hazratganj, Lucknow",
        type: "Night Club",
        music: "EDM",
        happyHours: "8 PM - 10 PM",
        featured: true,
        openingTime: "7:00 PM",
        closingTime: "1:30 AM"
    },
    {
        name: "Muse Lounge",
        cuisine: "Continental, Italian",
        price: "₹1,500 for two",
        rating: "4.3",
        imageUrl: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=500",
        location: "Lucknow",
        address: "Gomti Nagar, Lucknow",
        type: "Lounge",
        music: "DJ",
        happyHours: "6 PM - 9 PM",
        featured: false,
        openingTime: "6:00 PM",
        closingTime: "12:30 AM"
    },

    // ========== GOA ==========
    {
        name: "LPK Waterfront",
        cuisine: "Continental, Seafood",
        price: "₹2,500 for two",
        rating: "4.8",
        imageUrl: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=500",
        location: "Panjim",
        address: "Nerul, Goa",
        type: "Night Club",
        music: "EDM",
        happyHours: "8 PM - 10 PM",
        featured: true,
        openingTime: "7:00 PM",
        closingTime: "3:00 AM"
    },
    {
        name: "Curlies",
        cuisine: "Continental, Seafood",
        price: "₹1,800 for two",
        rating: "4.6",
        imageUrl: "https://images.unsplash.com/photo-1566411520896-01e7ca4726af?w=500",
        location: "Panjim",
        address: "Anjuna Beach, Goa",
        type: "Bar",
        music: "DJ",
        happyHours: "4 PM - 7 PM",
        featured: true,
        openingTime: "10:00 AM",
        closingTime: "2:00 AM"
    },
    {
        name: "Club Cubana",
        cuisine: "Continental, Finger Food",
        price: "₹2,000 for two",
        rating: "4.7",
        imageUrl: "https://images.unsplash.com/photo-1572116469696-31de0a17cc34?w=500",
        location: "Panjim",
        address: "Arpora, Goa",
        type: "Night Club",
        music: "EDM",
        happyHours: "9 PM - 11 PM",
        featured: true,
        openingTime: "9:00 PM",
        closingTime: "4:00 AM"
    }
];

const seedNightlife = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME || 'zomoro_db'
        });
        console.log('✅ Connected to MongoDB');

        await Nightlife.deleteMany({});
        console.log('✅ Cleared existing nightlife places');

        const result = await Nightlife.insertMany(nightlifePlaces);
        console.log(`✅ Added ${result.length} nightlife places`);

        // Group by location
        const locationCount = {};
        result.forEach(p => {
            locationCount[p.location] = (locationCount[p.location] || 0) + 1;
        });

        console.log('\n📊 Nightlife by City:');
        Object.keys(locationCount).sort().forEach(loc => {
            console.log(`   ${loc}: ${locationCount[loc]} places`);
        });

        console.log('\n🎉 Nightlife data seeded successfully!');

    } catch (error) {
        console.error('❌ Error seeding nightlife:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
};

seedNightlife();