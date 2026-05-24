/**
 * Route Service - OpenRouteService Integration
 * Handles route calculation, distance, and travel time estimation
 */

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;
const ORS_API_URL = import.meta.env.VITE_ORS_API_URL || 'https://api.openrouteservice.org';

/**
 * Calculate route between two coordinates
 * @param {number} startLat - Starting latitude
 * @param {number} startLng - Starting longitude
 * @param {number} endLat - Ending latitude
 * @param {number} endLng - Ending longitude
 * @returns {Promise<Object>} Route data with coordinates, distance, and duration
 */
export const calculateRoute = async (startLat, startLng, endLat, endLng) => {
  if (!ORS_API_KEY) {
    console.warn('OpenRouteService API key not configured. Using direct line calculation.');
    return getDirectLineRoute(startLat, startLng, endLat, endLng);
  }

  try {
    const response = await fetch(
      `${ORS_API_URL}/v2/directions/driving-car?api_key=${ORS_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: [
            [startLng, startLat],
            [endLng, endLat],
          ],
          radiuses: [20],
        }),
      }
    );

    if (!response.ok) {
      console.warn('OpenRouteService API error, using direct line calculation.');
      return getDirectLineRoute(startLat, startLng, endLat, endLng);
    }

    const data = await response.json();
    const route = data.routes[0];
    const geometry = route.geometry.coordinates;

    // Convert geometry coordinates [lng, lat] to [lat, lng]
    const coordinates = geometry.map(([lng, lat]) => [lat, lng]);

    // Extract distance (in meters) and convert to kilometers
    const distance = route.distance / 1000;
    
    // Extract duration (in seconds) and convert to minutes
    const duration = Math.round(route.duration / 60);

    return {
      success: true,
      coordinates,
      distance: Math.round(distance * 10) / 10, // Round to 1 decimal
      duration,
      message: `${distance.toFixed(1)} km, ${duration} min`,
    };
  } catch (error) {
    console.error('Route calculation error:', error);
    // Fallback to direct line
    return getDirectLineRoute(startLat, startLng, endLat, endLng);
  }
};

/**
 * Fallback: Calculate direct line route when API is unavailable
 * Also estimates distance and time based on coordinates
 */
function getDirectLineRoute(startLat, startLng, endLat, endLng) {
  const coordinates = [[startLat, startLng], [endLat, endLng]];

  // Calculate approximate distance using Haversine formula
  const distance = calculateDistance(startLat, startLng, endLat, endLng);
  
  // Estimate travel time (assuming ~40 km/h average speed in city)
  const duration = Math.round((distance / 40) * 60);

  return {
    success: false,
    fallback: true,
    coordinates,
    distance: Math.round(distance * 10) / 10,
    duration,
    message: `Direct line: ${distance.toFixed(1)} km, ~${duration} min`,
  };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Get multiple waypoints route
 * @param {Array} coordinates - Array of [lat, lng] coordinates
 * @returns {Promise<Object>} Route data
 */
export const calculateMultiPointRoute = async (coordinates) => {
  if (!ORS_API_KEY || coordinates.length < 2) {
    return null;
  }

  try {
    const response = await fetch(
      `${ORS_API_URL}/v2/directions/driving-car?api_key=${ORS_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: coordinates.map(([lat, lng]) => [lng, lat]),
          radiuses: Array(coordinates.length).fill(20),
        }),
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const route = data.routes[0];
    const geometry = route.geometry.coordinates;

    return {
      coordinates: geometry.map(([lng, lat]) => [lat, lng]),
      distance: Math.round((route.distance / 1000) * 10) / 10,
      duration: Math.round(route.duration / 60),
    };
  } catch (error) {
    console.error('Multi-point route error:', error);
    return null;
  }
};

/**
 * Reverse geocode coordinates to address using Nominatim
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Address string
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: { 'Accept-Language': 'en' },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.display_name || null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};
