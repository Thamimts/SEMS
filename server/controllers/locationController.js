const LocationService = require('../services/locationService');

class LocationController {
  /**
   * Update vehicle location
   */
  static async updateLocation(req, res, next) {
    try {
      const { vehicleId, latitude, longitude, speed, heading, altitude, accuracy, address } = req.body;

      const location = await LocationService.updateLocation(
        req.user.id,
        vehicleId,
        {
          latitude,
          longitude,
          speed,
          heading,
          altitude,
          accuracy,
          address,
        }
      );

      res.status(201).json({
        message: 'Location updated',
        location,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current vehicle location
   */
  static async getCurrentLocation(req, res, next) {
    try {
      const { vehicleId } = req.params;

      const location = await LocationService.getCurrentLocation(vehicleId);

      res.json({
        location,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get location history
   */
  static async getLocationHistory(req, res, next) {
    try {
      const { vehicleId } = req.params;
      const { limit = 100, startDate, endDate } = req.query;

      const history = await LocationService.getLocationHistory(
        vehicleId,
        parseInt(limit),
        startDate ? new Date(startDate) : null,
        endDate ? new Date(endDate) : null
      );

      res.json({
        count: history.length,
        locations: history.map(loc => ({
          latitude: loc.latitude,
          longitude: loc.longitude,
          speed: loc.speed,
          heading: loc.heading,
          altitude: loc.altitude,
          accuracy: loc.accuracy,
          address: loc.address,
          timestamp: loc.createdAt,
        })),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get nearby vehicles
   */
  static async getNearbyVehicles(req, res, next) {
    try {
      const { latitude, longitude, radius = 100 } = req.body;

      const vehicles = await LocationService.getNearbyVehicles(
        latitude,
        longitude,
        parseInt(radius)
      );

      res.json({
        count: vehicles.length,
        vehicles,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get vehicle positions (for map view)
   */
  static async getVehiclePositions(req, res, next) {
    try {
      const { vehicleIds } = req.body;

      const positions = await Promise.all(
        vehicleIds.map(async (vehicleId) => {
          const location = await LocationService.getCurrentLocation(vehicleId);
          return {
            vehicleId,
            location: location
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  timestamp: location.createdAt,
                }
              : null,
          };
        })
      );

      res.json({
        positions,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LocationController;
