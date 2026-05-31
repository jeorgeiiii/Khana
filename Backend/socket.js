const socketIo = require('socket.io');

let io;
let activeDrivers = new Map(); // Store active driver connections

const initSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: ['http://localhost:3000', 'http://localhost:3001'],
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    
    io.on('connection', (socket) => {
        console.log('🔌 New client connected:', socket.id);
        
        // Driver joins with their ID
        socket.on('driver-join', (data) => {
            const { driverId, orderId, name, phone, vehicle } = data;
            activeDrivers.set(driverId, {
                socketId: socket.id,
                orderId,
                name,
                phone,
                vehicle,
                location: null
            });
            socket.join(`order-${orderId}`);
            console.log(`🛵 Driver ${name} joined order ${orderId}`);
        });
        
        // Driver updates location
        socket.on('driver-location-update', (data) => {
            const { driverId, orderId, location } = data;
            
            // Store in memory
            if (activeDrivers.has(driverId)) {
                activeDrivers.get(driverId).location = location;
            }
            
            // Broadcast to all clients tracking this order
            io.to(`order-${orderId}`).emit('location-update', {
                driverId,
                location,
                timestamp: new Date(),
                estimatedArrival: calculateETA(location, orderId)
            });
            
            console.log(`📍 Driver ${driverId} updated location: ${location.lat}, ${location.lng}`);
        });
        
        // Driver completes delivery
        socket.on('delivery-completed', (data) => {
            const { orderId } = data;
            io.to(`order-${orderId}`).emit('order-status-update', {
                status: 'delivered',
                message: 'Your order has been delivered! 🎉'
            });
        });
        
        // Driver disconnects
        socket.on('disconnect', () => {
            // Remove from active drivers
            for (const [driverId, driver] of activeDrivers) {
                if (driver.socketId === socket.id) {
                    activeDrivers.delete(driverId);
                    console.log(`❌ Driver ${driverId} disconnected`);
                    break;
                }
            }
        });
    });
    
    return io;
};

// Calculate ETA based on current location
const calculateETA = (currentLocation, orderId) => {
    // In real app, use OSRM to calculate route time
    // For demo, return random time between 5-30 minutes
    return Math.floor(Math.random() * 25) + 5;
};

// Get active driver location
const getDriverLocation = (driverId) => {
    if (activeDrivers.has(driverId)) {
        return activeDrivers.get(driverId).location;
    }
    return null;
};

// Get all active orders
const getActiveOrders = () => {
    const orders = [];
    for (const [driverId, driver] of activeDrivers) {
        orders.push({
            driverId,
            orderId: driver.orderId,
            name: driver.name,
            location: driver.location
        });
    }
    return orders;
};

module.exports = { initSocket, io, getDriverLocation, getActiveOrders };