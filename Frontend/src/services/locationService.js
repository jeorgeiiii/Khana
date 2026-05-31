// Free location services using browser geolocation + OpenStreetMap

// Get user's current location
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
};

// Geocode: Convert address to coordinates
export const geocodeAddress = async (address) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
};

// Reverse geocode
export const reverseGeocode = async (lat, lng) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();
        return data.display_name || `${lat}, ${lng}`;
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return `${lat}, ${lng}`;
    }
};

// Calculate route between two points
export const getRoute = async (start, end) => {
    try {
        const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        
        if (data.code === 'Ok') {
            return {
                distance: data.routes[0].distance / 1000,
                duration: data.routes[0].duration / 60,
                route: data.routes[0].geometry.coordinates.map(coord => ({
                    lat: coord[1],
                    lng: coord[0]
                }))
            };
        }
        return null;
    } catch (error) {
        console.error('Route calculation error:', error);
        return null;
    }
};