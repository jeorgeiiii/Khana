import React, { useState } from 'react';
import { handleError, handleSuccess } from '../../utils';
import './PaymentModal.css';

const PaymentModal = ({ orderDetails, onClose, onSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState('cod'); // Default COD for testing
    const [loading, setLoading] = useState(false);
    const [upiId, setUpiId] = useState('');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });

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

    const handlePayment = async (e) => {
        e.preventDefault(); // Prevent page reload
        e.stopPropagation(); // Stop event bubbling
        
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
                handleError('Please login to continue');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/api/v1/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: orderDetails.totalAmount,
                    receipt: `order_${Date.now()}`
                })
            });

            const data = await response.json();

            if (!data.success) {
                handleError('Failed to create payment order');
                setLoading(false);
                return;
            }

            const options = {
                key: 'rzp_test_SRarJVU7UHLXje', // Use your test key directly
                amount: data.amount,
                currency: data.currency,
                name: 'Zomoro Food Delivery',
                description: `Order for ${orderDetails.restaurantName}`,
                order_id: data.orderId,
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
                                ...orderDetails,
                                paymentMethod
                            }
                        })
                    });

                    const verifyData = await verifyResponse.json();

                    if (verifyData.success) {
                        handleSuccess('Payment successful!');
                        onSuccess(verifyData.orderId);
                    } else {
                        handleError('Payment verification failed');
                    }
                },
                prefill: {
                    name: orderDetails.userName,
                    email: orderDetails.userEmail,
                    contact: orderDetails.userPhone
                },
                theme: {
                    color: '#ff5722'
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Payment error:', error);
            handleError('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCodOrder = async (e) => {
        e.preventDefault(); // Prevent page reload
        e.stopPropagation();
        
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
                body: JSON.stringify(orderDetails)
            });

            const data = await response.json();

            if (data.success) {
                handleSuccess('Order placed successfully!');
                onSuccess(data.orderId);
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
        <div className="payment-modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="payment-modal">
                <div className="payment-modal-header">
                    <h2>Complete Payment</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-item">
                        <span>Subtotal:</span>
                        <span>₹{orderDetails.subtotal}</span>
                    </div>
                    <div className="summary-item">
                        <span>Tax:</span>
                        <span>₹{orderDetails.tax}</span>
                    </div>
                    <div className="summary-item">
                        <span>Delivery Fee:</span>
                        <span>₹{orderDetails.deliveryFee}</span>
                    </div>
                    <div className="summary-item total">
                        <span>Total:</span>
                        <span>₹{orderDetails.totalAmount}</span>
                    </div>
                </div>

                <div className="payment-methods">
                    <h3>Select Payment Method</h3>
                    
                    <div className="payment-options">
                        <label className="payment-option">
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

                        <label className="payment-option">
                            <input
                                type="radio"
                                name="payment"
                                value="upi"
                                checked={paymentMethod === 'upi'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="option-icon">📱</span>
                            <span>UPI (GPay/PhonePe/Paytm)</span>
                        </label>

                        <label className="payment-option">
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

                        <label className="payment-option">
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

                        <label className="payment-option">
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

                    {paymentMethod === 'upi' && (
                        <div className="payment-detail">
                            <input
                                type="text"
                                placeholder="Enter UPI ID (e.g., name@okhdfcbank)"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                            />
                        </div>
                    )}

                    {paymentMethod === 'card' && (
                        <div className="payment-detail card-details">
                            <input
                                type="text"
                                placeholder="Card Number"
                                value={cardDetails.number}
                                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="Card Holder Name"
                                value={cardDetails.name}
                                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                            />
                            <div className="card-row">
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={cardDetails.expiry}
                                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                                />
                                <input
                                    type="text"
                                    placeholder="CVV"
                                    value={cardDetails.cvv}
                                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="payment-modal-footer">
                    <button
                        className="pay-now-btn"
                        onClick={handlePayment}
                        disabled={loading}
                        type="button"
                    >
                        {loading ? 'Processing...' : `Pay ₹${orderDetails.totalAmount}`}
                    </button>
                    <button className="cancel-btn" onClick={onClose} type="button">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;