const mongoose = require('mongoose');

const v2xMessageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  senderType: {
    type: String,
    enum: ['vehicle', 'infrastructure', 'hospital', 'system'],
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderType',
  },
  senderVehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  messageType: {
    type: String,
    enum: ['alert', 'info', 'request', 'status', 'emergency'],
    required: true,
    index: true,
  },
  communicationType: {
    type: String,
    enum: ['v2v', 'v2i', 'v2h', 'v2n'],
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  payload: {
    title: String,
    description: String,
    data: mongoose.Schema.Types.Mixed,
  },
  location: {
    latitude: Number,
    longitude: Number,
    radius: Number, // Broadcast radius in meters
  },
  recipients: [{
    recipientType: {
      type: String,
      enum: ['vehicle', 'infrastructure', 'hospital', 'broadcast'],
    },
    recipientId: mongoose.Schema.Types.ObjectId,
    deliveryStatus: {
      type: String,
      enum: ['pending', 'delivered', 'failed'],
      default: 'pending',
    },
    deliveryTime: Date,
  }],
  range: {
    type: Number, // Communication range in meters
    default: 1000,
  },
  bandwidth: {
    type: Number, // In Mbps
  },
  latency: {
    type: Number, // In milliseconds
  },
  signalStrength: {
    type: Number, // RSSI value
  },
  messageStatus: {
    type: String,
    enum: ['draft', 'sent', 'delivered', 'acknowledged', 'failed'],
    default: 'sent',
    index: true,
  },
  isEncrypted: {
    type: Boolean,
    default: true,
  },
  encryptionMethod: {
    type: String,
    enum: ['RSA', 'AES', 'none'],
  },
  expiryTime: Date,
  rebroadcast: {
    enabled: Boolean,
    maxHops: Number,
    currentHop: Number,
  },
  acknowledgments: [{
    recipientId: mongoose.Schema.Types.ObjectId,
    acknowledgedAt: Date,
  }],
  metadata: {
    protocol: String,
    version: String,
    sourceIP: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    expires: 86400, // Auto-delete after 24 hours
  },
});

// Create indexes
v2xMessageSchema.index({ senderId: 1, createdAt: -1 });
v2xMessageSchema.index({ messageType: 1, messageStatus: 1 });

module.exports = mongoose.model('V2XMessage', v2xMessageSchema);
