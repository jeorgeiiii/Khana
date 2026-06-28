import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import socketService from '../../services/socketService';
import './DeliveryDashboard.css';

// Default Indore locations — MUST match CustomerTrackOrder defaults
// so the marker lines up with the customer's map.
const DEFAULT_RESTAURANT = { lat: 22.7196, lng: 75.8577 };
const DEFAULT_CUSTOMER = { lat: 22.7256, lng: 75.8655 };

const DeliveryDashboard = ({
    orderId: propOrderId,
    driverId: propDriverId,
    restaurantLocation: propRestaurant,
    customerLocation: propCustomer
}) => {
    // Read orderId from the URL (/delivery-dashboard/:orderId), fall back to prop/default
    const { orderId: paramOrderId } = useParams();
    const orderId = propOrderId || paramOrderId || 'ORDER123';
    const driverId = propDriverId || 'DRIVER1';

    // Use passed-in locations if provided, otherwise safe defaults (prevents crash)
    const restaurantLocation = propRestaurant || DEFAULT_RESTAURANT;
    const customerLocation = propCustomer || DEFAULT_CUSTOMER;

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isActive) {
            startSimulatedMovement();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive]);

    const startSimulatedMovement = () => {
        // Guard: never run without valid coordinates
        if (!restaurantLocation || !customerLocation) {
            console.error('Missing restaurant or customer location');
            return;
        }

        setStatus('moving'); // <-- was missing; now the "On the Way" UI shows

        const steps = 50;
        let currentStep = 0;
        const latDiff = customerLocation.lat - restaurantLocation.lat;
        const lngDiff = customerLocation.lng - restaurantLocation.lng;

        const interval = setInterval(() => {
            if (currentStep >= steps) {
                clearInterval(interval);
                setStatus('arrived');
                setProgress(100);
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
                <button
                    className={`activate-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setIsActive(!isActive)}
                    disabled={isActive}
                >
                    {isActive ? 'Active' : 'Start Delivery'}
                </button>
            </div>

            {/* Small helper line so the driver knows which order they're on */}
            <div style={{ fontSize: '13px', color: '#666', margin: '4px 0 12px' }}>
                Order: <strong>{orderId}</strong>
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
