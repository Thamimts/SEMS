const V2XMessage = require('../models/V2XMessage');
const Vehicle = require('../models/Vehicle');
const Location = require('../models/Location');
const { v4: uuidv4 } = require('uuid');

class V2XService {
  /**
   * Create and broadcast V2X message
   */
  static async broadcastMessage(senderVehicleId, userId, messageData) {
    try {
      const { messageType, communicationType, priority, payload, location, radius = 1000 } = messageData;

      const message = new V2XMessage({
        messageId: `v2x_${uuidv4()}`,
        senderType: 'vehicle',
        senderId: userId,
        senderVehicleId,
        messageType,
        communicationType,
        priority,
        payload,
        location,
        range: radius,
        messageStatus: 'sent',
      });

      await message.save();
      return message;
    } catch (error) {
      console.error('[V2XService] Error broadcasting message:', error);
      throw error;
    }
  }

  /**
   * Get nearby connected vehicles for V2X
   */
  static async getNearbyConnectedVehicles(lat, lon, radiusMeters = 200) {
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
      })
        .populate({
          path: 'vehicleId',
          match: { v2xEnabled: true },
        });

      return nearbyLocations
        .filter(loc => loc.vehicleId)
        .map(loc => ({
          vehicleId: loc.vehicleId._id,
          registrationNumber: loc.vehicleId.registrationNumber,
          distance: this.calculateDistance(lat, lon, loc.latitude, loc.longitude),
          location: {
            latitude: loc.latitude,
            longitude: loc.longitude,
          },
          signal: {
            strength: Math.random() * 100, // RSSI simulation
            latency: Math.random() * 50, // ms
          },
        }));
    } catch (error) {
      console.error('[V2XService] Error getting nearby vehicles:', error);
      throw error;
    }
  }

  /**
   * Calculate distance between coordinates
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
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
  }

  /**
   * Send V2X alert (emergency vehicle detection)
   */
  static async sendEmergencyAlert(emergencyVehicleId, emergencyLocation, messageData) {
    try {
      const alert = new V2XMessage({
        messageId: `v2x_alert_${uuidv4()}`,
        senderType: 'vehicle',
        senderVehicleId: emergencyVehicleId,
        messageType: 'emergency',
        communicationType: 'v2v',
        priority: 'critical',
        payload: messageData,
        location: emergencyLocation,
        range: 500, // 500m emergency alert radius
        messageStatus: 'sent',
      });

      await alert.save();
      return alert;
    } catch (error) {
      console.error('[V2XService] Error sending emergency alert:', error);
      throw error;
    }
  }

  /**
   * Record message acknowledgment
   */
  static async acknowledgeMessage(messageId, recipientId) {
    try {
      const message = await V2XMessage.findByIdAndUpdate(
        messageId,
        {
          $push: {
            acknowledgments: {
              recipientId,
              acknowledgedAt: new Date(),
            },
          },
        },
        { new: true }
      );

      return message;
    } catch (error) {
      console.error('[V2XService] Error acknowledging message:', error);
      throw error;
    }
  }

  /**
   * Get V2X message history
   */
  static async getMessageHistory(vehicleId, limit = 100, hours = 24) {
    try {
      const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);

      const messages = await V2XMessage.find({
        $or: [
          { senderVehicleId: vehicleId },
          { 'recipients.recipientId': vehicleId },
        ],
        createdAt: { $gte: startDate },
      })
        .sort({ createdAt: -1 })
        .limit(limit);

      return messages;
    } catch (error) {
      console.error('[V2XService] Error getting message history:', error);
      throw error;
    }
  }

  /**
   * Get V2X statistics
   */
  static async getV2XStatistics(vehicleId, hours = 24) {
    try {
      const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);

      const stats = await V2XMessage.aggregate([
        {
          $match: {
            $or: [
              { senderVehicleId: vehicleId },
              { 'recipients.recipientId': vehicleId },
            ],
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            emergencyAlerts: {
              $sum: { $cond: [{ $eq: ['$messageType', 'emergency'] }, 1, 0] },
            },
            v2vMessages: {
              $sum: { $cond: [{ $eq: ['$communicationType', 'v2v'] }, 1, 0] },
            },
            v2iMessages: {
              $sum: { $cond: [{ $eq: ['$communicationType', 'v2i'] }, 1, 0] },
            },
            deliveredMessages: {
              $sum: { $cond: [{ $eq: ['$messageStatus', 'delivered'] }, 1, 0] },
            },
          },
        },
      ]);

      return stats[0] || {
        totalMessages: 0,
        emergencyAlerts: 0,
        v2vMessages: 0,
        v2iMessages: 0,
        deliveredMessages: 0,
      };
    } catch (error) {
      console.error('[V2XService] Error getting statistics:', error);
      throw error;
    }
  }
}

module.exports = V2XService;
