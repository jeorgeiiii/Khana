import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DeliveryTracker from '../components/Map/DeliveryTracker';
import socketService from '../services/socketService';
import './CustomerTrackOrder.css';

const CustomerTrackOrder = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [orderStatus, setOrderStatus] = useState('confirmed');
    const [restaurantLocation, setRestaurantLocation] = useState({ lat: 22.7196, lng: 75.8577 });
    const [customerLocation, setCustomerLocation] = useState({ lat: 22.7256, lng: 75.8655 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();

        socketService.connect();
        socketService.trackOrder(orderId);

        socketService.onLocationUpdate((data) => {
            console.log('📍 Driver location update:', data.location);
            setDriverLocation(data.location);
            setOrderStatus('out_for_delivery');
        });

        socketService.onOrderStatusUpdate((data) => {
            console.log('📦 Order status:', data.status);
            setOrderStatus(data.status);
        });

        return () => {
            socketService.off('location-update');
            socketService.off('order-status-update');
        };
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/v1/orders/${orderId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setOrder(data.order);
                setOrderStatus(data.order.status);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="track-loading">Loading order details...</div>;
    }

    return (
        <div className="customer-track-order">
            <DeliveryTracker
                order={order}
                restaurantLocation={restaurantLocation}
                customerLocation={customerLocation}
                driverLocation={driverLocation}
                orderStatus={orderStatus}
            />
            <div className="live-badge">
                <span className="live-dot"></span> Live tracking active (updates in real-time)
            </div>
        </div>
    );
};

export default CustomerTrackOrder;