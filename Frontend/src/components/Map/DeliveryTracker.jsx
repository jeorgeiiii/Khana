import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const deliveryIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1999/1999625.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const restaurantIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

const customerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

const DeliveryTracker = ({ order, restaurantLocation, customerLocation, driverLocation, orderStatus }) => {
    const [driverPos, setDriverPos] = useState(driverLocation || restaurantLocation);

    useEffect(() => {
        if (driverLocation) {
            setDriverPos(driverLocation);
        }
    }, [driverLocation]);

    if (!restaurantLocation || !customerLocation) {
        return <div className="loading-map">Loading map...</div>;
    }

    return (
        <div className="delivery-tracker">
            {/* Status Bar */}
            <div className="status-bar">
                <div className={`status-step ${orderStatus === 'confirmed' || orderStatus === 'preparing' || orderStatus === 'out_for_delivery' ? 'active' : ''}`}>
                    <span className="step-icon">✅</span>
                    <span>Confirmed</span>
                </div>
                <div className={`status-step ${orderStatus === 'preparing' || orderStatus === 'out_for_delivery' ? 'active' : ''}`}>
                    <span className="step-icon">🍳</span>
                    <span>Preparing</span>
                </div>
                <div className={`status-step ${orderStatus === 'out_for_delivery' ? 'active' : ''}`}>
                    <span className="step-icon">🛵</span>
                    <span>On the Way</span>
                </div>
                <div className={`status-step ${orderStatus === 'delivered' ? 'active' : ''}`}>
                    <span className="step-icon">🏠</span>
                    <span>Delivered</span>
                </div>
            </div>

            {/* Map */}
            <MapContainer
                center={[restaurantLocation.lat, restaurantLocation.lng]}
                zoom={13}
                style={{ height: '400px', width: '100%', borderRadius: '12px' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                {/* Restaurant Marker */}
                <Marker position={[restaurantLocation.lat, restaurantLocation.lng]} icon={restaurantIcon}>
                    <Popup>
                        <strong>{order?.restaurantName || 'Restaurant'}</strong><br />
                        Pickup Point
                    </Popup>
                </Marker>

                {/* Customer Marker */}
                <Marker position={[customerLocation.lat, customerLocation.lng]} icon={customerIcon}>
                    <Popup>
                        <strong>Your Location</strong><br />
                        Delivery Point
                    </Popup>
                </Marker>

                {/* Delivery Boy Marker */}
                {driverPos && orderStatus === 'out_for_delivery' && (
                    <Marker position={[driverPos.lat, driverPos.lng]} icon={deliveryIcon}>
                        <Popup>
                            <strong>Delivery Partner</strong><br />
                            {order?.deliveryBoy?.name || 'Rahul'}<br />
                            📞 {order?.deliveryBoy?.phone || '+91 98765 43210'}
                        </Popup>
                    </Marker>
                )}

                {/* Route Line */}
                <Polyline
                    positions={[
                        [restaurantLocation.lat, restaurantLocation.lng],
                        [customerLocation.lat, customerLocation.lng]
                    ]}
                    color="#ff5722"
                    weight={3}
                    opacity={0.7}
                />
            </MapContainer>

            {/* Info Panel */}
            <div className="delivery-info-panel">
                <div className="info-card">
                    <h3>🛵 Delivery Partner</h3>
                    <p><strong>{order?.deliveryBoy?.name || 'Rahul Sharma'}</strong></p>
                    <p>⭐ 4.8 • 200 deliveries</p>
                    <p>📞 {order?.deliveryBoy?.phone || '+91 98765 43210'}</p>
                </div>
                <div className="info-card">
                    <h3>📍 Order Details</h3>
                    <p>Order #{order?._id?.slice(-8)}</p>
                    <p>Status: <span className="status-badge">{orderStatus || 'Confirmed'}</span></p>
                </div>
            </div>
        </div>
    );
};

export default DeliveryTracker;