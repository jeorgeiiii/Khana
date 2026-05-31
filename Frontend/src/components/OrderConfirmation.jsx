import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { handleError } from '../utils';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    useEffect(() => {
        if (order?.estimatedDeliveryTime) {
            // Parse estimated time and update countdown
            const interval = setInterval(() => {
                // Update time left logic
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [order]);

    const fetchOrderDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/v1/payment/order/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setOrder(data.order);
            } else {
                handleError('Failed to fetch order details');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            handleError('Error loading order');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="confirmation-container loading-state">
                <div className="loading-spinner">Loading order details...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="confirmation-container error-state">
                <h2>Order not found</h2>
                <button onClick={() => navigate('/home')}>Go to Home</button>
            </div>
        );
    }

    return (
        <div className="confirmation-container">
            <div className="confirmation-card">
                <div className="success-animation">
                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>

                <h1>Order Confirmed!</h1>
                <p className="order-id">Order #{order._id.slice(-8)}</p>

                <div className="delivery-info">
                    <div className="info-item">
                        <span className="label">Estimated Delivery</span>
                        <span className="value">{order.estimatedDeliveryTime}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Payment Method</span>
                        <span className="value">
                            {order.paymentInfo.method === 'cod' ? 'Cash on Delivery' : 
                             order.paymentInfo.method === 'card' ? 'Card' : 
                             order.paymentInfo.method === 'upi' ? 'UPI' : 'Online'}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="label">Payment Status</span>
                        <span className={`value status-${order.paymentInfo.status}`}>
                            {order.paymentInfo.status}
                        </span>
                    </div>
                </div>

                <div className="restaurant-info">
                    <h3>{order.restaurantId?.Title}</h3>
                    <p>{order.restaurantId?.address}</p>
                    <p className="phone">{order.restaurantId?.phone}</p>
                </div>

                <div className="order-items">
                    <h4>Order Items</h4>
                    {order.items.map((item, index) => (
                        <div key={index} className="item-row">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">x{item.quantity}</span>
                            <span className="item-price">₹{item.price}</span>
                        </div>
                    ))}
                </div>

                <div className="delivery-address">
                    <h4>Delivery Address</h4>
                    <p>
                        {order.address.street}<br />
                        {order.address.city}, {order.address.state} - {order.address.pincode}
                    </p>
                </div>

                <div className="action-buttons">
                    <button className="track-btn" onClick={() => navigate(`/track-order/${orderId}`)}>
                        Track Order
                    </button>
                    <button className="home-btn" onClick={() => navigate('/home')}>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;