# Backend & Frontend Connection Guide

## ✅ Connection Status: READY TO CONNECT

Your backend and frontend are **architecturally configured** to work together. Both are set up correctly but need to be running simultaneously to communicate.

---

## 🔌 Current Configuration

### Frontend Setup (✅ Configured)

**File**: `vite.config.js`
```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',    // ← Backend URL
      changeOrigin: true,
    },
    '/socket.io': {
      target: 'http://localhost:5000',    // ← Backend URL
      ws: true,
    },
  },
}
```

**Environment Variables** (`.env.example`):
```
VITE_API_URL=/api                    # Routes through Vite proxy
VITE_SOCKET_URL=                     # Empty = use same origin (proxy)
```

**API Service** (`src/services/api.js`):
- Base URL: `/api` (proxied to `http://localhost:5000/api`)
- Includes JWT token auth interceptors
- Includes 401 error handling (redirects to login)

**Socket.IO Service** (`src/services/socket.js`):
- URL: Default (proxied to `http://localhost:5000`)
- Includes auth token
- 10 reconnection attempts with 1s delays

### Backend Setup (✅ Configured)

**File**: `server/server.js`
- Port: `5000`
- CORS enabled for frontend origins
- Socket.IO enabled with authentication

**API Routes**:
- `/api/auth/*` - Authentication
- `/api/location/*` - Location tracking
- `/api/emergency/*` - Emergency management
- `/api/hospital/*` - Hospital coordination
- `/api/traffic/*` - Traffic signals
- `/api/v2x/*` - V2X communication

**Socket.IO Namespaces**:
- `/location` - Location updates
- `/emergency` - Emergency events
- `/v2x` - V2X messages
- `/traffic` - Traffic signals
- `/notifications` - Broadcast alerts

---

## 🚀 Connection Steps

### Step 1: Start the Backend

```bash
# Option A: Docker (Fastest)
docker-compose up -d

# Option B: Manual
cd server
npm install
cp .env.example .env
npm run dev
```

**Verify Backend**:
```bash
curl http://localhost:5000/health
# Expected: {"status":"healthy","timestamp":"...","uptime":...}
```

### Step 2: Start the Frontend

```bash
# In a new terminal, from project root
npm install          # if not done
npm run dev

# Frontend runs on http://localhost:5173
```

**Backend accessible from frontend as**:
- REST API: `http://localhost:5173/api` (proxied to `http://localhost:5000/api`)
- Socket.IO: `http://localhost:5173/socket.io` (proxied to WebSocket on port 5000)

### Step 3: Test the Connection

#### 3.1 Test REST API

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9999999999",
    "password": "password123"
  }'

# Response should include a token:
# {
#   "success": true,
#   "token": "eyJhbGc...",
#   "user": {...}
# }
```

#### 3.2 Test Socket.IO Connection

```bash
# Install socket.io-client globally (optional)
npm install -g socket.io-client

# Or test via browser DevTools console
# Open http://localhost:5173 in browser and in console:
const { io } = await import('socket.io-client');
const socket = io('http://localhost:5000', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});
socket.on('connect', () => console.log('Connected!'));
socket.on('connect_error', (err) => console.error('Error:', err));
```

#### 3.3 Test via Frontend UI

1. Open `http://localhost:5173` in browser
2. Register a new account
3. Check browser DevTools Console for:
   - ✅ Socket connection message: `[SEMS Socket] Connected: ...`
   - ✅ No `401` or `Connection error` messages
4. Trigger location update or emergency to test real-time communication

---

## 🔍 Connection Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Port 5173)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React App + Vite Dev Server                         │  │
│  │                                                      │  │
│  │  API Requests:                                       │  │
│  │  axios.post('/api/auth/login')                       │  │
│  │         ↓ (Vite Proxy)                              │  │
│  │  http://localhost:5000/api/auth/login              │  │
│  │                                                      │  │
│  │  Socket.IO:                                          │  │
│  │  io('') or io('http://localhost:5173')             │  │
│  │         ↓ (Vite Proxy /socket.io)                   │  │
│  │  ws://localhost:5000/socket.io                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         ↓↑ (HTTP + WebSocket)
┌─────────────────────────────────────────────────────────────┐
│                     Backend (Port 5000)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js Server + Socket.IO Server                │  │
│  │                                                      │  │
│  │  REST Routes:                                        │  │
│  │  /api/auth, /api/location, /api/emergency, etc      │  │
│  │                                                      │  │
│  │  Socket.IO Namespaces:                               │  │
│  │  /location, /emergency, /v2x, /traffic              │  │
│  │                                                      │  │
│  │  Database:                                           │  │
│  │  MongoDB (configured)                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📡 API Endpoints Connected

### Authentication
- ✅ `POST /api/auth/register` - Register new user
- ✅ `POST /api/auth/login` - Login user
- ✅ `POST /api/auth/verify-otp` - OTP verification
- ✅ `POST /api/auth/refresh-token` - Refresh JWT

### Location Tracking
- ✅ `POST /api/location/update` - Update GPS location
- ✅ `GET /api/location/current` - Get current location
- ✅ `GET /api/location/history` - Location history

### Emergency Management
- ✅ `POST /api/emergency/activate` - Start emergency
- ✅ `POST /api/emergency/deactivate` - End emergency
- ✅ `GET /api/emergency/active` - Active emergencies
- ✅ `GET /api/emergency/{id}/hospitals` - Nearby hospitals

### Socket.IO Events
- ✅ `location:update` - Real-time location updates
- ✅ `emergency:activated` - Emergency started
- ✅ `emergency:deactivated` - Emergency ended
- ✅ `v2x:broadcast` - V2X messages
- ✅ `traffic:update` - Traffic updates
- ✅ `traffic:green-corridor` - Green corridor activated

