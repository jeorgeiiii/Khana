import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import '../App.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: [],
        newPassword: '',
        confirmPassword: ''
    });
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [profileImageError, setProfileImageError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
        fetchUserOrders();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:5000/api/v1/auth/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (data.success) {
                setUser(data.user);
                setFormData({
                    name: data.user.name || '',
                    email: data.user.email || '',
                    phone: data.user.phone || '',
                    address: data.user.address || [],
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                handleError('Failed to load profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            handleError('Error loading profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/v1/orders/user', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const addNewAddress = () => {
        setFormData({
            ...formData,
            address: [
                ...formData.address,
                { type: 'home', street: '', city: '', state: '', pincode: '', isDefault: false }
            ]
        });
    };

    const removeAddress = (index) => {
        const updatedAddresses = formData.address.filter((_, i) => i !== index);
        setFormData({ ...formData, address: updatedAddresses });
    };

    const setDefaultAddress = (index) => {
        const updatedAddresses = formData.address.map((addr, i) => ({
            ...addr,
            isDefault: i === index
        }));
        setFormData({ ...formData, address: updatedAddresses });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            return handleError('Passwords do not match');
        }

        try {
            const token = localStorage.getItem('token');
            const updateData = {
                name: formData.name,
                phone: formData.phone,
                address: formData.address
            };

            if (formData.newPassword) {
                updateData.password = formData.newPassword;
            }

            const response = await fetch('http://localhost:5000/api/v1/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();
            
            if (data.success) {
                handleSuccess('Profile updated successfully');
                setEditMode(false);
                fetchUserProfile();
            } else {
                handleError(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            handleError('Error updating profile');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('Logged out successfully');
        setTimeout(() => navigate('/login'), 1000);
    };

    const getInitials = () => {
        if (user?.name) return user.name.charAt(0).toUpperCase();
        return 'U';
    };

    if (loading) {
        return (
            <div className="restaurant-detail-compact loading-state">
                <div className="loading-spinner">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="restaurant-detail-compact">
            {/* Back Button */}
            <div className="detail-header-compact">
                <button className="back-btn-compact" onClick={() => navigate('/home')}>← Back to Home</button>
                <h1 className="restaurant-name-compact">My Profile</h1>
            </div>

            {/* Profile Header Card */}
            <div className="restaurant-card" style={{ marginBottom: '20px', textAlign: 'center', padding: '25px' }}>
                <div style={{ 
                    width: '100px', 
                    height: '100px', 
                    margin: '0 auto 15px', 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #ff5722, #ff9800)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    fontWeight: 'bold',
                    color: 'white'
                }}>
                    {!profileImageError ? (
                        <img 
                            src={user?.profile || '/default-avatar.png'} 
                            alt="Profile"
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            onError={() => setProfileImageError(true)}
                        />
                    ) : (
                        <span>{getInitials()}</span>
                    )}
                </div>
                <h2 style={{ margin: '0 0 5px 0', color: '#333' }}>{user?.name}</h2>
                <p style={{ margin: '5px 0', color: '#666' }}>{user?.email}</p>
                <p style={{ margin: '5px 0', color: '#999' }}>{user?.phone || '📱 Add phone number'}</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
                    <button 
                        onClick={() => setEditMode(!editMode)} 
                        className="book-btn-compact"
                        style={{ background: editMode ? '#999' : '#ff5722' }}
                    >
                        {editMode ? '✖️ Cancel' : '✏️ Edit Profile'}
                    </button>
                    <button 
                        onClick={handleLogout} 
                        className="book-btn-compact"
                        style={{ background: '#dc3545' }}
                    >
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="info-row-compact" style={{ justifyContent: 'space-around', marginBottom: '25px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff5722' }}>{orders.length}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Orders</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff5722' }}>{user?.favorites?.length || 0}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Favorites</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff5722' }}>{user?.reviews?.length || 0}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Reviews</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs-compact">
                <span className={`tab-compact ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                    📋 Profile
                </span>
                <span className={`tab-compact ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                    📦 Orders ({orders.length})
                </span>
                <span className={`tab-compact ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
                    📍 Addresses ({formData.address?.length || 0})
                </span>
            </div>

            {/* Tab Content */}
            <div className="offers-section-compact" style={{ marginTop: '20px' }}>
                
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div>
                        {editMode ? (
                            <form onSubmit={handleUpdateProfile}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: '#f5f5f5' }}
                                    />
                                    <small style={{ color: '#999' }}>Email cannot be changed</small>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        placeholder="Leave blank to keep current"
                                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm new password"
                                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
                                    />
                                </div>
                                <button type="submit" className="book-btn-compact" style={{ width: '100%' }}>💾 Save Changes</button>
                            </form>
                        ) : (
                            <div>
                                <div className="info-row-compact" style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                                    <span style={{ width: '100px', fontWeight: '500', color: '#666' }}>Name:</span>
                                    <span style={{ color: '#333' }}>{user?.name || 'Not set'}</span>
                                </div>
                                <div className="info-row-compact" style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                                    <span style={{ width: '100px', fontWeight: '500', color: '#666' }}>Email:</span>
                                    <span style={{ color: '#333' }}>{user?.email}</span>
                                </div>
                                <div className="info-row-compact" style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                                    <span style={{ width: '100px', fontWeight: '500', color: '#666' }}>Phone:</span>
                                    <span style={{ color: '#333' }}>{user?.phone || 'Not added'}</span>
                                </div>
                                <div className="info-row-compact" style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                                    <span style={{ width: '100px', fontWeight: '500', color: '#666' }}>Member Since:</span>
                                    <span style={{ color: '#333' }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'Recently'}</span>
                                </div>
                                <div className="info-row-compact" style={{ padding: '12px 0' }}>
                                    <span style={{ width: '100px', fontWeight: '500', color: '#666' }}>Account Type:</span>
                                    <span style={{ color: '#333' }}>{user?.usertype || 'Client'}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div>
                        {orders.length > 0 ? (
                            orders.map((order, index) => (
                                <div key={index} className="offer-card-compact" style={{ marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{ fontWeight: 'bold', color: '#ff5722' }}>Order #{order._id?.slice(-8) || index + 1}</span>
                                        <span style={{ 
                                            padding: '4px 12px', 
                                            borderRadius: '20px', 
                                            fontSize: '12px', 
                                            background: order.status === 'delivered' || order.status === 'Delivered' ? '#4caf50' : '#ff9800', 
                                            color: 'white' 
                                        }}>
                                            {order.status || 'Delivered'}
                                        </span>
                                    </div>
                                    <p style={{ margin: '5px 0', fontWeight: '500' }}>{order.restaurantName || 'Restaurant'}</p>
                                    <p style={{ margin: '5px 0', color: '#666' }}>{order.items?.length || 0} items • Total: ₹{order.totalAmount || 0}</p>
                                    <p style={{ margin: '5px 0', color: '#999', fontSize: '12px' }}>
                                        📅 {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recently'}
                                    </p>
                                    <button className="book-btn-compact" style={{ marginTop: '10px', padding: '6px 20px', fontSize: '13px' }}>🔄 Reorder</button>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <div style={{ fontSize: '48px', marginBottom: '15px' }}>🛒</div>
                                <h3 style={{ marginBottom: '10px' }}>No orders yet</h3>
                                <p style={{ color: '#666', marginBottom: '20px' }}>Start ordering your favorite food!</p>
                                <button onClick={() => navigate('/home')} className="book-btn-compact">Browse Restaurants</button>
                            </div>
                        )}
                    </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                    <div>
                        <div style={{ display: 'grid', gap: '15px' }}>
                            {formData.address?.length > 0 ? (
                                formData.address.map((addr, index) => (
                                    <div key={index} className="offer-card-compact">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <span style={{ 
                                                padding: '4px 12px', 
                                                borderRadius: '20px', 
                                                fontSize: '12px', 
                                                background: addr.type === 'home' ? '#ff5722' : addr.type === 'work' ? '#2196f3' : '#4caf50',
                                                color: 'white'
                                            }}>
                                                {addr.type === 'home' ? '🏠 Home' : addr.type === 'work' ? '💼 Work' : '📍 Other'}
                                            </span>
                                            {addr.isDefault && <span style={{ background: '#ff5722', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '10px' }}>Default</span>}
                                        </div>
                                        <p style={{ margin: '5px 0', fontWeight: '500' }}>{addr.street || 'Street address not set'}</p>
                                        <p style={{ margin: '5px 0', color: '#666' }}>{addr.city || 'City'}, {addr.state || 'State'} - {addr.pincode || 'Pincode'}</p>
                                        {editMode && (
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                                <button onClick={() => setDefaultAddress(index)} style={{ padding: '5px 12px', background: '#e8f5e9', border: 'none', borderRadius: '20px', cursor: 'pointer', color: '#4caf50' }}>⭐ Make Default</button>
                                                <button onClick={() => removeAddress(index)} style={{ padding: '5px 12px', background: '#ffebee', border: 'none', borderRadius: '20px', cursor: 'pointer', color: '#f44336' }}>🗑️ Remove</button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>📍</div>
                                    <h3 style={{ marginBottom: '10px' }}>No addresses saved</h3>
                                    <p style={{ color: '#666', marginBottom: '20px' }}>Add your delivery addresses for faster checkout</p>
                                </div>
                            )}
                        </div>
                        {editMode && (
                            <button onClick={addNewAddress} className="book-btn-compact" style={{ marginTop: '20px', width: '100%', background: '#ff5722' }}>
                                + Add New Address
                            </button>
                        )}
                        {!editMode && formData.address?.length === 0 && (
                            <button onClick={() => setEditMode(true)} className="book-btn-compact" style={{ marginTop: '20px', width: '100%' }}>
                                + Add Your First Address
                            </button>
                        )}
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Profile;