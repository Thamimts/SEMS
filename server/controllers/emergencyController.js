const Emergency = require('../models/Emergency');
const EmergencyService = require('../services/emergencyService');

class EmergencyController {
  /**
   * Activate emergency
   */
  static async activateEmergency(req, res, next) {
    try {
      const { vehicleId, type, severity, pickupLocation, destinationHospital } = req.body;

      const emergency = await EmergencyService.activateEmergency(
        vehicleId,
        req.user.id,
        {
          type,
          severity,
          pickupLocation,
          destinationHospital,
        }
      );

      res.status(201).json({
        message: 'Emergency activated',
        emergency,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get active emergency for user's vehicle
   */
  static async getActiveEmergency(req, res, next) {
    try {
      const { vehicleId } = req.params;

      const emergency = await EmergencyService.getActiveEmergency(vehicleId);

      res.json({
        emergency,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate emergency
   */
  static async deactivateEmergency(req, res, next) {
    try {
      const { emergencyId } = req.params;
      const { status = 'completed' } = req.body;

      const emergency = await EmergencyService.deactivateEmergency(emergencyId, status);

      res.json({
        message: 'Emergency deactivated',
        emergency,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get emergency details
   */
  static async getEmergency(req, res, next) {
    try {
      const { emergencyId } = req.params;

      const emergency = await Emergency.findById(emergencyId)
        .populate(['vehicleId', 'userId', 'destinationHospital.hospitalId']);

      if (!emergency) {
        return res.status(404).json({ error: 'Emergency not found' });
      }

      res.json({
        emergency,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get nearby hospitals for emergency location
   */
  static async getNearbyHospitals(req, res, next) {
    try {
      const { latitude, longitude } = req.body;

      const hospitals = await EmergencyService.getNearbyHospitals(latitude, longitude, 5);

      res.json({
        hospitals,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get nearby vehicles for emergency
   */
  static async getNearbyVehicles(req, res, next) {
    try {
      const { emergencyId } = req.params;
      const { latitude, longitude } = req.body;

      const vehicles = await EmergencyService.getNearbyVehicles(
        latitude,
        longitude,
        null,
        1000
      );

      res.json({
        vehicles,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get emergency history
   */
  static async getEmergencyHistory(req, res, next) {
    try {
      const { vehicleId } = req.params;
      const { limit = 20, status } = req.query;

      const query = { vehicleId };
      if (status) query.status = status;

      const emergencies = await Emergency.find(query)
        .sort({ startTime: -1 })
        .limit(parseInt(limit));

      res.json({
        count: emergencies.length,
        emergencies,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Activate green corridor
   */
  static async activateGreenCorridor(req, res, next) {
    try {
      const { emergencyId } = req.params;
      const { trafficSignalIds, durationSeconds = 300 } = req.body;

      const emergency = await EmergencyService.activateGreenCorridor(
        emergencyId,
        trafficSignalIds,
        durationSeconds
      );

      res.json({
        message: 'Green corridor activated',
        emergency,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate green corridor
   */
  static async deactivateGreenCorridor(req, res, next) {
    try {
      const { emergencyId } = req.params;

      const emergency = await EmergencyService.deactivateGreenCorridor(emergencyId);

      res.json({
        message: 'Green corridor deactivated',
        emergency,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update emergency status
   */
  static async updateEmergencyStatus(req, res, next) {
    try {
      const { emergencyId } = req.params;
      const { status } = req.body;

      const emergency = await EmergencyService.updateEmergencyStatus(
        emergencyId,
        status
      );

      res.json({
        message: 'Emergency status updated',
        emergency,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmergencyController;
