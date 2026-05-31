import React, { useState, useEffect } from 'react';
import socketService from '../../services/socketService';
import './DeliveryDashboard.css';

const DeliveryDashboard = ({ orderId, driverId, restaurantLocation, customerLocation }) => {
    const [isActive, setIsActive] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(restaurantLocation);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('waiting');

    useEffect(() => {
        socketService.connect();
        socketService.joinAsDriver(driverId, orderId, 'Rahul Sharma', '+91 98765 43210', 'Honda Activa');

        return () => {
            socketService.disconnect();
        };
    }, []);

    useEffect(() => {
        if (isActive) {
            startSimulatedMovement();
        }
    }, [isActive]);

    const startSimulatedMovement = () => {
        const steps = 50;
        let currentStep = 0;
        const latDiff = customerLocation.lat - restaurantLocation.lat;
        const lngDiff = customerLocation.lng - restaurantLocation.lng;

        const interval = setInterval(() => {
            if (currentStep >= steps) {
                clearInterval(interval);
                setStatus('arrived');
                setCurrentLocation(customerLocation);
                socketService.updateLocation(driverId, orderId, customerLocation);
                return;
            }

            const newLat = restaurantLocation.lat + (latDiff * (currentStep / steps));
            const newLng = restaurantLocation.lng + (lngDiff * (currentStep / steps));
            const newLocation = { lat: newLat, lng: newLng };
            setCurrentLocation(newLocation);
            socketService.updateLocation(driverId, orderId, newLocation);
            setProgress(Math.round((currentStep / steps) * 100));
            currentStep++;
        }, 1000);
    };

    const handleCompleteDelivery = () => {
        socketService.socket?.emit('delivery-completed', { orderId });
        setStatus('completed');
    };

    return (
        <div className="delivery-dashboard">
            <div className="delivery-header">
                <h2>🛵 Delivery Dashboard</h2>
                <button className={`activate-btn ${isActive ? 'active' : ''}`} onClick={() => setIsActive(!isActive)}>
                    {isActive ? 'Active' : 'Start Delivery'}
                </button>
            </div>

            <div className="delivery-status">
                <div className={`status-card ${status}`}>
                    <div className="status-icon">
                        {status === 'waiting' && '⏳'}
                        {status === 'moving' && '🚚'}
                        {status === 'arrived' && '📍'}
                        {status === 'completed' && '✅'}
                    </div>
                    <div className="status-text">
                        {status === 'waiting' && 'Ready to Start'}
                        {status === 'moving' && `On the Way (${progress}%)`}
                        {status === 'arrived' && 'Reached Customer'}
                        {status === 'completed' && 'Delivered!'}
                    </div>
                    {status === 'moving' && (
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    )}
                </div>
            </div>

            {status === 'arrived' && (
                <button className="complete-btn" onClick={handleCompleteDelivery}>Mark as Delivered</button>
            )}

            <div className="location-info">
                <p>📍 Current Location: {currentLocation?.lat?.toFixed(4)}, {currentLocation?.lng?.toFixed(4)}</p>
            </div>
        </div>
    );
};

export default DeliveryDashboard;