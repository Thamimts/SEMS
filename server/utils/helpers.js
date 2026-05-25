const { NEARBY_VEHICLE_RADIUS } = require('../config/env');

/**
 * Calculate distance between two coordinates using Haversine formula
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Get nearby vehicles within radius
 */
const getNearbyVehicles = async (Vehicle, Location, centerLat, centerLon, radiusMeters = NEARBY_VEHICLE_RADIUS) => {
  try {
    // Find locations within the radius
    const nearbyLocations = await Location.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [centerLon, centerLat],
          },
          $maxDistance: radiusMeters,
        },
      },
    }).populate('vehicleId');

    return nearbyLocations.map(loc => ({
      vehicleId: loc.vehicleId._id,
      vehicleNumber: loc.vehicleId.registrationNumber,
      distance: calculateDistance(centerLat, centerLon, loc.latitude, loc.longitude),
      location: {
        latitude: loc.latitude,
        longitude: loc.longitude,
      },
      lastUpdate: loc.createdAt,
    }));
  } catch (error) {
    console.error('[HELPER] Error getting nearby vehicles:', error);
    return [];
  }
};

/**
 * Calculate ETA between two coordinates
 * Simplified: uses distance / average speed (50 km/h = 13.89 m/s)
 */
const calculateETA = (distance) => {
  const averageSpeed = 13.89; // m/s (50 km/h)
  return Math.round(distance / averageSpeed); // Returns ETA in seconds
};

/**
 * Format error response
 */
const formatErrorResponse = (error) => {
  return {
    error: error.message || 'An error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };
};

/**
 * Generate OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Check if OTP is valid (not expired)
 */
const isOTPValid = (otpExpiry) => {
  return otpExpiry && new Date(otpExpiry) > new Date();
};

/**
 * Generate unique emergency ID
 */
const generateEmergencyId = () => {
  return `EMG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

/**
 * Generate vehicle broadcast room name
 */
const getVehicleBroadcastRoom = (vehicleId) => {
  return `vehicle_${vehicleId}`;
};

/**
 * Generate emergency room name
 */
const getEmergencyRoom = (emergencyId) => {
  return `emergency_${emergencyId}`;
};

/**
 * Generate location broadcast room
 */
const getLocationRoom = (lat, lon, gridSize = 0.01) => {
  const gridLat = Math.floor(lat / gridSize) * gridSize;
  const gridLon = Math.floor(lon / gridSize) * gridSize;
  return `location_grid_${gridLat.toFixed(2)}_${gridLon.toFixed(2)}`;
};

/**
 * Validate coordinates
 */
const isValidCoordinates = (latitude, longitude) => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

/**
 * Get route URL for navigation
 */
const getRouteUrl = (fromLat, fromLon, toLat, toLon, provider = 'google') => {
  if (provider === 'google') {
    return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLon}&destination=${toLat},${toLon}&travelmode=driving`;
  }
  return null;
};

module.exports = {
  calculateDistance,
  getNearbyVehicles,
  calculateETA,
  formatErrorResponse,
  generateOTP,
  isOTPValid,
  generateEmergencyId,
  getVehicleBroadcastRoom,
  getEmergencyRoom,
  getLocationRoom,
  isValidCoordinates,
  getRouteUrl,
};
