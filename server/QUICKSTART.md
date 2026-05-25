# SEMS Backend - Quick Start Guide

Get the SEMS backend running in 5 minutes!

## 🚀 Fastest Setup (Docker)

```bash
# 1. Make sure Docker is installed
docker --version

# 2. Start MongoDB and Backend
docker-compose up -d

# 3. Check if running
curl http://localhost:5000/health

# Done! Backend is running at http://localhost:5000
```

## 📦 Manual Setup (Node.js)

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sems
JWT_SECRET=dev-secret-key-change-in-production
CORS_ORIGIN=http://localhost:3000
```

### 3. Start MongoDB

**Option A: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: Local MongoDB**
```bash
mongod
```

### 4. Start Backend

```bash
npm run dev
```

You should see:
```
[Server] Running on http://localhost:5000
[DB] MongoDB connected: localhost
```

## ✅ Test Your Setup

### 1. Check Health

```bash
curl http://localhost:5000/health
```

### 2. Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "password123",
    "role": "driver"
  }'
```

You'll get back:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### 3. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Test Location Update

```bash
curl -X POST http://localhost:5000/api/location/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "vehicleId": "vehicle_123",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "speed": 45,
    "accuracy": 5
  }'
```

## 🔌 WebSocket Test

### Using Node.js

```javascript
const io = require('socket.io-client');

// Get token from login first
const token = 'YOUR_JWT_TOKEN';

// Connect to location namespace
const socket = io('http://localhost:5000/location', {
  auth: { token }
});

socket.on('connect', () => {
  console.log('Connected!');
  
  // Send location update
  socket.emit('location:update', {
    vehicleId: 'vehicle_123',
    latitude: 28.7041,
    longitude: 77.1025,
    speed: 45
  });
});

socket.on('location:receive', (data) => {
  console.log('Location received:', data);
});

socket.on('error', (error) => {
  console.error('Error:', error);
});
```

### Using HTML/JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
  <script>
    const token = 'YOUR_JWT_TOKEN';
    const socket = io('http://localhost:5000/location', {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('Connected to SEMS Backend');
      
      socket.emit('location:update', {
        vehicleId: 'vehicle_123',
        latitude: 28.7041,
        longitude: 77.1025,
        speed: 45
      });
    });

    socket.on('location:receive', (data) => {
      console.log('Vehicle location:', data);
    });
  </script>
</body>
</html>
```

## 📊 Next Steps

1. **Read the Full API Documentation**: `API_SPEC.md`
2. **Setup Guide**: `README.md`
3. **Deployment**: `DEPLOYMENT.md`
4. **Connect Frontend**: Update your frontend's API base URL to `http://localhost:5000`

## 🆘 Troubleshooting

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
# For Docker:
docker ps | grep mongodb

# For local:
# Make sure mongod is running in another terminal
```

### Port 5000 Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill it (replace PID with actual process ID)
kill -9 PID
```

### CORS Error

Make sure `CORS_ORIGIN` in `.env` matches your frontend URL:
```
CORS_ORIGIN=http://localhost:3000
```

### Socket.IO Connection Failing

1. Check token is valid
2. Verify `CORS_ORIGIN` is correct
3. Check browser console for specific error
4. Make sure server is running on port 5000

## 📁 Important Files

```
server/
├── server.js           # Main entry point
├── config/             # Configuration
│   ├── env.js
│   ├── database.js
│   └── socketio.js
├── models/             # Database schemas
├── controllers/        # Request handlers
├── services/           # Business logic
├── routes/             # API routes
├── middleware/         # Auth & error handling
├── utils/              # Helpers & constants
├── package.json
├── .env.example
├── README.md           # Full documentation
├── API_SPEC.md         # API reference
├── DEPLOYMENT.md       # Deployment guide
└── QUICKSTART.md       # This file
```

## 🎯 Common Tasks

### Create a New Endpoint

1. Create controller in `controllers/`
2. Create route in `routes/`
3. Import route in `server.js`

### Add New Database Model

1. Create model in `models/`
2. Add indexes if needed
3. Update services to use model

### Debug Issues

```bash
# View logs in real-time
npm run dev

# Check MongoDB data
# Use MongoDB Compass or mongosh:
mongosh
use sems
db.users.find()
```

## 🔗 Useful Links

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Socket.IO Docs](https://socket.io/docs/)
- [JWT Guide](https://jwt.io/introduction)

## 💡 Tips

1. **Keep tokens secure** - Never log or expose JWT tokens
2. **Use HTTPS in production** - Always encrypt data in transit
3. **Validate inputs** - Sanitize all user inputs
4. **Monitor logs** - Check console for errors and warnings
5. **Test with Postman** - Easy API testing

## 🆘 Need Help?

1. Check `README.md` for detailed documentation
2. Review `API_SPEC.md` for endpoint details
3. Check logs: `npm run dev` shows all errors
4. Verify environment variables are set correctly
5. Make sure MongoDB is running

---

**Happy coding!** 🚀

Next: Read `API_SPEC.md` for complete API documentation
