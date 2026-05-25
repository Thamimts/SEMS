// Socket Event Names
const SOCKET_EVENTS = {
  // Location events
  LOCATION_UPDATE: 'location:update',
  LOCATION_RECEIVE: 'location:receive',
  LOCATION_HISTORY: 'location:history',

  // Emergency events
  EMERGENCY_ACTIVATED: 'emergency:activated',
  EMERGENCY_UPDATE: 'emergency:update',
  EMERGENCY_DEACTIVATED: 'emergency:deactivated',
  EMERGENCY_STATUS: 'emergency:status',

  // V2X events
  V2X_BROADCAST: 'v2x:broadcast',
  V2X_ALERT: 'v2x:alert',
  V2X_NEARBY_VEHICLES: 'v2x:nearby-vehicles',
  V2X_CONNECTION_STATUS: 'v2x:connection-status',
  V2X_ACKNOWLEDGE: 'v2x:acknowledge',

  // Traffic events
  TRAFFIC_SIGNAL_OVERRIDE: 'traffic:signal-override',
  TRAFFIC_ROUTE_UPDATE: 'traffic:route-update',
  TRAFFIC_PREDICTION: 'traffic:prediction',
  GREEN_CORRIDOR_ACTIVATED: 'green_corridor:activated',
  GREEN_CORRIDOR_DEACTIVATED: 'green_corridor:deactivated',

  // Hospital events
  HOSPITAL_VERIFICATION: 'hospital:verification',
  HOSPITAL_CONFIRMATION: 'hospital:confirmation',
  HOSPITAL_UPDATE: 'hospital:update',

  // Notification events
  NOTIFICATION_ALERT: 'notification:alert',
  NOTIFICATION_BROADCAST: 'notification:broadcast',
  NOTIFICATION_ACKNOWLEDGE: 'notification:acknowledge',

  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
};

// User Roles
const USER_ROLES = {
  DRIVER: 'driver',
  HOSPITAL: 'hospital',
  ADMIN: 'admin',
};

// Emergency Types
const EMERGENCY_TYPES = {
  CARDIAC: 'cardiac',
  ACCIDENT: 'accident',
  TRAUMA: 'trauma',
  MATERNITY: 'maternity',
  FIRE: 'fire',
  OTHER: 'other',
};

// Emergency Severity
const EMERGENCY_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Emergency Status
const EMERGENCY_STATUS = {
  ACTIVE: 'active',
  EN_ROUTE: 'en-route',
  AT_LOCATION: 'at-location',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAKE_FLAGGED: 'fake-flagged',
};

// Vehicle Status
const VEHICLE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
  EMERGENCY: 'emergency',
};

// Traffic Signal Status
const TRAFFIC_STATUS = {
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red',
};

// V2X Message Types
const V2X_MESSAGE_TYPES = {
  ALERT: 'alert',
  INFO: 'info',
  REQUEST: 'request',
  STATUS: 'status',
  EMERGENCY: 'emergency',
};

// V2X Communication Types
const V2X_COMMUNICATION_TYPES = {
  V2V: 'v2v', // Vehicle-to-Vehicle
  V2I: 'v2i', // Vehicle-to-Infrastructure
  V2H: 'v2h', // Vehicle-to-Hospital
  V2N: 'v2n', // Vehicle-to-Network
};

// API Response Messages
const API_MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'Operation failed',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  DUPLICATE_ENTRY: 'Duplicate entry',
  TOKEN_EXPIRED: 'Token has expired',
};

module.exports = {
  SOCKET_EVENTS,
  USER_ROLES,
  EMERGENCY_TYPES,
  EMERGENCY_SEVERITY,
  EMERGENCY_STATUS,
  VEHICLE_STATUS,
  TRAFFIC_STATUS,
  V2X_MESSAGE_TYPES,
  V2X_COMMUNICATION_TYPES,
  API_MESSAGES,
};
