const mongoose = require('mongoose');

const trafficSignalSchema = new mongoose.Schema({
  signalId: {
    type: String,
    required: [true, 'Please provide signal ID'],
    unique: true,
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  intersectionName: String,
  status: {
    type: String,
    enum: ['green', 'yellow', 'red'],
    default: 'red',
  },
  isOverridden: {
    type: Boolean,
    default: false,
    index: true,
  },
  overrideReason: {
    type: String,
    enum: ['emergency', 'vip', 'maintenance'],
  },
  overriddenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  emergencyVehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  overrideStartTime: Date,
  overrideDuration: Number, // In seconds
  overrideEndTime: Date,
  greenDuration: {
    type: Number,
    default: 60, // Seconds
  },
  yellowDuration: {
    type: Number,
    default: 5, // Seconds
  },
  redDuration: {
    type: Number,
    default: 60, // Seconds
  },
  vehicleCount: {
    type: Number,
    default: 0,
  },
  congestionLevel: {
    type: String,
    enum: ['low', 'moderate', 'high', 'severe'],
    default: 'low',
  },
  averageWaitTime: Number, // In seconds
  weatherCondition: String,
  isOperational: {
    type: Boolean,
    default: true,
  },
  maintenanceRequired: {
    type: Boolean,
    default: false,
  },
  lastMaintenanceDate: Date,
  nextMaintenanceDate: Date,
  lastStatusUpdate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create geospatial index
trafficSignalSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('TrafficSignal', trafficSignalSchema);
