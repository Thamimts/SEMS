const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  speed: {
    type: Number,
    default: 0,
  },
  heading: {
    type: Number, // Direction in degrees (0-360)
  },
  altitude: {
    type: Number,
  },
  accuracy: {
    type: Number, // GPS accuracy in meters
  },
  provider: {
    type: String,
    enum: ['gps', 'network', 'fused'],
    default: 'gps',
  },
  isEmergency: {
    type: Boolean,
    default: false,
    index: true,
  },
  emergencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emergency',
  },
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // Auto-delete after 24 hours
    index: true,
  },
});

// Create geospatial index for location-based queries
locationSchema.index({ coordinates: '2dsphere' });
locationSchema.index({ vehicleId: 1, createdAt: -1 });

module.exports = mongoose.model('Location', locationSchema);
