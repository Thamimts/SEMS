require('dotenv').config();

module.exports = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/sems',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d',
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Location
  LOCATION_UPDATE_INTERVAL: parseInt(process.env.LOCATION_UPDATE_INTERVAL || '2000'),
  NEARBY_VEHICLE_RADIUS: parseInt(process.env.NEARBY_VEHICLE_RADIUS || '20'),
  
  // Emergency
  EMERGENCY_EXPIRY_HOURS: parseInt(process.env.EMERGENCY_EXPIRY_HOURS || '24'),
  GREEN_CORRIDOR_DURATION: parseInt(process.env.GREEN_CORRIDOR_DURATION || '300'),
  
  // Features
  ENABLE_V2X: process.env.ENABLE_V2X !== 'false',
  ENABLE_TRAFFIC_OVERRIDE: process.env.ENABLE_TRAFFIC_OVERRIDE !== 'false',
  ENABLE_LOCATION_HISTORY: process.env.ENABLE_LOCATION_HISTORY !== 'false',
};
