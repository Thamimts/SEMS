const Location = require('../models/Location');
const Vehicle = require('../models/Vehicle');
const {
  calculateDistance,
  getNearbyVehicles,
  getLocationRoom,
  isValidCoordinates,
} = require('../utils/helpers');

class LocationService {
  /**
   * Create or update location
   */
  static async updateLocation(userId, vehicleId, locationData, isEmergency = false) {
    try {
      const { latitude, longitude, speed, heading, altitude, accuracy, address } = locationData;

      // Validate coordinates
      if (!isValidCoordinates(latitude, longitude)) {
        throw new Error('Invalid coordinates');
      }

      // Create location record
      const location = await Location.create({
        vehicleId,
        userId,
        latitude,
        longitude,
        coordinates: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        speed,
        heading,
        altitude,
        accuracy,
        address,
        isEmergency,
      });

      // Update vehicle's current location
      await Vehicle.findByIdAndUpdate(vehicleId, {
        currentLocation: {
          latitude,
          longitude,
          timestamp: new Date(),
        },
      });

      return location;
    } catch (error) {
      console.error('[LocationService] Error updating location:', error);
      throw error;
    }
  }

  /**
   * Get current vehicle location
   */
  static async getCurrentLocation(vehicleId) {
    try {
      return await Location.findOne({ vehicleId })
        .sort({ createdAt: -1 })
        .limit(1);
    } catch (error) {
      console.error('[LocationService] Error getting current location:', error);
      throw error;
    }
  }

  /**
   * Get location history
   */
  static async getLocationHistory(vehicleId, limit = 100, startDate = null, endDate = null) {
    try {
      const query = { vehicleId };

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = startDate;
        if (endDate) query.createdAt.$lte = endDate;
      }

      return await Location.find(query)
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error('[LocationService] Error getting location history:', error);
      throw error;
    }
  }

  /**
   * Get nearby vehicles
   */
  static async getNearbyVehicles(lat, lon, radiusMeters = 100, excludeVehicleId = null) {
    try {
      const nearbyLocations = await Location.find({
        coordinates: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            $maxDistance: radiusMeters,
          },
        },
        ...(excludeVehicleId && { vehicleId: { $ne: excludeVehicleId } }),
      })
        .populate('vehicleId')
        .limit(50);

      return nearbyLocations.map(loc => ({
        vehicleId: loc.vehicleId._id,
        vehicleNumber: loc.vehicleId.registrationNumber,
        vehicleType: loc.vehicleId.vehicleType,
        distance: calculateDistance(lat, lon, loc.latitude, loc.longitude),
        location: {
          latitude: loc.latitude,
          longitude: loc.longitude,
        },
        speed: loc.speed,
        lastUpdate: loc.createdAt,
      }));
    } catch (error) {
      console.error('[LocationService] Error getting nearby vehicles:', error);
      throw error;
    }
  }

  /**
   * Get vehicles in grid (for broadcast)
   */
  static async getVehiclesInGrid(gridRoom) {
    try {
      // Extract coordinates from grid room name
      // Format: location_grid_LAT_LON
      const parts = gridRoom.split('_');
      const lat = parseFloat(parts[2]);
      const lon = parseFloat(parts[3]);
      const gridSize = 0.01;

      const locations = await Location.find({
        latitude: { $gte: lat, $lt: lat + gridSize },
        longitude: { $gte: lon, $lt: lon + gridSize },
      }).populate('vehicleId');

      return locations.map(loc => ({
        vehicleId: loc.vehicleId._id,
        location: {
          latitude: loc.latitude,
          longitude: loc.longitude,
        },
      }));
    } catch (error) {
      console.error('[LocationService] Error getting vehicles in grid:', error);
      return [];
    }
  }

  /**
   * Get location for grid room
   */
  static getGridRoom(latitude, longitude, gridSize = 0.01) {
    return getLocationRoom(latitude, longitude, gridSize);
  }
}

module.exports = LocationService;
