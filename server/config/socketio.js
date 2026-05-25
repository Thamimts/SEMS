const socketIO = require('socket.io');
const env = require('./env');

const setupSocketIO = (server) => {
  const io = new socketIO.Server(server, {
    cors: {
      origin: env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: env.SOCKETIO_RECONNECT_DELAY,
    reconnectionDelayMax: env.SOCKETIO_RECONNECT_DELAY_MAX,
    maxHttpBufferSize: 10e6, // 10MB for large location arrays
  });

  // Middleware for all connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    // Actual JWT verification happens in each namespace
    socket.token = token;
    next();
  });

  // Create namespaces
  const namespaces = {
    location: io.of('/location'),
    emergency: io.of('/emergency'),
    v2x: io.of('/v2x'),
    traffic: io.of('/traffic'),
    notifications: io.of('/notifications'),
  };

  // Log namespace connections
  Object.entries(namespaces).forEach(([name, ns]) => {
    ns.on('connection', (socket) => {
      console.log(`[${name}] Client connected: ${socket.id}`);
      socket.on('disconnect', () => {
        console.log(`[${name}] Client disconnected: ${socket.id}`);
      });
    });
  });

  return { io, namespaces };
};

module.exports = { setupSocketIO };
