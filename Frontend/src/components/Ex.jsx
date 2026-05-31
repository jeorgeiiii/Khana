import React, { useState, useEffect } from "react";
import "../App.css";

function Card({ onRestaurantClick, location = "Indore" }) {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Reliable fallback image (Unsplash food image)
    const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500";

    useEffect(() => {
        fetchRestaurantsByLocation();
    }, [location]);

    const fetchRestaurantsByLocation = async () => {
        try {
            setLoading(true);
            console.log(`Fetching restaurants for ${location}...`);
            
            const response = await fetch(`http://localhost:5000/api/v1/resturant/location/${location}`);
            const data = await response.json();
            
            console.log('API Response:', data);
            
            if (data.success) {
                setRestaurants(data.restaurants);
            } else {
                setRestaurants([]);
                if (data.message) {
                    setError(data.message);
                }
            }
        } catch (err) {
            console.error('Error fetching restaurants:', err);
            setError('Failed to load restaurants. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle image load error
    const handleImageError = (e) => {
        e.target.src = FALLBACK_IMAGE;
    };

    // Loading state
    if (loading) {
        return (
            <div className="food-list loading-state">
                <div className="loading-spinner">Loading restaurants...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="food-list error-state">
                <p>{error}</p>
                <button onClick={fetchRestaurantsByLocation}>Try Again</button>
            </div>
        );
    }

    // No restaurants found
    if (restaurants.length === 0) {
        return (
            <div className="food-list empty-state">
                <h3>No restaurants found in {location}</h3>
                <p>Try changing your location or check back later.</p>
            </div>
        );
    }

    return (
        <div className="food-list">
            <h2 className="location-heading">Restaurants in {location}</h2>
            {restaurants.map((restaurant, idx) => (
                <div 
                    className="food-card" 
                    key={restaurant._id || idx}
                    onClick={() => onRestaurantClick(restaurant)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="food-img-wrapper">
                        {(restaurant.featured || idx === 0) && (
                            <span className="promoted-label">Promoted</span>
                        )}
                        <img 
                            className="food-img" 
                            src={restaurant.ImageURL || restaurant.img || FALLBACK_IMAGE} 
                            alt={restaurant.Title || restaurant.name}
                            onError={handleImageError}
                        />
                        <span className="discount-label">{restaurant.discount || '50% OFF'}</span>
                    </div>
                    <div className="food-details">
                        <div className="food-title-row">
                            <span className="foodname">{restaurant.Title || restaurant.name}</span>
                            <span className="food-rating-badge">
                                {restaurant.Rating || restaurant.rating || '4.0'}★
                            </span>
                        </div>
                        <div className="foodcuisine">{restaurant.cuisine || 'Various Cuisines'}</div>
                        <div className="food-price-row">
                            <span className="foodprice">{restaurant.price || '₹200 for two'}</span>
                            <span className="foodtime">{restaurant.Time || restaurant.deliveryTime || '30 min'}</span>
                        </div>
                        <div className="food-address">
                            {restaurant.address || restaurant.Coords?.address || ''}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Card;