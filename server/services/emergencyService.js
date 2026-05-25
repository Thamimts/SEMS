const Emergency = require('../models/Emergency');
const Location = require('../models/Location');
const Hospital = require('../models/Hospital');
const Vehicle = require('../models/Vehicle');
const { calculateDistance, calculateETA, generateEmergencyId } = require('../utils/helpers');
const { EMERGENCY_STATUS } = require('../utils/constants');

class EmergencyService {
  /**
   * Activate emergency
   */
  static async activateEmergency(vehicleId, userId, emergencyData) {
    try {
      const { type, severity, pickupLocation, destinationHospital } = emergencyData;

      // Get current location
      const currentLocation = await Location.findOne({ vehicleId })
        .sort({ createdAt: -1 });

      // Create emergency record
      const emergency = new Emergency({
        vehicleId,
        userId,
        type,
        severity,
        status: EMERGENCY_STATUS.ACTIVE,
        currentLocation: currentLocation
          ? {
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              address: currentLocation.address,
            }
          : pickupLocation,
        pickupLocation,
        destinationHospital: destinationHospital || null,
      });

      await emergency.save();

      // Update vehicle status
      await Vehicle.findByIdAndUpdate(vehicleId, {
        status: 'emergency',
      });

      // Find nearby hospitals if not specified
      if (!destinationHospital) {
        const nearby = await this.getNearbyHospitals(
          emergency.currentLocation.latitude,
          emergency.currentLocation.longitude,
          5
        );
        emergency.destinationHospital = nearby[0] || null;
        await emergency.save();
      }

      // Find nearby vehicles
      const nearbyVehicles = await this.getNearbyVehicles(
        emergency.currentLocation.latitude,
        emergency.currentLocation.longitude,
        emergency.vehicleId
      );
      emergency.nearbyVehicles = nearbyVehicles;
      await emergency.save();

      return emergency;
    } catch (error) {
      console.error('[EmergencyService] Error activating emergency:', error);
      throw error;
    }
  }

  /**
   * Deactivate emergency
   */
  static async deactivateEmergency(emergencyId, status = EMERGENCY_STATUS.COMPLETED) {
    try {
      const emergency = await Emergency.findByIdAndUpdate(
        emergencyId,
        {
          status,
          endTime: new Date(),
        },
        { new: true }
      );

      // Update vehicle status
      if (emergency) {
        await Vehicle.findByIdAndUpdate(emergency.vehicleId, {
          status: 'active',
        });
      }

      return emergency;
    } catch (error) {
      console.error('[EmergencyService] Error deactivating emergency:', error);
      throw error;
    }
  }

  /**
   * Get active emergency for vehicle
   */
  static async getActiveEmergency(vehicleId) {
    try {
      return await Emergency.findOne({
        vehicleId,
        status: { $in: [EMERGENCY_STATUS.ACTIVE, EMERGENCY_STATUS.EN_ROUTE, EMERGENCY_STATUS.AT_LOCATION] },
      }).populate(['vehicleId', 'userId', 'destinationHospital.hospitalId']);
    } catch (error) {
      console.error('[EmergencyService] Error getting active emergency:', error);
      throw error;
    }
  }

  /**
   * Get nearby hospitals
   */
  static async getNearbyHospitals(lat, lon, limit = 5) {
    try {
      const hospitals = await Hospital.find({
        coordinates: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            $maxDistance: 50000, // 50 km
          },
        },
        isActive: true,
      })
        .limit(limit);

      return hospitals.map(h => ({
        hospitalId: h._id,
        name: h.name,
        latitude: h.location.latitude,
        longitude: h.location.longitude,
        distance: calculateDistance(lat, lon, h.location.latitude, h.location.longitude),
        eta: calculateETA(calculateDistance(lat, lon, h.location.latitude, h.location.longitude)),
        beds: h.beds,
        icu: h.icu,
        specialties: h.specialties,
        contactNumber: h.contactNumber,
      }));
    } catch (error) {
      console.error('[EmergencyService] Error getting nearby hospitals:', error);
      throw error;
    }
  }

  /**
   * Get nearby vehicles
   */
  static async getNearbyVehicles(lat, lon, excludeVehicleId = null, radiusMeters = 1000) {
    try {
      const locations = await Location.find({
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
        .limit(10);

      return locations.map(loc => ({
        vehicleId: loc.vehicleId._id,
        registrationNumber: loc.vehicleId.registrationNumber,
        vehicleType: loc.vehicleId.vehicleType,
        distance: calculateDistance(lat, lon, loc.latitude, loc.longitude),
        eta: calculateETA(
          calculateDistance(lat, lon, loc.latitude, loc.longitude)
        ),
        location: {
          latitude: loc.latitude,
          longitude: loc.longitude,
        },
      }));
    } catch (error) {
      console.error('[EmergencyService] Error getting nearby vehicles:', error);
      return [];
    }
  }

  /**
   * Update emergency status
   */
  static async updateEmergencyStatus(emergencyId, status, updateData = {}) {
    try {
      const emergency = await Emergency.findByIdAndUpdate(
        emergencyId,
        {
          status,
          ...updateData,
          updatedAt: new Date(),
        },
        { new: true }
      );

      return emergency;
    } catch (error) {
      console.error('[EmergencyService] Error updating emergency status:', error);
      throw error;
    }
  }

  /**
   * Activate green corridor
   */
  static async activateGreenCorridor(emergencyId, trafficSignalIds, durationSeconds) {
    try {
      const emergency = await Emergency.findByIdAndUpdate(
        emergencyId,
        {
          greenCorridor: {
            isActive: true,
            affectedSignals: trafficSignalIds,
            activationTime: new Date(),
            deactivationTime: new Date(Date.now() + durationSeconds * 1000),
          },
        },
        { new: true }
      );

      return emergency;
    } catch (error) {
      console.error('[EmergencyService] Error activating green corridor:', error);
      throw error;
    }
  }

  /**
   * Deactivate green corridor
   */
  static async deactivateGreenCorridor(emergencyId) {
    try {
      const emergency = await Emergency.findByIdAndUpdate(
        emergencyId,
        {
          'greenCorridor.isActive': false,
          'greenCorridor.deactivationTime': new Date(),
        },
        { new: true }
      );

      return emergency;
    } catch (error) {
      console.error('[EmergencyService] Error deactivating green corridor:', error);
      throw error;
    }
  }
}

module.exports = EmergencyService;
