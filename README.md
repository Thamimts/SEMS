# SEMS — Smart Emergency Mode System

Futuristic V2X-powered emergency response dashboard for ambulances and personal vehicles. Built for Smart India Hackathon, startup demos, and smart transportation projects.

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion
- Axios
- Socket.IO Client
- React Router
- **OpenStreetMap + React Leaflet** (replaced Google Maps)
- **OpenRouteService API** for route calculation
- Recharts (Admin analytics)

## Features

- **Authentication flow**: Login, Signup, OTP, Vehicle Registration, Emergency Contacts
- **Dashboard**: Emergency activation, live location, hospitals, traffic/V2X status, countdown
- **Live Tracking**: Full-screen map, V2V/V2I panels, green corridor, ETA, siren animation
- **Hospital Verification**: QR scan, arrival confirm, deposit, completion animation
- **Admin Dashboard**: Active emergencies, fake detection, analytics charts
- **Vehicle Alerts**: Popup for nearby drivers with distance indicator

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Demo mode**: Works without backend — use any login credentials.

## Backend Integration

Set `VITE_API_URL` and `VITE_SOCKET_URL` in `.env`. Vite proxies `/api` and `/socket.io` to `http://localhost:5000` in development.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | User login |
| POST | `/api/register` | User registration |
| POST | `/api/emergency/activate` | Activate emergency mode |
| POST | `/api/hospital/verify` | Hospital verification |
| GET | `/api/nearby-hospitals` | Nearby hospitals |
| GET | `/api/traffic-status` | Traffic density |
| POST | `/api/v2x/broadcast` | V2X broadcast |

### Socket.IO Events

- `emergency:activated`, `emergency:update`, `emergency:deactivated`
- `v2x:alert`, `v2x:broadcast`, `vehicle:nearby-alert`
- `traffic:update`, `traffic:green-corridor`
- `location:update`, `v2x:connected-count`

## Project Structure

```
src/
├── components/
│   ├── EmergencyButton.jsx
│   ├── HospitalCard.jsx
│   ├── V2XPanel.jsx
│   ├── AlertPopup.jsx
│   ├── InteractiveMap.jsx              // ← NEW: OpenStreetMap component
│   ├── TrafficSignal.jsx
│   └── Layout.jsx
├── pages/
│   ├── Login.jsx, Signup.jsx
│   ├── OtpVerification.jsx
│   ├── VehicleRegistration.jsx
│   ├── EmergencyContacts.jsx
│   ├── Dashboard.jsx
│   ├── EmergencyTracking.jsx           // ← UPDATED: Uses InteractiveMap
│   ├── Verification.jsx
│   └── Admin.jsx
├── services/
│   ├── api.js
│   ├── socket.js
│   └── routeService.js                 // ← NEW: OpenRouteService API
├── hooks/
│   ├── useGeolocation.js
│   └── useAmbulanceTracking.js         // ← NEW: Ambulance tracking
├── utils/
│   └── mapUtils.js                     // ← NEW: Map utilities
├── context/
│   ├── AuthContext.jsx
│   └── EmergencyContext.jsx
├── App.jsx
└── main.jsx
```

## OpenStreetMap Integration

### Quick Setup

1. **Environment variables:**
   ```env
   VITE_ORS_API_KEY=your_openrouteservice_key
   VITE_DEFAULT_CENTER_LAT=13.0827
   VITE_DEFAULT_CENTER_LNG=80.2707
   VITE_DEFAULT_ZOOM=14
   ```

2. **Get API Key:** [OpenRouteService](https://openrouteservice.org/) (free tier available)

3. **Features:**
   - Real-time ambulance tracking with OpenStreetMap
   - Route calculation with distance & ETA
   - Live ambulance movement simulation
   - Green corridor visualization
   - Nearby vehicle markers
   - Custom styled popups and controls

### Documentation

- **[OPENSTREETMAP_SETUP.md](./OPENSTREETMAP_SETUP.md)** — Quick start guide
- **[OPENSTREETMAP_INTEGRATION.md](./OPENSTREETMAP_INTEGRATION.md)** — Complete documentation
- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** — Google Maps → OpenStreetMap migration

### Key Components

**InteractiveMap.jsx** — Main map component with full tracking capabilities:
```jsx
<InteractiveMap
  ambulanceLocation={{lat: 13.08, lng: 80.27}}
  destinationLocation={{lat: 13.10, lng: 80.30}}
  routePath={[...]}
  routeInfo={{distance: 2.5, duration: 10}}
  nearbyVehicles={[...]}
/>
```

**useAmbulanceTracking** — Ambulance tracking hook:
```jsx
const {
  ambulanceLocation,
  routePath,
  routeInfo,
  isSimulating,
  startLiveSimulation,
  stopLiveSimulation,
} = useAmbulanceTracking(initialLocation, destination);
```

**routeService.js** — Route calculation:
```jsx
const route = await calculateRoute(lat1, lng1, lat2, lng2);
// Returns: {distance, duration, coordinates}
```

### Map Features

✓ Full-screen interactive map  
✓ Real-time ambulance tracking  
✓ Automatic route calculation  
✓ Live movement simulation  
✓ Distance & ETA display  
✓ Green corridor visualization  
✓ Responsive design  
✓ Dark cyberpunk theme  
✓ Smooth pan/zoom controls  
✓ Custom markers with animations

## Build

```bash
npm run build
npm run preview
```
