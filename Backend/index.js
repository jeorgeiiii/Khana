const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const connectDB = require('./config/db');
const { initSocket } = require('./socket');
// Configuration
dotenv.config();

// DB connection
connectDB();

// App + HTTP server + Socket.io
const app = express();
const server = http.createServer(app);
const io = initSocket(server);

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173', // Vite default — add if you use Vite
    ],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Make io available in routes
app.set('io', io);

// Routes
app.use('/api/v1/test', require('./routes/Testroute'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/user', require('./routes/userroute'));
app.use('/api/v1/resturant', require('./routes/resturantRoutes'));
app.use('/api/v1/category', require('./routes/categoryRoutes'));
app.use('/api/v1/food', require('./routes/foodRoutes'));
app.use('/api/v1/upload', require('./routes/uploadRoutes'));
app.use('/api/v1/products', require('./routes/productroutes'));
app.use('/api/v1/nightlife', require('./routes/nightlifeRoutes'));
app.use('/api/v1/otp', require('./routes/otpRoutes'));
app.use('/api/v1/orders', require('./routes/orderRoutes'));
app.use('/api/v1/review', require('./routes/reviewRoutes'));
app.use('/api/v1/cart', require('./routes/cartRoutes'));
app.use('/api/v1/payment', require('./routes/paymentRoutes'));

// Home route
app.get('/', (req, res) => {
    return res.status(200).send('<h2>Welcome to Food Restaurant API</h2>');
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message,
    });
});

// Port + listen (declared ONCE, before use)
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Socket.io ready for real-time updates`);
    console.log(`✅ Auth routes:        http://localhost:${PORT}/api/v1/auth`);
    console.log(`✅ Products route:     http://localhost:${PORT}/api/v1/products`);
    console.log(`✅ Restaurants route:  http://localhost:${PORT}/api/v1/resturant`);
    console.log('Razorpay key loaded:', process.env.RAZORPAY_KEY_ID ? '✅' : '❌');
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is already in use!`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});