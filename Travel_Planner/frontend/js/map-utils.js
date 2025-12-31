// Map Utilities for Destination Selection and Distance Calculation

// Destination coordinates (latitude, longitude) - World Cities
const destinationCoords = {
    // India
    'mumbai': [19.0760, 72.8777],
    'delhi': [28.6139, 77.2090],
    'bangalore': [12.9716, 77.5946],
    'kolkata': [22.5726, 88.3639],
    'chennai': [13.0827, 80.2707],
    'hyderabad': [17.3850, 78.4867],
    'goa': [15.2993, 74.1240],
    'manali': [32.2432, 77.1892],
    'kerala': [10.1632, 76.6413],
    'rajasthan': [26.9124, 75.7873],
    'darjeeling': [27.0360, 88.2627],
    'shimla': [31.1048, 77.1734],
    'pune': [18.5204, 73.8567],
    'jaipur': [26.9124, 75.7873],
    'ahmedabad': [23.0225, 72.5714],
    
    // Asia
    'tokyo': [35.6762, 139.6503],
    'singapore': [1.3521, 103.8198],
    'bangkok': [13.7563, 100.5018],
    'hong kong': [22.3193, 114.1694],
    'seoul': [37.5665, 126.9780],
    'beijing': [39.9042, 116.4074],
    'shanghai': [31.2304, 121.4737],
    'dubai': [25.2048, 55.2708],
    'abu dhabi': [24.4539, 54.3773],
    'kuala lumpur': [3.1390, 101.6869],
    'jakarta': [-6.2088, 106.8456],
    'manila': [14.5995, 120.9842],
    'ho chi minh city': [10.8231, 106.6297],
    'hanoi': [21.0285, 105.8542],
    'taipei': [25.0330, 121.5654],
    'osaka': [34.6937, 135.5023],
    'kyoto': [35.0116, 135.7681],
    'istanbul': [41.0082, 28.9784],
    'tel aviv': [32.0853, 34.7818],
    'jerusalem': [31.7683, 35.2137],
    'riyadh': [24.7136, 46.6753],
    'doha': [25.2854, 51.5310],
    'kathmandu': [27.7172, 85.3240],
    'colombo': [6.9271, 79.8612],
    'dhaka': [23.8103, 90.4125],
    
    // Europe
    'london': [51.5074, -0.1278],
    'paris': [48.8566, 2.3522],
    'rome': [41.9028, 12.4964],
    'barcelona': [41.3851, 2.1734],
    'madrid': [40.4168, -3.7038],
    'amsterdam': [52.3676, 4.9041],
    'berlin': [52.5200, 13.4050],
    'munich': [48.1351, 11.5820],
    'vienna': [48.2082, 16.3738],
    'prague': [50.0755, 14.4378],
    'budapest': [47.4979, 19.0402],
    'warsaw': [52.2297, 21.0122],
    'stockholm': [59.3293, 18.0686],
    'copenhagen': [55.6761, 12.5683],
    'oslo': [59.9139, 10.7522],
    'helsinki': [60.1699, 24.9384],
    'dublin': [53.3498, -6.2603],
    'edinburgh': [55.9533, -3.1883],
    'brussels': [50.8503, 4.3517],
    'zurich': [47.3769, 8.5417],
    'geneva': [46.2044, 6.1432],
    'milan': [45.4642, 9.1900],
    'venice': [45.4408, 12.3155],
    'florence': [43.7696, 11.2558],
    'athens': [37.9838, 23.7275],
    'lisbon': [38.7223, -9.1393],
    'porto': [41.1579, -8.6291],
    'moscow': [55.7558, 37.6173],
    'saint petersburg': [59.9343, 30.3351],
    
    // North America
    'new york': [40.7128, -74.0060],
    'los angeles': [34.0522, -118.2437],
    'chicago': [41.8781, -87.6298],
    'san francisco': [37.7749, -122.4194],
    'miami': [25.7617, -80.1918],
    'las vegas': [36.1699, -115.1398],
    'boston': [42.3601, -71.0589],
    'washington dc': [38.9072, -77.0369],
    'seattle': [47.6062, -122.3321],
    'toronto': [43.6532, -79.3832],
    'vancouver': [49.2827, -123.1207],
    'montreal': [45.5017, -73.5673],
    'mexico city': [19.4326, -99.1332],
    'cancun': [21.1619, -86.8515],
    
    // South America
    'rio de janeiro': [-22.9068, -43.1729],
    'sao paulo': [-23.5505, -46.6333],
    'buenos aires': [-34.6037, -58.3816],
    'lima': [-12.0464, -77.0428],
    'bogota': [4.7110, -74.0721],
    'santiago': [-33.4489, -70.6693],
    
    // Africa
    'cairo': [30.0444, 31.2357],
    'cape town': [-33.9249, 18.4241],
    'johannesburg': [-26.2041, 28.0473],
    'marrakech': [31.6295, -7.9811],
    'casablanca': [33.5731, -7.5898],
    'nairobi': [-1.2921, 36.8219],
    'lagos': [6.5244, 3.3792],
    
    // Oceania
    'sydney': [-33.8688, 151.2093],
    'melbourne': [-37.8136, 144.9631],
    'brisbane': [-27.4698, 153.0251],
    'perth': [-31.9505, 115.8605],
    'auckland': [-36.8485, 174.7633],
    'wellington': [-41.2865, 174.7762],
    'bali': [-8.3405, 115.0920],
    
    // Middle East (Additional)
    'jeddah': [21.4858, 39.1925],
    'kuwait city': [29.3759, 47.9774],
    'beirut': [33.8938, 35.5018],
    'amman': [31.9539, 35.9106],
    
    // Additional Popular Destinations
    'phuket': [7.8804, 98.3923],
    'bali': [-8.3405, 115.0920],
    'maldives': [3.2028, 73.2207],
    'mauritius': [-20.3484, 57.5522],
    'seychelles': [-4.6796, 55.4920]
};

