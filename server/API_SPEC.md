# SEMS Backend - Complete API Specification

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require an `Authorization` header:

```
Authorization: Bearer {JWT_TOKEN}
```

## Status Codes

- `200` OK - Request successful
- `201` Created - Resource created successfully
- `400` Bad Request - Invalid request parameters
- `401` Unauthorized - Missing or invalid token
- `404` Not Found - Resource not found
- `500` Internal Server Error - Server error

## Response Format

All responses are in JSON format:

```json
{
  "message": "Optional success message",
  "data": {},
  "error": "Optional error message"
}
```

---

# Authentication Endpoints

## Register User

Creates a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "password": "securePassword123",
  "role": "driver"
}
```

**Parameters:**
- `name` (string, required): User's full name
- `email` (string, required): Valid email address (must be unique)
- `phone` (string, required): Phone number (must be unique)
- `password` (string, required): Minimum 6 characters
- `role` (string, optional): `driver`, `hospital`, or `admin` (default: `driver`)

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "driver",
    "isVerified": false,
    "createdAt": "2024-01-01T12:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: User already exists
- `400`: Validation error

---

## Login

Authenticates user and returns JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Parameters:**
- `email` (string, required): User's email
- `password` (string, required): User's password

**Response:**
```json
{
  "message": "Login successful",
  "user": { /* user object */ },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401`: Invalid credentials

---

## Request OTP

Sends OTP to user's email for verification.

**Endpoint:** `POST /auth/request-otp`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Parameters:**
- `email` (string, required): User's email

**Response:**
```json
{
  "message": "OTP sent to your email",
  "otp": "123456"
}
```

**Note:** OTP is only returned in development mode.

---

## Verify OTP

Verifies OTP and marks user as verified.

**Endpoint:** `POST /auth/verify-otp`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Parameters:**
- `email` (string, required): User's email
- `otp` (string, required): 6-digit OTP

**Response:**
```json
{
  "message": "OTP verified successfully",
  "user": { /* user object */ },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Invalid or expired OTP
- `404`: User not found

---

## Refresh Token

Gets a new access token using refresh token.

**Endpoint:** `POST /auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401`: Invalid refresh token

---

## Get Current User

Gets the currently authenticated user's profile.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer {TOKEN}
```

**Response:**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "driver",
    "bloodGroup": "O+",
    "emergencyContacts": [
      {
        "name": "Jane Doe",
        "phone": "+919876543211",
        "relationship": "Sister"
      }
    ],
    "isVerified": true,
    "lastLogin": "2024-01-15T10:30:00Z"
  }
}
```

---

## Update Profile

Updates user's profile information.

**Endpoint:** `PUT /auth/profile`

**Headers:**
```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+919876543212",
  "bloodGroup": "AB+",
  "emergencyContacts": [
    {
      "name": "Emergency Contact",
      "phone": "+919876543210",
      "relationship": "Brother"
    }
  ],
  "profileImage": "https://example.com/image.jpg"
}
```

**Parameters:**
- `name` (string, optional): User's name
- `phone` (string, optional): Phone number
- `bloodGroup` (string, optional): Blood group (A+, A-, B+, B-, AB+, AB-, O+, O-)
- `emergencyContacts` (array, optional): Array of emergency contacts
- `profileImage` (string, optional): Profile image URL

**Response:**
```json
{
  "message": "Profile updated",
  "user": { /* updated user object */ }
}
```

---

## Logout

Logs out the user (invalidates token on client side).

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer {TOKEN}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

# Location Endpoints

## Update Location

Updates vehicle's current GPS location.

**Endpoint:** `POST /location/update`

**Headers:**
```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "vehicleId": "507f1f77bcf86cd799439011",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "speed": 45,
  "heading": 90,
  "altitude": 100,
  "accuracy": 5,
  "address": "Main Street, Delhi"
}
```

**Parameters:**
- `vehicleId` (string, required): Vehicle ID
- `latitude` (number, required): Latitude (-90 to 90)
- `longitude` (number, required): Longitude (-180 to 180)
- `speed` (number, optional): Speed in km/h
- `heading` (number, optional): Direction in degrees (0-360)
- `altitude` (number, optional): Altitude in meters
- `accuracy` (number, optional): GPS accuracy in meters
- `address` (string, optional): Readable address

**Response:**
```json
{
  "message": "Location updated",
  "location": {
    "_id": "507f1f77bcf86cd799439011",
    "vehicleId": "507f1f77bcf86cd799439011",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "speed": 45,
    "heading": 90,
    "altitude": 100,
    "accuracy": 5,
    "address": "Main Street, Delhi",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Get Current Location

Gets the latest location of a vehicle.

**Endpoint:** `GET /location/:vehicleId/current`

**Headers:**
```
Authorization: Bearer {TOKEN}
```

**URL Parameters:**
- `vehicleId` (string, required): Vehicle ID

**Response:**
```json
{
  "location": {
    "_id": "507f1f77bcf86cd799439011",
    "vehicleId": "507f1f77bcf86cd799439011",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "speed": 45,
    "heading": 90,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## Get Location History

Gets historical location data for a vehicle.

**Endpoint:** `GET /location/:vehicleId/history`

**Headers:**
```
Authorization: Bearer {TOKEN}
```

**URL Parameters:**
- `vehicleId` (string, required): Vehicle ID

**Query Parameters:**
- `limit` (number, optional): Number of records to fetch (default: 100)
- `startDate` (string, optional): Start date in ISO format
- `endDate` (string, optional): End date in ISO format

**Example:**
```
GET /location/507f1f77bcf86cd799439011/history?limit=50&startDate=2024-01-01&endDate=2024-01-15
```

**Response:**
```json
{
  "count": 50,
  "locations": [
    {
      "latitude": 28.7041,
      "longitude": 77.1025,
      "speed": 45,
      "heading": 90,
      "altitude": 100,
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {}
  ]
}
```

---

## Get Nearby Vehicles

Finds all vehicles within a specified radius.

**Endpoint:** `POST /location/nearby`

**Headers:**
```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "latitude": 28.7041,
  "longitude": 77.1025,
  "radius": 1000
}
```

**Parameters:**
- `latitude` (number, required): Center latitude
- `longitude` (number, required): Center longitude
- `radius` (number, optional): Search radius in meters (default: 100)

**Response:**
```json
{
  "count": 5,
  "vehicles": [
    {
      "vehicleId": "507f1f77bcf86cd799439011",
      "vehicleNumber": "DL-01-AB-1234",
      "vehicleType": "ambulance",
      "distance": 150,
      "location": {
        "latitude": 28.7055,
        "longitude": 77.1035
      },
      "speed": 40,
      "lastUpdate": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Get Vehicle Positions

Gets current positions of multiple vehicles.

**Endpoint:** `POST /location/positions`

**Headers:**
```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "vehicleIds": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012"
  ]
}
```

**Parameters:**
- `vehicleIds` (array, required): Array of vehicle IDs

**Response:**
```json
{
  "positions": [
    {
      "vehicleId": "507f1f77bcf86cd799439011",
      "location": {
        "latitude": 28.7041,
        "longitude": 77.1025,
        "timestamp": "2024-01-15T10:30:00Z"
      }
    },
    {
      "vehicleId": "507f1f77bcf86cd799439012",
      "location": null
    }
  ]
}
```

---

# Emergency Endpoints

## Activate Emergency

Activates an emergency for a vehicle.

**Endpoint:** `POST /emergency/activate`

**Headers:**
```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "vehicleId": "507f1f77bcf86cd799439011",
  "type": "accident",
  "severity": "critical",
  "pickupLocation": {
    "latitude": 28.7041,
    "longitude": 77.1025,
    "address": "Main Street, Delhi"
  },
  "destinationHospital": {
    "hospitalId": "507f1f77bcf86cd799439020",
    "name": "Apollo Hospital",
    "latitude": 28.7500,
    "longitude": 77.1500
  }
}
```

**Parameters:**
- `vehicleId` (string, required): Vehicle ID
- `type` (string, required): Emergency type (cardiac, accident, trauma, maternity, fire, other)
- `severity` (string, optional): Severity level (low, medium, high, critical)
- `pickupLocation` (object, required): Pickup location coordinates
- `destinationHospital` (object, optional): Destination hospital details

**Response:**
```json
{
  "message": "Emergency activated",
  "emergency": {
    "_id": "507f1f77bcf86cd799439030",
    "vehicleId": "507f1f77bcf86cd799439011",
    "type": "accident",
    "severity": "critical",
    "status": "active",
    "currentLocation": {
      "latitude": 28.7041,
      "longitude": 77.1025
    },
    "destinationHospital": {
      "hospitalId": "507f1f77bcf86cd799439020",
      "eta": 600,
      "distance": 15000
    },
    "startTime": "2024-01-15T10:30:00Z"
  }
}
```

---

## Get Active Emergency

Gets the active emergency for a vehicle.

**Endpoint:** `GET /emergency/vehicle/:vehicleId/active`

**Headers:**
```
Authorization: Bearer {TOKEN}
```

**URL Parameters:**
- `vehicleId` (string, required): Vehicle ID

**Response:**
```json
{
  "emergency": {
    "_id": "507f1f77bcf86cd799439030",
    "vehicleId": "507f1f77bcf86cd799439011",
    "type": "accident",
    "severity": "critical",
    "status": "en-route",
    "currentLocation": {
      "latitude": 28.7100,
      "longitude": 77.1050
    },
    "destinationHospital": {
      "hospitalId": "507f1f77bcf86cd799439020",
      "eta": 480
    },
    "nearbyVehicles": [
      {
        "vehicleId": "507f1f77bcf86cd799439012",
        "distance": 200,
        "eta": 30
      }
    ]
  }
}
```

**Error Responses:**
- `404`: No active emergency found

---

## Deactivate Emergency

Ends an active emergency.

**Endpoint:** `POST /emergency/:emergencyId/deactivate`

**Headers:**
```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**URL Parameters:**
- `emergencyId` (string, required): Emergency ID

**Request Body:**
```json
{
  "status": "completed"
}
```

**Parameters:**
- `status` (string, optional): Final status (completed, cancelled, fake-flagged)

**Response:**
```json
{
  "message": "Emergency deactivated",
  "emergency": {
    "_id": "507f1f77bcf86cd799439030",
    "status": "completed",
    "endTime": "2024-01-15T11:00:00Z"
  }
}
```

---

## Get Nearby Hospitals

Finds hospitals near an emergency location.

**Endpoint:** `POST /emergency/nearby-hospitals`

**Headers:**
```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "latitude": 28.7041,
  "longitude": 77.1025
}
```

**Parameters:**
- `latitude` (number, required): Emergency latitude
- `longitude` (number, required): Emergency longitude

**Response:**
```json
{
  "hospitals": [
    {
      "hospitalId": "507f1f77bcf86cd799439020",
      "name": "Apollo Hospital",
      "latitude": 28.7500,
      "longitude": 77.1500,
      "distance": 15000,
      "eta": 600,
      "beds": {
        "total": 500,
        "available": 45,
        "occupied": 455
      },
      "icu": {
        "total": 50,
        "available": 5,
        "occupied": 45
      },
      "specialties": ["Cardiology", "Trauma", "Neurosurgery"],
      "contactNumber": "+911147607777"
    }
  ]
}
```

---

## Activate Green Corridor

Activates green corridor (traffic signal override) for emergency route.

**Endpoint:** `POST /emergency/:emergencyId/green-corridor/activate`

**Headers:**
```
Authorization: Bearer {TOKEN}
Content-Type: application/json
```

**URL Parameters:**
- `emergencyId` (string, required): Emergency ID

**Request Body:**
```json
{
  "trafficSignalIds": ["signal_001", "signal_002", "signal_003"],
  "durationSeconds": 300
}
```

**Parameters:**
- `trafficSignalIds` (array, required): Array of traffic signal IDs to override
- `durationSeconds` (number, optional): Duration of green light in seconds (default: 300)

**Response:**
```json
{
  "message": "Green corridor activated",
  "emergency": {
    "_id": "507f1f77bcf86cd799439030",
    "greenCorridor": {
      "isActive": true,
      "affectedSignals": ["signal_001", "signal_002", "signal_003"],
      "activationTime": "2024-01-15T10:30:00Z",
      "deactivationTime": "2024-01-15T10:35:00Z"
    }
  }
}
```

---

## Deactivate Green Corridor

Stops the green corridor activation.

**Endpoint:** `POST /emergency/:emergencyId/green-corridor/deactivate`

**Headers:**
```
Authorization: Bearer {TOKEN}
```

**URL Parameters:**
- `emergencyId` (string, required): Emergency ID

**Response:**
```json
{
  "message": "Green corridor deactivated",
  "emergency": {
    "_id": "507f1f77bcf86cd799439030",
    "greenCorridor": {
      "isActive": false,
      "deactivationTime": "2024-01-15T10:35:00Z"
    }
  }
}
```

---

# Socket.IO Events

## Connection

```javascript
const socket = io('http://localhost:5000/location', {
  auth: {
    token: 'JWT_TOKEN'
  }
});
```

## Location Events

### Send Location Update

```javascript
socket.emit('location:update', {
  vehicleId: '507f1f77bcf86cd799439011',
  latitude: 28.7041,
  longitude: 77.1025,
  speed: 45,
  heading: 90,
  altitude: 100,
  accuracy: 5,
  address: 'Main Street, Delhi'
});
```

### Receive Location Updates

```javascript
socket.on('location:receive', (data) => {
  console.log('Vehicle location:', data);
  // {
  //   vehicleId: '507f1f77bcf86cd799439011',
  //   location: { latitude, longitude, speed, heading, timestamp }
  // }
});
```

## Emergency Events

### Emit Emergency Activation

```javascript
socket.emit('emergency:activated', {
  vehicleId: '507f1f77bcf86cd799439011',
  type: 'accident',
  severity: 'critical',
  pickupLocation: { latitude: 28.7041, longitude: 77.1025 },
  destinationHospital: { hospitalId: '507f...', name: 'Apollo' }
});
```

### Listen for Emergency Alerts

```javascript
socket.on('emergency:activated', (data) => {
  console.log('Emergency alert:', data);
  // {
  //   emergencyId, vehicleId, location, type, severity, nearbyVehicles
  // }
});
```

---

# Error Handling

All errors return appropriate HTTP status codes and error messages:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common Errors:**
- `400 Bad Request`: Invalid input parameters
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Resource doesn't exist
- `500 Internal Server Error`: Server error

---

# Rate Limiting

For production, consider implementing rate limiting:
- 100 location updates per minute per vehicle
- 10 emergency activations per hour per user
- 100 API requests per minute per IP

---

# Data Types

### Coordinates
```json
{
  "latitude": -90.0,
  "longitude": -180.0
}
```

### User Roles
- `driver`: Ambulance or emergency vehicle driver
- `hospital`: Hospital admin/staff
- `admin`: System administrator

### Emergency Types
- `cardiac`: Cardiac emergency
- `accident`: Traffic accident
- `trauma`: Physical trauma
- `maternity`: Pregnancy/childbirth
- `fire`: Fire emergency
- `other`: Other emergency

### Severity Levels
- `low`: Low severity
- `medium`: Medium severity
- `high`: High severity
- `critical`: Life-threatening

---

# Rate Limits

- Location updates: 1 update per 2 seconds minimum
- API requests: 1000 per hour per user
- Socket connections: 10 concurrent per user

---

**Last Updated:** January 2024
**Version:** 1.0.0
