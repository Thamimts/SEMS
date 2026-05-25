# Step-by-Step Connection Verification Guide

## Quick Overview
This guide will help you verify that your frontend and backend are properly connected with real-time communication working.

**Total Time: 10 minutes**

---

## STEP 1: Start the Backend Server (2 minutes)

### Option A: Using Docker (Recommended)
```bash
docker-compose up -d
```

Wait for it to start, then verify:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-05-26T...",
  "uptime": 3.45
}
```

### Option B: Manual Installation
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Wait for message: `Server running on port 5000`

**✓ Backend Ready**: You see port 5000 running

---

## STEP 2: Start the Frontend Server (2 minutes)

Open a **new terminal** and run:
```bash
npm run dev
```

Wait for message: `Local: http://localhost:5173/`

**✓ Frontend Ready**: You see port 5173 running

---

## STEP 3: Open the Browser (1 minute)

1. Open your browser
2. Go to: `http://localhost:5173`
3. You should see the SEMS app loading

---

## STEP 4: Check Browser Console (2 minutes)

This is the MOST IMPORTANT verification step!

### How to Open Browser Console:
- **Windows/Linux**: Press `Ctrl + Shift + J`
- **Mac**: Press `Cmd + Option + J`
- Or right-click → Inspect → Console tab

### What to Look For:

Look for these success messages (order may vary):

```
[SEMS API] Base URL: http://localhost:5000/api
[SEMS Socket] Connecting to http://localhost:5000...
[SEMS Socket] Connected successfully
[SEMS Socket] Connected to /location namespace
[SEMS Socket] Connected to /emergency namespace
```

### If You See These Messages → ✅ CONNECTION SUCCESS!

---

## STEP 5: Test REST API Connection (2 minutes)

### Test 1: Register a New User

In browser console, run:
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    phone: '9999999999',
    password: 'password123'
  })
})
.then(res => res.json())
.then(data => console.log('✓ Registration:', data))
.catch(err => console.error('✗ Error:', err))
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "token": "eyJhbGc..."
  }
}
```

**✓ If you see success**: API connection is working!

### Test 2: Login

In browser console, run:
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(res => res.json())
.then(data => {
  console.log('✓ Login Response:', data);
  if (data.data?.token) {
    localStorage.setItem('authToken', data.data.token);
    console.log('✓ Token saved to localStorage');
  }
})
.catch(err => console.error('✗ Error:', err))
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "...",
    "name": "Test User",
    "token": "eyJhbGc..."
  }
}
```

**✓ If you see success**: Authentication is working!

---

## STEP 6: Test Location Update (Real-time) (2 minutes)

In browser console, run:
```javascript
const token = localStorage.getItem('authToken');

fetch('http://localhost:5000/api/location/update', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    latitude: 28.7041,
    longitude: 77.1025,
    accuracy: 10
  })
})
.then(res => res.json())
.then(data => console.log('✓ Location Update:', data))
.catch(err => console.error('✗ Error:', err))
```

Expected response:
```json
{
  "success": true,
  "message": "Location updated successfully",
  "data": {
    "userId": "...",
    "latitude": 28.7041,
    "longitude": 77.1025,
    "timestamp": "2024-05-26T..."
  }
}
```

**✓ If you see success**: Location API is working!

---

## STEP 7: Test Socket.IO Real-time (2 minutes)

In browser console, check for Socket.IO connection messages:

```javascript
// Check if socket is connected
console.log('[v0] Checking Socket.IO status...');

// Listen for real-time location updates
socket.on('location-update', (data) => {
  console.log('✓ Real-time location received:', data);
});

// Send a test location via Socket.IO
socket.emit('update-location', {
  latitude: 28.7041,
  longitude: 77.1025,
  accuracy: 10,
  speed: 0
}, (response) => {
  console.log('✓ Socket.IO response:', response);
});
```

**✓ If you see messages**: Real-time communication is working!

---

## Complete Verification Checklist

Mark off each step as you complete it:

- [ ] **Backend running** on `http://localhost:5000`
  - Verified with: `curl http://localhost:5000/health`

- [ ] **Frontend running** on `http://localhost:5173`
  - Verified with: Page loads without errors

