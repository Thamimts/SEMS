const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['cardiac', 'accident', 'trauma', 'maternity', 'fire', 'other'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'high',
  },
  status: {
    type: String,
    enum: ['active', 'en-route', 'at-location', 'completed', 'cancelled', 'fake-flagged'],
    default: 'active',
    index: true,
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  destinationHospital: {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
    },
    name: String,
    latitude: Number,
    longitude: Number,
    eta: Number, // ETA in seconds
    distance: Number, // Distance in meters
  },
  pickupLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
  },
  patients: [{
    name: String,
    age: Number,
    injuries: String,
    bloodGroup: String,
  }],
  responders: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    arrivalTime: Date,
  }],
  nearbyVehicles: [{
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    distance: Number,
    eta: Number,
  }],
  route: {
    waypoints: [{
      latitude: Number,
      longitude: Number,
      timestamp: Date,
    }],
    totalDistance: Number,
    estimatedDuration: Number,
  },
  greenCorridor: {
    isActive: Boolean,
    affectedSignals: [String],
    activationTime: Date,
    deactivationTime: Date,
  },
  notes: String,
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

emergencySchema.index({ vehicleId: 1, startTime: -1 });
emergencySchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Emergency', emergencySchema);
