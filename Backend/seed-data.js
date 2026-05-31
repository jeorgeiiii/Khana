const mongoose = require('mongoose');
require('dotenv').config();

const sampleRestaurants = [
  {
    Title: "Olio - The Mood Fired Pizzeria",
    ImageURL: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
    Time: "Open 24 Hours",
    Pickup: true,
    Delivery: true,
    isOpen: true,
    Logourl: "https://example.com/olio-logo.jpg",
    Rating: 4.5,
    RatingCount: 1250,
    Code: "OLIO001",
    address: "6, Opposite Palsia Police Station, Old Palsia, Indore",
    phone: "+91971703317",
    cuisine: "Pizza, Italian, Fast Food",
    price: "₹200 for two",
    Coords: {
      id: "1",
      latitude: 22.7196,
      latitudeDelta: 0.01,
      longitude: 75.8577,
      longitudeDelta: 0.01,
      address: "6, Opposite Palsia Police Station, Old Palsia, Indore",
      title: "Olio Pizzeria"
    }
  },
  {
    Title: "Apna Sweets",
    ImageURL: "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=500",
    Time: "9AM - 10PM",
    Pickup: true,
    Delivery: true,
    isOpen: true,
    Logourl: "https://example.com/apna-logo.jpg",
    Rating: 4.3,
    RatingCount: 890,
    Code: "APNA002",
    address: "456 Sweet Lane, New Palasia, Indore",
    phone: "+91971703321",
    cuisine: "Desserts, Sweets, Ice Cream, Juice",
    price: "₹150 per person",
    Coords: {
      id: "2",
      latitude: 22.7256,
      latitudeDelta: 0.01,
      longitude: 75.8655,
      longitudeDelta: 0.01,
      address: "456 Sweet Lane, New Palasia, Indore",
      title: "Apna Sweets"
    }
  },
  {
    Title: "Tandoori Nights",
    ImageURL: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500",
    Time: "11AM - 11PM",
    Pickup: true,
    Delivery: true,
    isOpen: true,
    Logourl: "https://example.com/tandoori-logo.jpg",
    Rating: 4.4,
    RatingCount: 2100,
    Code: "TAND003",
    address: "78, MG Road, South Tukoganj, Indore",
    phone: "+91971703333",
    cuisine: "North Indian, BBQ, Kebabs, Biryani",
    price: "₹300 for two",
    Coords: {
      id: "3",
      latitude: 22.7106,
      latitudeDelta: 0.01,
      longitude: 75.8752,
      longitudeDelta: 0.01,
      address: "78, MG Road, South Tukoganj, Indore",
      title: "Tandoori Nights"
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB (remove deprecated options)
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || 'zomoro_db'
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Get the collection
    const db = mongoose.connection.db;
    const collection = db.collection('resturants');
    
    // Clear existing data
    await collection.deleteMany({});
    console.log('✅ Cleared existing restaurants');
    
    // Insert new data
    const result = await collection.insertMany(sampleRestaurants);
    console.log(`✅ Added ${result.insertedCount} restaurants`);
    
    // Verify the data
    const count = await collection.countDocuments();
    console.log(`📊 Total restaurants in DB: ${count}`);
    
    // Show the inserted restaurants
    const restaurants = await collection.find({}).toArray();
    console.log('\n📋 Restaurants added:');
    restaurants.forEach((r, i) => {
      console.log(`${i + 1}. ${r.Title} (ID: ${r._id})`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
};

seedDatabase();