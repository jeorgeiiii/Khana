import React, { useState, useEffect } from "react";
import "../App.css";

function Nightlife({ onBarClick, location = "Indore" }) {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNightlifeByLocation();
    }, [location]);

    const fetchNightlifeByLocation = async () => {
        try {
            setLoading(true);
            console.log(`Fetching nightlife for ${location}...`);
            
            const response = await fetch(`http://localhost:5000/api/v1/nightlife/location/${location}`);
            const data = await response.json();
            
            console.log('Nightlife API Response:', data);
            
            if (data.success) {
                setPlaces(data.nightlife || []);
            } else {
                setPlaces([]);
                if (data.message) {
                    setError(data.message);
                }
            }
        } catch (err) {
            console.error('Error fetching nightlife:', err);
            setError('Failed to load nightlife places. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Rating badge color based on rating
    const getRatingColor = (rating) => {
        const numRating = parseFloat(rating);
        if (numRating >= 4.5) return '#4caf50';
        if (numRating >= 4.0) return '#8bc34a';
        if (numRating >= 3.5) return '#ff9800';
        return '#f44336';
    };

    // Get place type icon
    const getTypeIcon = (type) => {
        switch(type) {
            case 'Night Club': return '🎵';
            case 'Bar': return '🍸';
            case 'Pub': return '🍺';
            case 'Lounge': return '🛋️';
            case 'Microbrewery': return '🍻';
            default: return '🍹';
        }
    };

    if (loading) {
        return (
            <div className="nightlife-container loading-state">
                <div className="loading-spinner">Loading nightlife places...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="nightlife-container error-state">
                <p>{error}</p>
                <button onClick={fetchNightlifeByLocation}>Try Again</button>
            </div>
        );
    }

    if (places.length === 0) {
        return (
            <div className="nightlife-container empty-state">
                <h3>No nightlife places found in {location}</h3>
                <p>Try changing your location or check back later.</p>
            </div>
        );
    }

    return (
        <div className="nightlife-container">
            <h2>Nightlife: Night clubs, pubs and bars in {location}</h2>
            <div className="bars-list">
                {places.map((place) => (
                    <div 
                        key={place._id} 
                        className="bar-card" 
                        onClick={() => onBarClick(place)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="bar-img-wrapper">
                            {place.featured && (
                                <span className="featured-label">🔥 Featured</span>
                            )}
                            <img 
                                src={place.imageUrl} 
                                alt={place.name} 
                                className="bar-img"
                                onError={(e) => {
                                    e.target.src = "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=500";
                                }}
                            />
                            <span className="place-type">
                                {getTypeIcon(place.type)} {place.type}
                            </span>
                        </div>
                        <div className="bar-info">
                            <h3>{place.name}</h3>
                            <div className="bar-cuisine">{place.cuisine}</div>
                            <div className="bar-price">{place.price}</div>
                            <div className="bar-timing">
                                🕒 {place.openingTime} - {place.closingTime}
                            </div>
                            {place.happyHours && (
                                <div className="happy-hours">🎉 {place.happyHours}</div>
                            )}
                            <div className="bar-footer">
                                <span 
                                    className="bar-rating"
                                    style={{ backgroundColor: getRatingColor(place.rating) }}
                                >
                                    {place.rating}★
                                </span>
                                <span className="bar-music">{place.music}</span>
                            </div>
                            <div className="bar-address">{place.address}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Nightlife;