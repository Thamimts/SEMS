const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
    
    // Create indexes
    await setupIndexes();
    
    return conn;
  } catch (error) {
    console.error(`[DB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

const setupIndexes = async () => {
  try {
    // Location TTL index - auto-delete after 24 hours
    const Location = require('../models/Location');
    await Location.collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 });
    console.log('[DB] Indexes created successfully');
  } catch (error) {
    console.error('[DB] Index creation error:', error.message);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('[DB] MongoDB disconnected');
  } catch (error) {
    console.error(`[DB] Disconnection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
