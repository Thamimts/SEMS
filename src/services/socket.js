import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '';

let socket = null;

export const initSocket = (token) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL || undefined, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('[SEMS Socket] Connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[SEMS Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('[SEMS Socket] Connection error:', err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const emitLocationUpdate = (location) => {
  const s = getSocket();
  if (s?.connected) {
    s.emit(SOCKET_EVENTS.LOCATION_UPDATE, location);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const SOCKET_EVENTS = {
  EMERGENCY_ACTIVATED: 'emergency:activated',
  EMERGENCY_UPDATE: 'emergency:update',
  EMERGENCY_DEACTIVATED: 'emergency:deactivated',
  V2X_ALERT: 'v2x:alert',
  V2X_BROADCAST: 'v2x:broadcast',
  TRAFFIC_UPDATE: 'traffic:update',
  LOCATION_UPDATE: 'location:update',
  NEARBY_VEHICLE_ALERT: 'vehicle:nearby-alert',
  HOSPITAL_ARRIVAL: 'hospital:arrival',
  GREEN_CORRIDOR: 'traffic:green-corridor',
  CONNECTED_VEHICLES: 'v2x:connected-count',
};

// Emergency Socket Event Handler
export const emergencySocket = {
  onEmergencyActivated: (callback) => getSocket()?.on(SOCKET_EVENTS.EMERGENCY_ACTIVATED, callback),
  onEmergencyUpdate: (callback) => getSocket()?.on(SOCKET_EVENTS.EMERGENCY_UPDATE, callback),
  onEmergencyDeactivated: (callback) => getSocket()?.on(SOCKET_EVENTS.EMERGENCY_DEACTIVATED, callback),
  onV2XAlert: (callback) => getSocket()?.on(SOCKET_EVENTS.V2X_ALERT, callback),
  onV2XBroadcast: (callback) => getSocket()?.on(SOCKET_EVENTS.V2X_BROADCAST, callback),
  onTrafficUpdate: (callback) => getSocket()?.on(SOCKET_EVENTS.TRAFFIC_UPDATE, callback),
  onLocationUpdate: (callback) => getSocket()?.on(SOCKET_EVENTS.LOCATION_UPDATE, callback),
  onNearbyVehicleAlert: (callback) => getSocket()?.on(SOCKET_EVENTS.NEARBY_VEHICLE_ALERT, callback),
  onGreenCorridor: (callback) => getSocket()?.on(SOCKET_EVENTS.GREEN_CORRIDOR, callback),
  onConnectedVehicles: (callback) => getSocket()?.on(SOCKET_EVENTS.CONNECTED_VEHICLES, callback),
  
  offEmergencyActivated: () => getSocket()?.off(SOCKET_EVENTS.EMERGENCY_ACTIVATED),
  offEmergencyUpdate: () => getSocket()?.off(SOCKET_EVENTS.EMERGENCY_UPDATE),
  offEmergencyDeactivated: () => getSocket()?.off(SOCKET_EVENTS.EMERGENCY_DEACTIVATED),
  offV2XAlert: () => getSocket()?.off(SOCKET_EVENTS.V2X_ALERT),
  offTrafficUpdate: () => getSocket()?.off(SOCKET_EVENTS.TRAFFIC_UPDATE),
};

// Admin Socket Event Handler
export const adminSocket = {
  onEmergencyUpdated: (callback) => getSocket()?.on('admin:emergency_updated', callback),
  onNewEmergency: (callback) => getSocket()?.on('admin:new_emergency', callback),
  onEmergencyCompleted: (callback) => getSocket()?.on('admin:emergency_completed', callback),
  offEmergencyUpdated: () => getSocket()?.off('admin:emergency_updated'),
  offNewEmergency: () => getSocket()?.off('admin:new_emergency'),
  offEmergencyCompleted: () => getSocket()?.off('admin:emergency_completed'),
};

export default { initSocket, getSocket, disconnectSocket, SOCKET_EVENTS, emergencySocket, adminSocket };
