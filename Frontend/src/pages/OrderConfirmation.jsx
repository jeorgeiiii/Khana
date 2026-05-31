import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { handleSuccess } from '../utils';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(30); // 30 minutes delivery time

    useEffect(() => {
        fetchOrderDetails();
        
        // Countdown timer
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 60000); // Update every minute

        return () => clearInterval(interval);
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
            } else {
                // Demo order if API not ready
                setOrder({
                    _id: orderId,
                    restaurantName: "Olio Pizzeria",
                    items: [
                        { name: "Margherita Pizza", quantity: 1, price: 250 },
                        { name: "Garlic Bread", quantity: 2, price: 120 }
                    ],
                    totalAmount: 490,
                    deliveryAddress: "123 Main Street, Indore",
                    paymentMethod: "Online"
                });
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            // Demo order
            setOrder({
                _id: orderId,
                restaurantName: "Olio Pizzeria",
                items: [
                    { name: "Margherita Pizza", quantity: 1, price: 250 },
                    { name: "Garlic Bread", quantity: 2, price: 120 }
                ],
                totalAmount: 490,
                deliveryAddress: "123 Main Street, Indore",
                paymentMethod: "Online"
            });
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (minutes) => {
        if (minutes <= 0) return "Arriving soon!";
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hrs > 0) return `${hrs} hr ${mins} min`;
        return `${mins} min`;
    };

    if (loading) {
        return <div className="order-confirmation loading">Loading order details...</div>;
    }

    return (
        <div className="order-confirmation">
            {/* Success Animation */}
            <div className="success-animation">
                <div className="checkmark-circle">
                    <div className="checkmark"></div>
                </div>
                <h1>Order Confirmed! 🎉</h1>
                <p className="order-id">Order #{orderId?.slice(-8)}</p>
            </div>

            {/* Order Summary */}
            <div className="order-summary-card">
                <h3>Order Summary</h3>
                <div className="restaurant-info">
                    <span className="restaurant-name">{order?.restaurantName}</span>
                    <span className="order-status confirmed">Confirmed</span>
                </div>

                <div className="items-list">
                    {order?.items?.map((item, idx) => (
                        <div key={idx} className="order-item">
                            <span className="item-name">{item.name} x{item.quantity}</span>
                            <span className="item-price">₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                </div>

                <div className="order-total">
                    <span>Total Amount</span>
                    <span>₹{order?.totalAmount}</span>
                </div>

                <div className="delivery-info">
                    <div className="info-row">
                        <span>🚚 Delivery Address</span>
                        <span>{order?.deliveryAddress}</span>
                    </div>
                    <div className="info-row">
                        <span>💳 Payment Method</span>
                        <span>{order?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                    </div>
                    <div className="info-row">
                        <span>⏰ Estimated Delivery</span>
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
                <button 
                    className="track-btn"
                    onClick={() => navigate(`/track-order/${orderId}`)}
                >
                    🛵 Track Your Order
                </button>
                <button 
                    className="home-btn"
                    onClick={() => navigate('/home')}
                >
                    🏠 Back to Home
                </button>
            </div>

            {/* Tips */}
            <div className="tips-card">
                <h4>💡 What's Next?</h4>
                <ul>
                    <li>✓ Restaurant is preparing your order</li>
                    <li>✓ You'll receive an SMS when order is out for delivery</li>
                    <li>✓ Track your delivery partner in real-time</li>
                    <li>✓ Keep your phone handy</li>
                </ul>
            </div>
        </div>
    );
};

export default OrderConfirmation;