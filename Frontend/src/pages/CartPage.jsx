import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import './CartPage.css';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState(null);
    const [orderSummary, setOrderSummary] = useState({
        subtotal: 0,
        tax: 0,
        deliveryFee: 40,
        total: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        loadCartFromStorage();
    }, []);

    useEffect(() => {
        calculateOrderSummary();
        // Save to localStorage whenever cart changes
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        if (restaurant) {
            localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
        }
    }, [cartItems, restaurant]);

    const loadCartFromStorage = () => {
        try {
            const savedCart = localStorage.getItem('cartItems');
            const savedRestaurant = localStorage.getItem('selectedRestaurant');
            
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart);
            }
            if (savedRestaurant) {
                setRestaurant(JSON.parse(savedRestaurant));
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
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

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(itemId);
            return;
        }
        
        const updatedCart = cartItems.map(item => 
            item._id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart);
    };

    const removeItem = (itemId) => {
        const updatedCart = cartItems.filter(item => item._id !== itemId);
        setCartItems(updatedCart);
        
        if (updatedCart.length === 0) {
            localStorage.removeItem('selectedRestaurant');
            setRestaurant(null);
        }
        handleSuccess('Item removed from cart');
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
        localStorage.removeItem('selectedRestaurant');
        setRestaurant(null);
        handleSuccess('Cart cleared');
    };

    const handleProceedToCheckout = () => {
        if (cartItems.length === 0) {
            handleError('Your cart is empty');
            return;
        }
        // Save before navigating
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        if (restaurant) {
            localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
        }
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="cart-page loading-state">
                <div className="loading-spinner">Loading cart...</div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="cart-page empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <button onClick={() => navigate('/home')} className="browse-btn">
                    Browse Restaurants
                </button>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                <h1>My Cart ({cartItems.length} items)</h1>
                <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
            </div>

            <div className="cart-content">
                <div className="cart-items-section">
                    {restaurant && (
                        <div className="restaurant-info">
                            <h3>{restaurant?.Title || restaurant?.name || 'Restaurant'}</h3>
                            <p>{restaurant?.address || 'Address not available'}</p>
                        </div>
                    )}

                    <div className="cart-items-list">
                        {cartItems.map((item) => (
                            <div key={item._id} className="cart-item">
                                <div className="item-image">
                                    <img 
                                        src={item.image || item.ImageURL || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100'} 
                                        alt={item.name}
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100';
                                        }}
                                    />
                                </div>
                                <div className="item-details">
                                    <h4>{item.name}</h4>
                                    <p className="item-price">₹{item.price}</p>
                                </div>
                                <div className="item-quantity">
                                    <button 
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    >
                                        −
                                    </button>
                                    <span className="qty-value">{item.quantity}</span>
                                    <button 
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="item-total">
                                    ₹{item.price * item.quantity}
                                </div>
                                <button 
                                    className="remove-btn"
                                    onClick={() => removeItem(item._id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="order-summary-section">
                    <h3>Order Summary</h3>
                    <div className="summary-details">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{orderSummary.subtotal}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (5%)</span>
                            <span>₹{orderSummary.tax}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Fee</span>
                            <span>₹{orderSummary.deliveryFee}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{orderSummary.total}</span>
                        </div>
                    </div>
                    <button 
                        className="checkout-btn"
                        onClick={handleProceedToCheckout}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;