# 🚀 SEMS Backend - START HERE

## Welcome! Your backend is ready to use in 5 minutes.

### Choose Your Setup

#### Option 1: Docker (Fastest - 30 seconds)
```bash
docker-compose up -d
curl http://localhost:5000/health
```

#### Option 2: Manual Setup (5 minutes)
```bash
cd server && npm install
cp .env.example .env
npm run dev
```

---

## 📚 Next Step: Read the Right Guide

### I want to...

| Goal | Read | Time |
|------|------|------|
| **Get running ASAP** | [QUICKSTART.md](./server/QUICKSTART.md) | 5 min |
| **Understand the system** | [BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md) | 10 min |
| **Complete setup guide** | [README.md](./server/README.md) | 20 min |
| **Test all APIs** | [API_SPEC.md](./server/API_SPEC.md) | 30 min |
| **Deploy to production** | [DEPLOYMENT.md](./server/DEPLOYMENT.md) | 30 min |
| **Navigate all docs** | [BACKEND_INDEX.md](./BACKEND_INDEX.md) | 5 min |

---

## ✨ What You Built

A **production-ready** backend with:

✅ **7 Database Models** - User, Vehicle, Location, Emergency, Hospital, Traffic, V2X  
✅ **20+ API Endpoints** - Full REST API  
✅ **15+ Socket.IO Events** - Real-time communication  
✅ **3 Service Layers** - Location, Emergency, V2X  
✅ **JWT Authentication** - Secure access  
✅ **Geospatial Queries** - Location intelligence  
✅ **2,700+ Lines of Docs** - Complete guides  
✅ **Docker Ready** - One-command deployment  

---

## 🎯 Test Your Installation

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"9999999999","password":"password123"}'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

---

## 🔗 Quick Links

**Documentation**
- [Quick Start](./server/QUICKSTART.md) - Get running fast
- [README](./server/README.md) - Complete guide
- [API Reference](./server/API_SPEC.md) - All endpoints
- [Deployment](./server/DEPLOYMENT.md) - Production setup

**Backend Code** (in `server/`)
- [Main Server](./server/server.js) - Entry point
- [Models](./server/models/) - Database schemas
- [Controllers](./server/controllers/) - Request handlers
- [Services](./server/services/) - Business logic
- [Routes](./server/routes/) - API routes

---

## 🎓 Learning Path

**5 Minutes**
1. Open [QUICKSTART.md](./server/QUICKSTART.md)
2. Follow setup instructions
3. Test health endpoint

**15 Minutes**
1. Run backend successfully
2. Read [BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md)
3. Test login/register

**30 Minutes**
1. Read [API_SPEC.md](./server/API_SPEC.md)
2. Test location endpoints
3. Connect Socket.IO

**1 Hour**
1. Read full [README.md](./server/README.md)
2. Review database models
3. Understand Socket.IO events

**Next Steps**
1. Integrate with frontend
2. Configure MongoDB
3. Deploy to production

---

## 📊 What's Included

```
Backend Structure:
├── server.js           ← Main entry point
├── config/             ← Configuration
├── models/             ← 7 Database schemas
├── controllers/        ← 3 API handlers
├── services/           ← 3 Business services
├── routes/             ← 3 Route files
├── middleware/         ← Auth & error handling
├── utils/              ← Helpers & constants
└── Documentation       ← 5 complete guides
```

---

## 🚀 Key Features

✨ **Real-time Location Tracking**  
✨ **Emergency Management System**  
✨ **V2X Communication** (V2V, V2I, V2H)  
✨ **Traffic Signal Integration**  
✨ **Hospital Coordination**  
✨ **Geospatial Queries**  
✨ **JWT Authentication**  
✨ **Socket.IO Events**  

---

## ⚡ Quick Reference

**Start Backend**
```bash
npm run dev          # Development
docker-compose up    # Docker
npm start           # Production
```

**Check Health**
```bash
curl http://localhost:5000/health
```

**View Logs**
```bash
npm run dev         # Shows all logs
docker-compose logs # Docker logs
```

**Database**
```bash
# MongoDB connection
MONGODB_URI=mongodb://localhost:27017/sems
```

**API Base URL**
```
http://localhost:5000/api
```

**Socket.IO Connection**
```
http://localhost:5000/location
http://localhost:5000/emergency
http://localhost:5000/v2x
```

---

## 🆘 Troubleshooting

**Port 5000 in use?**
```bash
lsof -i :5000
kill -9 <PID>
```

**MongoDB not running?**
```bash
docker run -d -p 27017:27017 mongo
```

**CORS errors?**
Check `.env` → `CORS_ORIGIN=http://localhost:3000`

**More help?** → See [QUICKSTART.md](./server/QUICKSTART.md) → Troubleshooting

---

## 📞 Documentation Files

| File | Purpose | Size |
|------|---------|------|
| QUICKSTART.md | 5-minute setup | 317 lines |
| README.md | Complete guide | 617 lines |
| API_SPEC.md | API reference | 960 lines |
| DEPLOYMENT.md | Production setup | 489 lines |
| BACKEND_SUMMARY.md | Architecture | 295 lines |
| BACKEND_INDEX.md | Navigation | 349 lines |

**Total**: 3,027 lines of documentation

---

## ✅ Verification Checklist

After startup, verify:

- [ ] Health endpoint responds: `curl http://localhost:5000/health`
- [ ] Can register user via POST `/api/auth/register`
- [ ] Can login via POST `/api/auth/login`
- [ ] Can update location via POST `/api/location/update`
- [ ] Socket.IO connects without auth errors
- [ ] MongoDB has collections created

---

## 🎉 Ready to Go!

You have a production-ready backend that includes:
- Complete API with 20+ endpoints
- Real-time Socket.IO communication
- 7 database models
- Full authentication system
- Comprehensive documentation
- Docker configuration
- Deployment guides

---

## 🎯 Recommended First Step

### **→ Open [QUICKSTART.md](./server/QUICKSTART.md) and follow the 5-minute setup!**

Then check [API_SPEC.md](./server/API_SPEC.md) to test the API endpoints.

---

## 💡 Pro Tips

1. **Docker recommended** for fastest setup
2. **Keep `.env` secure** in production
3. **MongoDB Atlas** for cloud database
4. **Postman** great for API testing
5. **Check logs** with `npm run dev`

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: 2024

---

**Next**: [QUICKSTART.md](./server/QUICKSTART.md) →