- [ ] **Browser console shows connection messages**
  - `[SEMS Socket] Connected successfully`

- [ ] **API Test 1 - Register User** works
  - Response: `{ "success": true, ... }`

- [ ] **API Test 2 - Login** works
  - Response: `{ "success": true, "data": { "token": "..." } }`

- [ ] **API Test 3 - Location Update** works
  - Response: `{ "success": true, ... }`

- [ ] **Socket.IO** receives real-time updates
  - Messages appear in console

---

## If Connection is NOT Working - Troubleshooting

### Issue 1: "Cannot reach http://localhost:5000"

**Solution:**
```bash
# Check if backend is running
curl http://localhost:5000/health

# If not, check what's using port 5000
lsof -i :5000

# If needed, kill the process
kill -9 <PID>

# Restart backend
docker-compose up -d
# OR
cd server && npm run dev
```

### Issue 2: "CORS Error" in console

**This usually means:** Backend is running but frontend can't reach it

**Solution:**
1. Check `.env` in server folder
2. Verify: `CORS_ORIGIN=http://localhost:5173`
3. Restart backend

### Issue 3: Socket.IO not connecting

**This means:** Real-time connection failed

**Check browser console for:**
- `Connect error`
- `Unauthorized`
- `Timeout`

**Solution:**
```javascript
// In browser console, check the error
socket.on('connect_error', (error) => {
  console.log('Socket Error:', error);
});
```

### Issue 4: API requests fail with 401 Unauthorized

**This means:** Token is invalid or missing

**Solution:**
```javascript
// Clear old token
localStorage.removeItem('authToken');

// Register new user and login again
// Follow Step 5 above
```

### Issue 5: Port Already in Use

**For Port 5000 (Backend):**
```bash
lsof -i :5000
kill -9 <PID>
docker-compose up -d
```

**For Port 5173 (Frontend):**
```bash
lsof -i :5173
kill -9 <PID>
npm run dev
```

---

## Quick Verification Commands

Run these in your terminal to verify everything:

```bash
# Check backend health
curl http://localhost:5000/health

# Check if ports are listening
lsof -i :5000    # Backend
lsof -i :5173    # Frontend

# Check MongoDB connection (if using)
curl http://localhost:27017

# View backend logs
docker-compose logs backend
# OR
npm run dev (from server folder)
```

---

## Expected Behavior After Connection

Once connected, your app should:

1. ✓ **Register/Login works** - Users can create accounts
2. ✓ **Location updates** - GPS coordinates sent to backend
3. ✓ **Real-time map** - Other vehicles appear in real-time
4. ✓ **Emergency alerts** - Emergency calls received instantly
5. ✓ **Socket.IO events** - All real-time features work

---

## API Endpoints to Test (Advanced)

Once basic connection works, test these endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Get current user (requires token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/auth/me

# Get location history
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/location/history

# Get emergency history
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/emergency/history
```

---

## Success Indicators

Your connection is **100% working** when you see:

```
✓ Backend responds at http://localhost:5000/health
✓ Frontend loads at http://localhost:5173
✓ Console shows "[SEMS Socket] Connected successfully"
✓ User registration returns success response
✓ Login returns auth token
✓ Location updates return success
✓ Socket.IO receives real-time messages
```

---

## Next Steps

After verifying connection:

1. **Test all features** - Try registration, login, location updates
2. **Check the app** - Navigate through the UI
3. **Monitor console** - Watch for any errors
4. **Read API docs** - See `/server/API_SPEC.md` for all endpoints

---

## File Locations

If you need to troubleshoot:

**Backend Config**: `/server/config/env.js`
**Frontend API Service**: `/src/services/api.js`
**Frontend Socket Service**: `/src/services/socket.js`
**Vite Proxy**: `/vite.config.js`

---

## Support

If you get stuck on any step:

1. Check the browser console (Ctrl+Shift+J)
2. Check server logs (npm run dev output)
3. Read `BACKEND_FRONTEND_CONNECTION.md` for detailed troubleshooting
4. Read `/server/README.md` for backend setup issues

---

**Status**: Ready to Verify  
**Time Required**: 10 minutes  
**Difficulty**: Easy  

**Start with Step 1 above!**
