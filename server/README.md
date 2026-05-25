# SEMS Backend - Smart Emergency Management System

A comprehensive Node.js/Express.js backend API for the Smart Emergency Management System with real-time location tracking, emergency management, V2X communication, and traffic integration.

## 🚀 Features

### Core Features
- **Authentication System**: JWT-based login/register with OTP verification
- **Real-time Location Tracking**: GPS updates with 2-second intervals
- **Emergency Management**: Activate/deactivate emergencies with real-time tracking
- **V2X Communication**: Vehicle-to-Vehicle (V2V), Vehicle-to-Infrastructure (V2I), Vehicle-to-Hospital (V2H)
- **Traffic Integration**: Green corridor activation, traffic signal override
- **Hospital Integration**: Nearby hospital detection, bed availability tracking
- **Real-time Alerts**: Push notifications and voice alerts via Socket.IO

### Advanced Features
- Location history with TTL-based auto-cleanup
- Geospatial queries for nearby vehicles and hospitals
- Emergency zone broadcasting
- Traffic prediction (extensible)
- V2X message encryption support
- Admin analytics and reporting

## 📋 Prerequisites

- Node.js 14+ 
- MongoDB 4.4+
- npm or yarn

## ⚙️ Installation

### 1. Clone and Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the server directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sems
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

### 3. Start MongoDB

```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or locally if installed
mongod
```

### 4. Start the Server

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Server will be running at `http://localhost:5000`

## 📚 API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "driver"
}

Response: { user, token, refreshToken }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { user, token, refreshToken }
```

#### Request OTP
```
POST /api/auth/request-otp
Content-Type: application/json

{
  "email": "john@example.com"
}

Response: { message, otp (dev only) }
```

#### Verify OTP
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}

Response: { user, token, refreshToken }
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}

Response: { user }
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "bloodGroup": "O+",
  "emergencyContacts": [
    {
      "name": "Emergency Contact",
      "phone": "9876543210",
      "relationship": "Brother"
    }
  ]
}

Response: { user }
```

### Location Management

#### Update Location
```
POST /api/location/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "vehicleId": "vehicle_id",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "speed": 45,
  "heading": 90,
  "altitude": 100,
  "accuracy": 5,
  "address": "Location address"
}

Response: { location }
```

#### Get Current Location
```
GET /api/location/:vehicleId/current
Authorization: Bearer {token}

Response: { location }
```

#### Get Location History
```
GET /api/location/:vehicleId/history?limit=100&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {token}

Response: { count, locations }
```

#### Get Nearby Vehicles
```
POST /api/location/nearby
Authorization: Bearer {token}
Content-Type: application/json

{
  "latitude": 28.7041,
  "longitude": 77.1025,
  "radius": 1000
}

Response: { count, vehicles }
```

### Emergency Management

#### Activate Emergency
```
POST /api/emergency/activate
Authorization: Bearer {token}
Content-Type: application/json

{
  "vehicleId": "vehicle_id",
  "type": "accident",
  "severity": "critical",
  "pickupLocation": {
    "latitude": 28.7041,
    "longitude": 77.1025,
    "address": "Address"
  },
  "destinationHospital": {
    "hospitalId": "hospital_id",
    "name": "Hospital Name",
    "latitude": 28.7500,
    "longitude": 77.1500
  }
}

Response: { emergency }
```

#### Get Active Emergency
```
GET /api/emergency/active/:vehicleId
Authorization: Bearer {token}

Response: { emergency }
```

#### Deactivate Emergency
```
POST /api/emergency/:emergencyId/deactivate
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed"
}

Response: { emergency }
```

#### Get Nearby Hospitals
```
POST /api/emergency/nearby-hospitals
Authorization: Bearer {token}
Content-Type: application/json

{
  "latitude": 28.7041,
  "longitude": 77.1025
}

Response: { hospitals }
```

#### Activate Green Corridor
```
POST /api/emergency/:emergencyId/green-corridor/activate
Authorization: Bearer {token}
Content-Type: application/json

{
  "trafficSignalIds": ["signal1", "signal2"],
  "durationSeconds": 300
}

Response: { emergency }
```

## 🔌 Socket.IO Events

### Location Namespace (`/location`)

#### Emit: Location Update
```javascript
socket.emit('location:update', {
  vehicleId: 'vehicle_id',
  latitude: 28.7041,
  longitude: 77.1025,
  speed: 45,
  heading: 90,
  altitude: 100,
  accuracy: 5,
  address: 'Location address'
});
```

#### Listen: Location Receive
```javascript
socket.on('location:receive', (data) => {
  console.log('Location update:', data);
  // {
  //   vehicleId: 'vehicle_id',
  //   location: { latitude, longitude, speed, heading, timestamp }
  // }
});
```

### Emergency Namespace (`/emergency`)

#### Emit: Activate Emergency
```javascript
socket.emit('emergency:activated', {
  vehicleId: 'vehicle_id',
  type: 'accident',
  severity: 'critical',
  pickupLocation: { latitude, longitude, address },
  destinationHospital: { hospitalId, name, latitude, longitude }
});
```

#### Listen: Emergency Activated
```javascript
socket.on('emergency:activated', (data) => {
  console.log('Emergency alert:', data);
  // {
  //   emergencyId, vehicleId, location, type, severity, nearbyVehicles
  // }
});
```