---

## 🐛 Troubleshooting Connection Issues

### Issue: "Cannot GET /api/*"
**Cause**: Backend not running  
**Solution**: Start backend: `docker-compose up -d` or `npm run dev` in `server/` folder

### Issue: "net::ERR_CONNECTION_REFUSED"
**Cause**: Backend on wrong port or not listening  
**Solution**: 
```bash
# Check backend running on port 5000
lsof -i :5000

# If port in use, kill and restart
kill -9 <PID>
npm run dev
```

### Issue: "CORS error" or "Access-Control-Allow-Origin"
**Cause**: Backend CORS not configured for frontend origin  
**Solution**: Check `server/.env`:
```
CORS_ORIGIN=http://localhost:5173
```

### Issue: Socket.IO "WebSocket connection failed"
**Cause**: WebSocket upgrade not working through Vite proxy  
**Solution**: 
1. Check Vite config `/socket.io` proxy has `ws: true`
2. Check backend CORS allows WebSocket
3. Try direct connection: `io('http://localhost:5000')`

### Issue: "401 Unauthorized" on requests
**Cause**: No token or invalid token  
**Solution**:
1. First register/login to get token
2. Check token stored in localStorage: `localStorage.getItem('sems_token')`
3. Verify token in Authorization header: `Bearer {token}`

### Issue: Frontend shows "Connecting..." forever
**Cause**: Socket.IO not connecting  
**Solution**:
```bash
# Check Socket.IO server logs
npm run dev    # Should show connection attempts

# Test direct connection
curl -i -N -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  http://localhost:5000/socket.io
```

---

## 📋 Quick Start Checklist

- [ ] Backend running: `http://localhost:5000/health` returns 200
- [ ] Frontend running: `http://localhost:5173` loads without errors
- [ ] Can register user via POST `/api/auth/register`
- [ ] Can login via POST `/api/auth/login`
- [ ] JWT token stored in localStorage after login
- [ ] Socket.IO connects (check browser console)
- [ ] No CORS errors in browser console
- [ ] No "Connection refused" errors
- [ ] Can post location via `/api/location/update`
- [ ] Real-time updates received via Socket.IO

---

## 🎯 Connection Architecture

### Development
```
Frontend (5173)
    ↓↑ (Vite Proxy)
Backend (5000)
```

### Production
```
Frontend (Same origin as Backend)
    ↓↑ (Direct HTTP + WebSocket)
Backend (5000 or 80/443)
```

---

## 🔑 Environment Variables Needed

### Frontend (`.env`)
```
VITE_API_URL=/api                # For dev (use Vite proxy)
VITE_SOCKET_URL=                 # For dev (use same origin)
```

### Backend (`server/.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sems
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

---

## ✨ Features That Require Connection

| Feature | Endpoint | Socket Event |
|---------|----------|--------------|
| User Auth | `/api/auth/login` | - |
| Location Tracking | `/api/location/update` | `location:update` |
| Emergency Activation | `/api/emergency/activate` | `emergency:activated` |
| Hospital Routing | `/api/emergency/{id}/hospitals` | `hospital:arrival` |
| Traffic Control | `/api/traffic/green-corridor` | `traffic:green-corridor` |
| V2X Communication | `/api/v2x/broadcast` | `v2x:broadcast` |
| Real-time Alerts | - | `v2x:alert` |

---

## 🚀 Next Steps

1. **Start Backend**: `docker-compose up -d` (30 seconds)
2. **Start Frontend**: `npm run dev` (5 seconds)
3. **Test Connection**: Open `http://localhost:5173` in browser
4. **Verify in Console**: Check for `[SEMS Socket] Connected` message
5. **Test API**: Register and login user
6. **Check Real-time**: Trigger emergency or location update

---

## 📞 Getting Help

### Check Logs
```bash
# Frontend logs
npm run dev              # Shows Vite proxy logs

# Backend logs
npm run dev              # Shows Express/Socket.IO logs
docker-compose logs      # Shows Docker logs

# Browser console
F12 → Console           # Check for [SEMS Socket] messages
F12 → Network           # Check API request/response
```

### Common Fixes
1. Restart both servers (kill and re-run)
2. Clear browser cache and localStorage
3. Check firewall allows port 5000
4. Verify `.env` files exist
5. Install dependencies: `npm install`

---

## 📊 Connection Test Results

### Backend Verification
```javascript
// Paste in terminal after starting backend:
curl -X GET http://localhost:5000/health

// Expected response:
// {"status":"healthy","timestamp":"2024-01-XX...","uptime":12.34}
```

### Frontend Verification
```javascript
// Paste in browser console at http://localhost:5173:
console.log(
  'API calls via:',
  document.location.origin + '/api',
  'Proxied to: http://localhost:5000/api'
);
console.log(
  'Socket.IO via: same origin WebSocket',
  'Proxied to: ws://localhost:5000/socket.io'
);
```

---

## ✅ Summary

Your **backend and frontend are fully configured to work together**:

- ✅ Frontend Vite proxy routes `/api` to backend `:5000`
- ✅ Frontend Vite proxy routes WebSocket to backend `:5000`
- ✅ Backend CORS configured for frontend origins
- ✅ API endpoints match frontend service calls
- ✅ Socket.IO events match frontend event handlers
- ✅ JWT authentication chain configured
- ✅ Environment variables documented

**Just run both servers and they will communicate perfectly!**

---

**Status**: Ready to Connect  
**Last Updated**: 2024  
**Backend Port**: 5000  
**Frontend Port**: 5173  
