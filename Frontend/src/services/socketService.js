import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        if (this.socket?.connected) return;

        this.socket = io('http://localhost:5000', {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        this.socket.on('connect', () => {
            console.log('✅ Connected to tracking server');
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Disconnected from tracking server');
        });
    }

    joinAsDriver(driverId, orderId, name, phone, vehicle) {
        this.connect();
        this.socket.emit('driver-join', { driverId, orderId, name, phone, vehicle });
    }

    trackOrder(orderId) {
        this.connect();
        this.socket.emit('track-order', { orderId });
    }

    updateLocation(driverId, orderId, location) {
        if (this.socket?.connected) {
            this.socket.emit('driver-location-update', { driverId, orderId, location });
        }
    }

    onLocationUpdate(callback) {
        this.socket?.on('location-update', callback);
    }

    onOrderStatusUpdate(callback) {
        this.socket?.on('order-status-update', callback);
    }

    off(event, callback) {
        this.socket?.off(event, callback);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

export default new SocketService();