let mapInstance = null;
let markers = [];
let routeLine = null;

// Initialize Map
function initDestinationMap(containerId, center = [20.5937, 78.9629], zoom = 5) {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        return null;
    }

    const mapContainer = document.getElementById(containerId);
    if (!mapContainer) {
        console.error(`Map container ${containerId} not found`);
        return null;
    }

    // Initialize map
    mapInstance = L.map(containerId).setView(center, zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(mapInstance);

    return mapInstance;
}

// Add Destination Marker
function addDestinationMarker(destinationName, position, isSelected = false) {
    if (!mapInstance) return null;

    const iconColor = isSelected ? 'red' : 'blue';
    const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    const marker = L.marker(position, { icon: icon })
        .addTo(mapInstance)
        .bindPopup(`<strong>${destinationName}</strong>`);

    markers.push({ marker, name: destinationName, position });
    return marker;
}

// Calculate Distance Between Two Points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

// Show Distance Between Destinations
function showDistanceBetween(fromDest, toDest) {
    const fromCoords = destinationCoords[fromDest.toLowerCase()];
    const toCoords = destinationCoords[toDest.toLowerCase()];

    if (!fromCoords || !toCoords) {
        console.error('Destination coordinates not found');
        return null;
    }

    const distance = calculateDistance(fromCoords[0], fromCoords[1], toCoords[0], toCoords[1]);
    
    // Draw route line on map and add markers
    if (mapInstance) {
        // Clear existing markers and route
        clearMapMarkers();
        
        // Add markers for both cities
        addDestinationMarker(fromDest, fromCoords, false);
        addDestinationMarker(toDest, toCoords, true);
        
        // Draw route line between cities
        routeLine = L.polyline([fromCoords, toCoords], {
            color: '#1e88e5',
            weight: 3,
            opacity: 0.7
        }).addTo(mapInstance);

        // Fit map to show both destinations
        const bounds = L.latLngBounds([fromCoords, toCoords]);
        mapInstance.fitBounds(bounds, { padding: [50, 50] });
    }

    return distance;
}

// Clear Map Markers
function clearMapMarkers() {
    markers.forEach(({ marker }) => {
        mapInstance.removeLayer(marker);
    });
    markers = [];
    
    if (routeLine) {
        mapInstance.removeLayer(routeLine);
        routeLine = null;
    }
}

// Update Map for Destination Selection
function updateMapForDestination(destinationName) {
    if (!mapInstance) return;

    const coords = destinationCoords[destinationName.toLowerCase()];
    if (!coords) {
        console.error(`Coordinates not found for ${destinationName}`);
        return;
    }

    // Clear existing markers
    clearMapMarkers();

    // Add marker for selected destination
    addDestinationMarker(destinationName, coords, true);

    // Center map on destination
    mapInstance.setView(coords, 8);

    // Add city name label
    L.marker(coords)
        .addTo(mapInstance)
        .bindPopup(`<strong>${destinationName.charAt(0).toUpperCase() + destinationName.slice(1)}</strong>`)
        .openPopup();
}

// Show Multiple Destinations on Map
function showMultipleDestinations(destinations) {
    if (!mapInstance) return;

    clearMapMarkers();

    const bounds = [];
    destinations.forEach((dest, index) => {
        const coords = destinationCoords[dest.toLowerCase()];
        if (coords) {
            addDestinationMarker(dest, coords, index === 0);
            bounds.push(coords);
        }
    });

    if (bounds.length > 0) {
        mapInstance.fitBounds(bounds, { padding: [50, 50] });
    }
}

// Get Destination Coordinates
function getDestinationCoords(destinationName) {
    return destinationCoords[destinationName.toLowerCase()] || null;
}

// Format Distance Display
function formatDistance(distance) {
    if (distance < 1) {
        return `${Math.round(distance * 1000)} meters`;
    } else if (distance < 100) {
        return `${distance.toFixed(1)} km`;
    } else {
        return `${Math.round(distance)} km`;
    }
}

