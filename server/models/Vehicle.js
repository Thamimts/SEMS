const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: [true, 'Please provide registration number'],
    unique: true,
    uppercase: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vehicleType: {
    type: String,
    enum: ['ambulance', 'fire-truck', 'police', 'private'],
    default: 'ambulance',
  },
  model: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
  },
  color: {
    type: String,
  },
  vin: {
    type: String,
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    timestamp: Date,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'emergency'],
    default: 'inactive',
  },
  capacity: {
    type: Number,
    default: 2, // Number of stretchers/patients
  },
  equipment: [String], // e.g., ['defibrillator', 'oxygen', 'stretcher']
  drivers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isCurrentDriver: Boolean,
  }],
  lastServiceDate: Date,
  nextServiceDate: Date,
  fuelLevel: {
    type: Number,
    min: 0,
    max: 100,
  },
  mileage: Number,
  insuranceExpiry: Date,
  registrationExpiry: Date,
  fcmTokens: [String], // For push notifications
  v2xEnabled: {
    type: Boolean,
    default: true,
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

// Create geospatial index for location-based queries
vehicleSchema.index({ 'currentLocation': '2dsphere' });

module.exports = mongoose.model('Vehicle', vehicleSchema);
