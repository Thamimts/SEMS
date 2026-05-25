const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const env = require('./config/env');
const { connectDB } = require('./config/database');
const { setupSocketIO } = require('./config/socketio');
const errorHandler = require('./middleware/errorHandler');
const { socketAuthMiddleware } = require('./middleware/auth');

// Controllers and Services
const AuthController = require('./controllers/authController');
const LocationService = require('./services/locationService');
const EmergencyService = require('./services/emergencyService');
const { SOCKET_EVENTS } = require('./utils/constants');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Setup Socket.IO
const { io, namespaces } = setupSocketIO(server);

// Import route handlers
const authRoutes = require('./routes/auth');
const emergencyRoutes = require('./routes/emergency');
const locationRoutes = require('./routes/location');

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date(), uptime: process.uptime() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/location', locationRoutes);

// Socket.IO Location Namespace
namespaces.location.use(socketAuthMiddleware);
namespaces.location.on('connection', (socket) => {
  console.log(`[Location] Connected: ${socket.user.id}`);

  // Handle location updates
  socket.on(SOCKET_EVENTS.LOCATION_UPDATE, async (data) => {
    try {
      const { vehicleId, latitude, longitude, speed, heading, altitude, accuracy, address } = data;

      // Save location to database
      const location = await LocationService.updateLocation(
        socket.user.id,
        vehicleId,
        {
          latitude,
          longitude,
          speed,
          heading,
          altitude,
          accuracy,
          address,
        }
      );

      // Broadcast to nearby vehicles in the same grid
      const gridRoom = LocationService.getGridRoom(latitude, longitude);
      namespaces.location.to(gridRoom).emit(SOCKET_EVENTS.LOCATION_RECEIVE, {
        vehicleId,
        location: {
          latitude,
          longitude,
          speed,
          heading,
          timestamp: location.createdAt,
        },
      });

      // Join grid room for future broadcasts
      socket.join(gridRoom);
    } catch (error) {
      console.error('[Location] Error updating location:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { error: error.message });
    }
  });

  // Handle location history request
  socket.on(SOCKET_EVENTS.LOCATION_HISTORY, async (data) => {
    try {
      const { vehicleId, limit = 100 } = data;
      const history = await LocationService.getLocationHistory(vehicleId, limit);

      socket.emit(SOCKET_EVENTS.LOCATION_HISTORY, {
        vehicleId,
        locations: history.map(loc => ({
          latitude: loc.latitude,
          longitude: loc.longitude,
          speed: loc.speed,
          timestamp: loc.createdAt,
        })),
      });
    } catch (error) {
      console.error('[Location] Error getting history:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Location] Disconnected: ${socket.user.id}`);
  });
});

// Socket.IO Emergency Namespace
namespaces.emergency.use(socketAuthMiddleware);
namespaces.emergency.on('connection', (socket) => {
  console.log(`[Emergency] Connected: ${socket.user.id}`);

  // Handle emergency activation
  socket.on(SOCKET_EVENTS.EMERGENCY_ACTIVATED, async (data) => {
    try {
      const { vehicleId, type, severity, pickupLocation, destinationHospital } = data;

      const emergency = await EmergencyService.activateEmergency(
        vehicleId,
        socket.user.id,
        {
          type,
          severity,
          pickupLocation,
          destinationHospital,
        }
      );

      // Broadcast to nearby vehicles
      const nearbyVehicles = await EmergencyService.getNearbyVehicles(
        emergency.currentLocation.latitude,
        emergency.currentLocation.longitude,
        vehicleId
      );

      namespaces.emergency.emit(SOCKET_EVENTS.EMERGENCY_ACTIVATED, {
        emergencyId: emergency._id,
        vehicleId,
        location: emergency.currentLocation,
        type,
        severity,
        nearbyVehicles: nearbyVehicles.length,
        timestamp: new Date(),
      });

      // Alert nearby vehicles
      if (nearbyVehicles.length > 0) {
        namespaces.notifications.emit(SOCKET_EVENTS.V2X_ALERT, {
          message: 'Emergency vehicle nearby',
          emergencyId: emergency._id,
          vehicleId,
          distance: nearbyVehicles[0].distance,
          location: emergency.currentLocation,
        });
      }

      socket.emit(SOCKET_EVENTS.EMERGENCY_ACTIVATED, {
        emergencyId: emergency._id,
        status: 'success',
      });
    } catch (error) {
      console.error('[Emergency] Error activating emergency:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { error: error.message });
    }
  });

  // Handle emergency deactivation
  socket.on(SOCKET_EVENTS.EMERGENCY_DEACTIVATED, async (data) => {
    try {
      const { emergencyId, status = 'completed' } = data;

      const emergency = await EmergencyService.deactivateEmergency(emergencyId, status);

      namespaces.emergency.emit(SOCKET_EVENTS.EMERGENCY_DEACTIVATED, {
        emergencyId,
        status,
        timestamp: new Date(),
      });

      socket.emit(SOCKET_EVENTS.EMERGENCY_DEACTIVATED, {
        emergencyId,
        status: 'success',
      });
    } catch (error) {
      console.error('[Emergency] Error deactivating emergency:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Emergency] Disconnected: ${socket.user.id}`);
  });
});

// Socket.IO V2X Namespace
namespaces.v2x.use(socketAuthMiddleware);
namespaces.v2x.on('connection', (socket) => {
  console.log(`[V2X] Connected: ${socket.user.id}`);

  // Handle V2X broadcasts
  socket.on(SOCKET_EVENTS.V2X_BROADCAST, async (data) => {
    try {
      const { messageType, payload, radius = 1000 } = data;

      // Broadcast to all vehicles (simplified - in production, use geospatial queries)
      namespaces.v2x.emit(SOCKET_EVENTS.V2X_BROADCAST, {
        messageId: `msg_${Date.now()}`,
        senderType: 'vehicle',
        messageType,
        payload,
        timestamp: new Date(),
      });

      socket.emit(SOCKET_EVENTS.V2X_BROADCAST, {
        status: 'success',
        messageType,
      });
    } catch (error) {
      console.error('[V2X] Error broadcasting:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[V2X] Disconnected: ${socket.user.id}`);
  });
});

// Socket.IO Traffic Namespace
namespaces.traffic.use(socketAuthMiddleware);
namespaces.traffic.on('connection', (socket) => {
  console.log(`[Traffic] Connected: ${socket.user.id}`);

  // Handle traffic signal override
  socket.on(SOCKET_EVENTS.TRAFFIC_SIGNAL_OVERRIDE, async (data) => {
    try {
      const { signalId, duration = 300 } = data;

      namespaces.traffic.emit(SOCKET_EVENTS.TRAFFIC_SIGNAL_OVERRIDE, {
        signalId,
        status: 'green',
        duration,
        timestamp: new Date(),
      });

      socket.emit(SOCKET_EVENTS.TRAFFIC_SIGNAL_OVERRIDE, {
        status: 'success',
        signalId,
      });
    } catch (error) {
      console.error('[Traffic] Error overriding signal:', error);
      socket.emit(SOCKET_EVENTS.ERROR, { error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Traffic] Disconnected: ${socket.user.id}`);
  });
});

// Socket.IO Notifications Namespace
namespaces.notifications.use(socketAuthMiddleware);
namespaces.notifications.on('connection', (socket) => {
  console.log(`[Notifications] Connected: ${socket.user.id}`);

  socket.on(SOCKET_EVENTS.NOTIFICATION_ALERT, (data) => {
    namespaces.notifications.emit(SOCKET_EVENTS.NOTIFICATION_ALERT, data);
  });

  socket.on('disconnect', () => {
    console.log(`[Notifications] Disconnected: ${socket.user.id}`);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start HTTP server
    server.listen(env.PORT, () => {
      console.log(`[Server] Running on http://localhost:${env.PORT}`);
      console.log(`[Server] Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('[Server] Shutting down...');
  server.close(() => {
    console.log('[Server] Stopped');
    process.exit(0);
  });
});

// Start the server
startServer();

module.exports = server;
