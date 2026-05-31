import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import './Checkout.css';

const Checkout = ({ cartItems, restaurant, onClose, clearCart }) => {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        pincode: '',
        type: 'home'
    });
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [orderSummary, setOrderSummary] = useState({
        subtotal: 0,
        tax: 0,
        deliveryFee: 40,
        total: 0
    });

    const navigate = useNavigate();

    useEffect(() => {
        calculateOrderSummary();
        fetchUserAddresses();
    }, [cartItems]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const fetchUserAddresses = async () => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.warn('No token found, user not logged in');
                return;
            }

            const response = await fetch('http://localhost:5000/api/v1/user/addresses', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                console.error('Token expired or invalid');
                localStorage.removeItem('token');
                localStorage.removeItem('loggedInUser');
                return;
            }

            const data = await response.json();
            
            if (data.success) {
                setAddresses(data.addresses || []);
                const defaultAddr = data.addresses?.find(addr => addr.isDefault);
                if (defaultAddr) setSelectedAddress(defaultAddr);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const calculateOrderSummary = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = Math.round(subtotal * 0.05);
        const total = subtotal + tax + orderSummary.deliveryFee;
        
        setOrderSummary({
            subtotal,
            tax,
            deliveryFee: 40,
            total
        });
    };

    const handleAddAddress = async () => {
        if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pincode) {
            handleError('Please fill all address fields');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                handleError('Please login to add address');
                return;
            }

            const response = await fetch('http://localhost:5000/api/v1/user/add-address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAddress)
            });
            
            const data = await response.json();
            
            if (data.success) {
                handleSuccess('Address added successfully');
                setShowNewAddressForm(false);
                fetchUserAddresses();
                setNewAddress({
                    street: '',
                    city: '',
                    state: '',
                    pincode: '',
                    type: 'home'
                });
            } else {
                handleError(data.message || 'Failed to add address');
            }
        } catch (error) {
            console.error('Error adding address:', error);
            handleError('Failed to add address');
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        if (!selectedAddress) {
            handleError('Please select delivery address');
            return;
        }

        if (paymentMethod === 'cod') {
            handleCodOrder();
            return;
        }

        setLoading(true);
        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                handleError('Failed to load payment gateway');
                setLoading(false);
                return;
            }

            const token = localStorage.getItem('token');
            
            if (!token) {
                handleError('Please login to place order');
                setLoading(false);
                return;
            }

            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const orderResponse = await fetch('http://localhost:5000/api/v1/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: orderSummary.total,
                    currency: 'INR',
                    receipt: `order_${Date.now()}`
                })
            });

            const orderData = await orderResponse.json();

            if (!orderData.success) {
                handleError('Failed to create payment order');
                setLoading(false);
                return;
            }

            const options = {
                key: 'rzp_test_SRarJVU7UHLXje', 
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Zomoro Food Delivery',
                description: `Order from ${restaurant?.Title || restaurant?.name || 'Restaurant'}`,
                image: '/zomato-logo.png',
                order_id: orderData.orderId,
                handler: async (razorpayResponse) => {
                    const verifyResponse = await fetch('http://localhost:5000/api/v1/payment/verify-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: razorpayResponse.razorpay_order_id,
                            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                            razorpay_signature: razorpayResponse.razorpay_signature,
                            orderDetails: {
                                restaurantId: restaurant?._id,
                                items: cartItems.map(item => ({
                                    foodId: item._id,
                                    name: item.name,
                                    quantity: item.quantity,
                                    price: item.price,
                                    total: item.price * item.quantity
                                })),
                                address: selectedAddress,
                                paymentMethod,
                                subtotal: orderSummary.subtotal,
                                tax: orderSummary.tax,
                                deliveryFee: orderSummary.deliveryFee,
                                totalAmount: orderSummary.total
                            }
                        })
                    });

                    const verifyData = await verifyResponse.json();

                    if (verifyData.success) {
                        handleSuccess('Payment successful! 🎉');
                        if (clearCart) clearCart();
                        // Clear localStorage cart
                        localStorage.removeItem('cartItems');
                        localStorage.removeItem('selectedRestaurant');
                        setTimeout(() => {
                            navigate(`/order-confirmation/${verifyData.orderId}`);
                        }, 1500);
                    } else {
                        handleError('Payment verification failed');
                    }
                },
                prefill: {
                    name: user.name || '',
                    email: user.email || '',
                    contact: user.phone || ''
                },
                notes: {
                    address: selectedAddress?.street
                },
                theme: {
                    color: '#ff5722'
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        handleError('Payment cancelled');
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Payment error:', error);
            handleError('Payment failed. Please try again.');
            setLoading(false);
        }
    };

    const handleCodOrder = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                handleError('Please login to place order');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/v1/payment/cod-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    restaurantId: restaurant?._id,
                    items: cartItems.map(item => ({
                        foodId: item._id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.price * item.quantity
                    })),
                    address: selectedAddress,
                    paymentMethod: 'cod',
                    subtotal: orderSummary.subtotal,
                    tax: orderSummary.tax,
                    deliveryFee: orderSummary.deliveryFee,
                    totalAmount: orderSummary.total,
                    estimatedDeliveryTime: '30-40 min'
                })
            });

            const data = await response.json();

            if (data.success) {
                handleSuccess('Order placed successfully! 🎉');
                if (clearCart) clearCart();
                // Clear localStorage cart
                localStorage.removeItem('cartItems');
                localStorage.removeItem('selectedRestaurant');
                setTimeout(() => {
                    navigate(`/order-confirmation/${data.orderId}`);
                }, 1500);
            } else {
                handleError(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('COD order error:', error);
            handleError('Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <div className="checkout-header">
                <h2>Checkout</h2>
                <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <div className="checkout-content">
                {/* Delivery Address Section */}
                <div className="section">
                    <h3>Delivery Address</h3>
                    <div className="address-list">
                        {addresses.length > 0 ? (
                            addresses.map((addr, index) => (
                                <div
                                    key={index}
                                    className={`address-card ${selectedAddress?._id === addr._id ? 'selected' : ''}`}
                                    onClick={() => setSelectedAddress(addr)}
                                >
                                    <div className="address-type">
                                        <span className={`type-badge ${addr.type}`}>
                                            {addr.type === 'home' ? '🏠 Home' : 
                                             addr.type === 'work' ? '💼 Work' : '📍 Other'}
                                        </span>
                                        {addr.isDefault && <span className="default-badge">Default</span>}
                                    </div>
                                    <p className="address-text">
                                        {addr.street}<br />
                                        {addr.city}, {addr.state} - {addr.pincode}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="no-addresses">
                                <p>No saved addresses. Add one below.</p>
                            </div>
                        )}
                        
                        <button 
                            className="add-address-btn"
                            onClick={() => setShowNewAddressForm(true)}
                        >
                            + Add New Address
                        </button>
                    </div>

                    {showNewAddressForm && (
                        <div className="new-address-form">
                            <input
                                type="text"
                                placeholder="Street Address"
                                value={newAddress.street}
                                onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                            />
                            <div className="form-row">
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={newAddress.city}
                                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                />
                                <input
                                    type="text"
                                    placeholder="State"
                                    value={newAddress.state}
                                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                                />
                            </div>
                            <div className="form-row">
                                <input
                                    type="text"
                                    placeholder="Pincode"
                                    value={newAddress.pincode}
                                    onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                                />
                                <select
                                    value={newAddress.type}
                                    onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                                >
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button onClick={handleAddAddress}>Save Address</button>
                                <button onClick={() => setShowNewAddressForm(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary Section */}
                <div className="section">
                    <h3>Order Summary</h3>
                    <div className="order-items">
                        {cartItems.map((item, index) => (
                            <div key={index} className="order-item">
                                <span className="item-name">{item.name} x{item.quantity}</span>
                                <span className="item-price">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="price-breakdown">
                        <div className="price-row">
                            <span>Subtotal</span>
                            <span>₹{orderSummary.subtotal}</span>
                        </div>
                        <div className="price-row">
                            <span>Tax (5%)</span>
                            <span>₹{orderSummary.tax}</span>
                        </div>
                        <div className="price-row">
                            <span>Delivery Fee</span>
                            <span>₹{orderSummary.deliveryFee}</span>
                        </div>
                        <div className="price-row total">
                            <span>Total</span>
                            <span>₹{orderSummary.total}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Methods Section */}
                <div className="section">
                    <h3>Payment Method</h3>
                    <div className="payment-methods">
                        <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="option-icon">💳</span>
                            <span>Credit/Debit Card</span>
                        </label>

                        <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="upi"
                                checked={paymentMethod === 'upi'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="option-icon">📱</span>
                            <span>UPI (GPay/PhonePe)</span>
                        </label>

                        <label className={`payment-option ${paymentMethod === 'netbanking' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="netbanking"
                                checked={paymentMethod === 'netbanking'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="option-icon">🏦</span>
                            <span>Net Banking</span>
                        </label>

                        <label className={`payment-option ${paymentMethod === 'wallet' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="wallet"
                                checked={paymentMethod === 'wallet'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="option-icon">👛</span>
                            <span>Wallet</span>
                        </label>

                        <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="payment"
                                value="cod"
                                checked={paymentMethod === 'cod'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="option-icon">💵</span>
                            <span>Cash on Delivery</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="checkout-footer">
                <button
                    className="place-order-btn"
                    onClick={handlePayment}
                    disabled={loading || !selectedAddress}
                >
                    {loading ? 'Processing...' : `Place Order • ₹${orderSummary.total}`}
                </button>
            </div>
        </div>
    );
};

export default Checkout;