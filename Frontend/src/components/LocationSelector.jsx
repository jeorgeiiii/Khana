import React, { useState } from 'react';

function LocationSelector({ onLocationChange, currentLocation }) {
    const [selectedLocation, setSelectedLocation] = useState(currentLocation || 'Indore');
    
    // ALL cities from our database - Madhya Pradesh + Capital Cities
    const locations = [
        // Madhya Pradesh Cities
        'Indore',
        'Bhopal', 
        'Gwalior',
        'Jabalpur',
        'Ujjain',
        'Sagar',
        'Ratlam',
        'Rewa',
        
        // Metropolitan Cities
        'Mumbai',
        'Delhi',
        'Bangalore',
        'Chennai',
        'Kolkata',
        'Pune',
        'Hyderabad',
        'Ahmedabad',
        
        // State Capitals
        'Jaipur',
        'Lucknow',
        'Chandigarh',
        'Patna',
        'Bhubaneswar',
        'Ranchi',
        'Raipur',
        'Gandhinagar',
        'Panaji',
        'Shimla',
        'Srinagar',
        'Dehradun',
        'Gangtok',
        'Itanagar',
        'Dispur',
        'Imphal',
        'Agartala',
        'Aizawl',
        'Kohima',
        'Shillong',
        
        // Other Major Cities
        'Nagpur',
        'Nashik',
        'Aurangabad',
        'Surat',
        'Vadodara',
        'Rajkot',
        'Amritsar',
        'Ludhiana',
        'Agra',
        'Varanasi',
        'Kanpur',
        'Allahabad',
        'Meerut',
        'Jodhpur',
        'Udaipur',
        'Kota',
        'Ajmer',
        'Mysore',
        'Hubli',
        'Mangalore',
        'Belgaum',
        'Vijayawada',
        'Visakhapatnam',
        'Guntur',
        'Thiruvananthapuram',
        'Kochi',
        'Kozhikode',
        'Thrissur',
        'Coimbatore',
        'Madurai',
        'Tiruchirappalli',
        'Salem',
        'Guwahati',
        'Jamshedpur',
        'Dhanbad',
        'Bokaro'
    ].sort(); // Sort alphabetically

    const handleLocationChange = (e) => {
        const newLocation = e.target.value;
        setSelectedLocation(newLocation);
        onLocationChange(newLocation);
    };

    return (
        <div className="location-selector">
            <label htmlFor="location">📍 Delivery Location: </label>
            <select 
                id="location" 
                value={selectedLocation} 
                onChange={handleLocationChange}
                className="location-dropdown"
            >
                {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                ))}
            </select>
        </div>
    );
}

export default LocationSelector;