### V2X Namespace (`/v2x`)

#### Emit: V2X Broadcast
```javascript
socket.emit('v2x:broadcast', {
  messageType: 'alert',
  payload: {
    title: 'Emergency vehicle nearby',
    description: 'Give way to ambulance'
  },
  radius: 1000
});
```

#### Listen: V2X Alert
```javascript
socket.on('v2x:alert', (data) => {
  console.log('V2X alert:', data);
});
```

### Traffic Namespace (`/traffic`)

#### Emit: Signal Override
```javascript
socket.emit('traffic:signal-override', {
  signalId: 'signal_123',
  duration: 300
});
```

#### Listen: Signal Override
```javascript
socket.on('traffic:signal-override', (data) => {
  console.log('Signal overridden:', data);
});
```

## 🗄️ Database Schema

### User Model
- Stores driver and hospital user information
- Authentication credentials and OTP
- Emergency contacts and medical information

### Vehicle Model
- Registration and ownership details
- Current location and status
- Equipment and capacity information

### Location Model
- GPS coordinates with geospatial indexing
- Speed, heading, altitude, accuracy
- TTL-based auto-cleanup after 24 hours

### Emergency Model
- Emergency type and severity
- Route and ETA information
- Green corridor activation status

### Hospital Model
- Hospital details and capacity
- Available beds and ICU information
- Location and contact information

### Traffic Model
- Traffic signal status and override information
- Congestion and maintenance tracking

### V2XMessage Model
- Message type and priority
- Encryption and delivery status
- Timestamp with TTL expiry

## 🔐 Authentication

The API uses JWT tokens for authentication:

1. **Get Token**: Login or register to receive a JWT token
2. **Include Token**: Add `Authorization: Bearer {token}` to requests
3. **Token Refresh**: Use refresh token to get a new access token

## 🚦 Geospatial Features

### Nearby Vehicles Query
Uses MongoDB geospatial indexes to find vehicles within a radius:
```javascript
// Automatically queries using 2dsphere index
const nearbyVehicles = await LocationService.getNearbyVehicles(lat, lon, radiusMeters);
```

### Nearby Hospitals Query
Finds hospitals within 50km of an emergency location:
```javascript
const hospitals = await EmergencyService.getNearbyHospitals(lat, lon, limit);
```

## 📊 Architecture

### Directory Structure
```
server/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── models/          # MongoDB schemas
├── routes/          # API routes (extensible)
├── services/        # Business logic
├── middleware/      # Auth, error handling
├── utils/           # Helper functions and constants
├── sockets/         # Socket.IO handlers (extensible)
├── server.js        # Main entry point
└── package.json
```

### Data Flow
1. Client sends request/Socket event
2. Middleware validates JWT token
3. Controller processes request
4. Service handles business logic
5. Model interacts with MongoDB
6. Response is sent back to client

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/sems

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Features
ENABLE_V2X=true
ENABLE_TRAFFIC_OVERRIDE=true
ENABLE_LOCATION_HISTORY=true

# Geolocation
NEARBY_VEHICLE_RADIUS=20
LOCATION_UPDATE_INTERVAL=2000
```

## 🚀 Deployment

### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

### Environment Setup
1. Set up MongoDB cluster (MongoDB Atlas recommended)
2. Configure environment variables
3. Deploy to your hosting platform (Heroku, AWS, etc.)

## 📈 Scaling Considerations

- **Database**: Use MongoDB replication for high availability
- **Socket.IO**: Use Redis adapter for clustering
- **API**: Use load balancers (Nginx, AWS ELB)
- **Storage**: Store location history in separate collections by date

## 🔍 Monitoring & Logging

The server logs all important operations:
- Connection events
- Location updates
- Emergency activations
- Error conditions

Enable debug mode in development:
```env
NODE_ENV=development
```

## 🆘 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check MONGODB_URI is correct
- Verify network connectivity

### Socket.IO Connection Issues
- Check CORS_ORIGIN configuration
- Verify token is being sent in handshake
- Check browser console for errors

### Geospatial Queries Not Working
- Ensure Location model has `2dsphere` index
- Check coordinate format: [longitude, latitude]
- Verify coordinates are valid (lat: -90 to 90, lon: -180 to 180)

## 📝 API Examples

### Complete Flow Example

```javascript
// 1. Register/Login to get token
const loginRes = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});
const { token } = await loginRes.json();

// 2. Connect to Socket.IO
const socket = io('http://localhost:5000/location', {
  auth: { token }
});

// 3. Send location updates
socket.emit('location:update', {
  vehicleId: 'vehicle_123',
  latitude: 28.7041,
  longitude: 77.1025,
  speed: 45,
  heading: 90
});

// 4. Listen for location updates
socket.on('location:receive', (data) => {
  console.log('Nearby vehicle location:', data);
});

// 5. Activate emergency
const emergRes = await fetch('http://localhost:5000/api/emergency/activate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    vehicleId: 'vehicle_123',
    type: 'accident',
    severity: 'critical',
    pickupLocation: { latitude: 28.7041, longitude: 77.1025 }
  })
});
```

## 📄 License

MIT License - See LICENSE file

## 👥 Support

For issues and questions:
- Check the troubleshooting section
- Review Socket.IO and Express.js documentation
- Create an issue in the repository

---

**SEMS Backend** - Real-time Emergency Management Made Simple
