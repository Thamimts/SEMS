# Quick Connection Check (2 Minutes)

## The 7-Step Verification

### STEP 1: Start Backend
```bash
docker-compose up -d
```
**Check**: `curl http://localhost:5000/health` → Should see `{"status":"healthy"}`

### STEP 2: Start Frontend  
```bash
npm run dev
```
**Check**: See `Local: http://localhost:5173/` in terminal

### STEP 3: Open Browser
- Go to: `http://localhost:5173`

### STEP 4: Open Browser Console
- Press: `Ctrl + Shift + J` (Windows/Linux) or `Cmd + Option + J` (Mac)

### STEP 5: Look for Success Messages
Should see in console:
```
[SEMS Socket] Connected successfully
```

**✓ SUCCESS** if you see this message!

### STEP 6: Test Registration (Paste in Console)
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test',
    email: 'test@test.com',
    phone: '9999999999',
    password: 'password123'
  })
}).then(r => r.json()).then(d => console.log(d))
```

**✓ SUCCESS** if you see `"success": true`

### STEP 7: Test Login (Paste in Console)
```javascript
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@test.com',
    password: 'password123'
  })
}).then(r => r.json()).then(d => {
  console.log(d);
  if(d.data?.token) localStorage.setItem('token', d.data.token);
})
```

**✓ SUCCESS** if you see `"success": true` and token is saved

---

## Connection Status Indicators

| What to Check | Expected | Status |
|---------------|----------|--------|
| Backend Health | `curl :5000/health` returns JSON | ✓ |
| Frontend Loads | Page at `localhost:5173` works | ✓ |
| Console Message | `[SEMS Socket] Connected` | ✓ |
| Register API | Returns `"success": true` | ✓ |
| Login API | Returns `"success": true` + token | ✓ |
| Socket.IO | Receives real-time messages | ✓ |

**If all marked ✓** → Connection is WORKING!

---

## Common Issues & Quick Fixes

| Error | Fix |
|-------|-----|
| `Cannot connect to localhost:5000` | Restart backend: `docker-compose up -d` |
| `CORS error` in console | Check server `.env` has correct CORS_ORIGIN |
| `Socket not connecting` | Clear cache: `Ctrl+Shift+Delete` and refresh |
| `401 Unauthorized` | Re-login: Clear localStorage and test login again |
| `Port 5000 in use` | Kill process: `lsof -i :5000` then `kill -9 <PID>` |

---

## Terminal Commands Cheatsheet

```bash
# Start Backend (Docker)
docker-compose up -d

# Start Backend (Manual)
cd server && npm run dev

# Start Frontend
npm run dev

# Check Backend Health
curl http://localhost:5000/health

# View Backend Logs
docker-compose logs backend

# Stop All Services
docker-compose down
```

---

## Verification Checklist

```
BACKEND
- [ ] Port 5000 running
- [ ] /health endpoint responds
- [ ] MongoDB connected

FRONTEND  
- [ ] Port 5173 running
- [ ] Page loads at localhost:5173
- [ ] No errors in browser console

CONNECTION
- [ ] [SEMS Socket] Connected message appears
- [ ] API requests get responses
- [ ] Real-time updates work
```

---

## Everything Working?

✓ **YES** → Great! Start using your app
✓ **NO** → Read `VERIFY_CONNECTION.md` for detailed troubleshooting

---

**Time**: 2 minutes  
**Difficulty**: Very Easy  
**Next**: Follow the 7 steps above
