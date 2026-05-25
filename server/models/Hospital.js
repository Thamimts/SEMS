const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide hospital name'],
  },
  hospitalCode: {
    type: String,
    unique: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
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
  contactNumber: {
    type: String,
    required: true,
  },
  email: String,
  website: String,
  type: {
    type: String,
    enum: ['government', 'private', 'trust'],
    default: 'private',
  },
  beds: {
    total: Number,
    available: Number,
    occupied: Number,
  },
  icu: {
    total: Number,
    available: Number,
    occupied: Number,
  },
  emergencyDepartment: {
    isOpen24x7: {
      type: Boolean,
      default: true,
    },
    capacity: Number,
    currentPatients: Number,
  },
  specialties: [String], // e.g., ['cardiology', 'trauma', 'neurosurgery']
  equipment: [String], // e.g., ['CT-scan', 'MRI', 'Ventilator']
  ambulanceServices: {
    hasAmbulance: {
      type: Boolean,
      default: true,
    },
    count: Number,
    averageResponseTime: Number, // In minutes
  },
  trafficSignalIntegration: {
    hasV2I: {
      type: Boolean,
      default: false,
    },
    signalIds: [String],
  },
  emergencyReadiness: {
    status: {
      type: String,
      enum: ['ready', 'busy', 'limited', 'unavailable'],
      default: 'ready',
    },
    lastUpdated: Date,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  averageRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  verificationStatus: {
    type: String,
    enum: ['verified', 'pending', 'rejected'],
    default: 'pending',
  },
  verificationDate: Date,
  isActive: {
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

// Create geospatial index
hospitalSchema.index({ coordinates: '2dsphere' });
hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);
