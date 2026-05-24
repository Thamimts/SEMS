# Quick Reference Card: OpenStreetMap Integration

## ⚡ Quick Start (30 seconds)

```bash
# 1. Install deps (already done)
npm install

# 2. Configure environment
cp .env.example .env
# Add VITE_ORS_API_KEY=your_key

# 3. Run dev server
npm run dev

# 4. Open Emergency Tracking page
# http://localhost:5173/emergency-tracking
```

## 📦 New Files at a Glance

| File | Purpose | Size |
|------|---------|------|
| `src/components/InteractiveMap.jsx` | Main map component | 540 lines |
| `src/services/routeService.js` | Route & geocoding | 210 lines |
| `src/hooks/useAmbulanceTracking.js` | Tracking state | 190 lines |
| `src/utils/mapUtils.js` | Map utilities | 380 lines |

## 🗺️ Core Components

### InteractiveMap
```jsx
import InteractiveMap from '@/components/InteractiveMap';

<InteractiveMap
  ambulanceLocation={{lat, lng}}
  destinationLocation={{lat, lng}}
  routePath={[{lat, lng}, ...]}
  routeInfo={{distance, duration, message}}
  nearbyVehicles={[{lat, lng, type}, ...]}
  showCorridor={true}
  isLoading={false}
/>
```

### useAmbulanceTracking
```jsx
const {
  ambulanceLocation,      // Current position
  routePath,              // Route coordinates
  routeInfo,              // {distance, duration}
  isCalculatingRoute,     // Loading state
  isSimulating,           // Simulation status
  updateRoute,            // Recalculate
  startLiveSimulation,    // Start movement
  stopLiveSimulation,     // Stop movement
} = useAmbulanceTracking(initLoc, destLoc);
```

## 🔑 Configuration

### .env Variables
```env
VITE_ORS_API_KEY=your_openrouteservice_key
VITE_ORS_API_URL=https://api.openrouteservice.org
VITE_DEFAULT_CENTER_LAT=13.0827         # Chennai
VITE_DEFAULT_CENTER_LNG=80.2707
VITE_DEFAULT_ZOOM=14
```

### Get API Key (Free)
1. Visit https://openrouteservice.org/
2. Sign up (free account)
3. Copy API key from dashboard
4. Add to `.env`

## 🎨 Theme Colors

```css
/* Ambulance (Red, Pulsing) */
#ff2d55

/* Destination (Blue) */
#00d4ff

/* Route (Green) */
#00ff88

/* Vehicles (Amber) */
#ffb800

/* Dark Background */
#0a0e17
```

## 📍 Coordinate Format

### Array Format (React Leaflet)
```javascript
const pos = [lat, lng];  // [13.0827, 80.2707]
```

### Object Format (Services)
```javascript
const pos = {lat, lng};  // {lat: 13.0827, lng: 80.2707}
```

## 🚀 Common Tasks

### Calculate Route
```javascript
import { calculateRoute } from '@/services/routeService';

const result = await calculateRoute(
  13.0827, 80.2707,    // start
  13.1000, 80.3000     // end
);

// result: {distance, duration, coordinates}
```

### Reverse Geocode
```javascript
import { reverseGeocode } from '@/services/routeService';

const address = await reverseGeocode(13.0827, 80.2707);
```

### Map Utilities
```javascript
import {
  calculateDistance,
  calculateBearing,
  formatCoordinates,
  createCirclePoints,
  simplifyPolyline,
} from '@/utils/mapUtils';

const km = calculateDistance(lat1, lng1, lat2, lng2);
const bearing = calculateBearing(lat1, lng1, lat2, lng2);
const formatted = formatCoordinates(13.0827, 80.2707);
```

### Start Ambulance Simulation
```javascript
// In component:
const { isSimulating, startLiveSimulation } = useAmbulanceTracking(...);

<button onClick={startLiveSimulation}>
  {isSimulating ? 'Stop' : 'Start'} Simulation
</button>
```

## 🔗 Import Statements

```javascript
// Components
import InteractiveMap from '@/components/InteractiveMap';

// Services
import { calculateRoute, reverseGeocode } from '@/services/routeService';

// Hooks
import { 
  useAmbulanceTracking,
  useLiveLocationUpdates,
  useLocationHistory,
} from '@/hooks/useAmbulanceTracking';

// Utils
import {
  calculateDistance,
  calculateBearing,
  formatCoordinates,
  simplifyPolyline,
  createCirclePoints,
} from '@/utils/mapUtils';

// Leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
```

## 🎯 Common Props

### Marker Location
```javascript
{
  lat: 13.0827,
  lng: 80.2707,
  address: "Optional address"
}
```

### Route Info
```javascript
{
  distance: 2.5,        // km
  duration: 10,         // minutes
  message: "2.5 km, 10 min"
}
```

### Nearby Vehicle
```javascript
{
  lat: 13.095,
  lng: 80.276,
  type: "car",
  name: "Vehicle DL-04-XX"
}
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Markers not showing | Check CSS import, icon paths |
| API errors | Verify key in `.env`, check quota |
| Map blank | Check network, browser console |
| Icons missing | Clear cache, rebuild with `npm run build` |
| Route not calculating | Verify coordinates are valid, API key set |

## 📱 Responsive Breakpoints

- **Mobile**: Full-screen map
- **Tablet**: Left sidebar optional
- **Desktop**: All controls visible

## ⚙️ Performance Tips

1. **Limit markers** - Cluster for >100 markers
2. **Simplify routes** - Use `simplifyPolyline()`
3. **Lazy load** - Load map only when needed
4. **Memoize** - Prevent unnecessary recalculations
5. **Debounce** - Limit API calls

## 📚 Documentation Links

| Document | Purpose |
|----------|---------|
| OPENSTREETMAP_SETUP.md | Quick start & setup |
| OPENSTREETMAP_INTEGRATION.md | Complete technical docs |
| MIGRATION_GUIDE.md | From Google Maps |
| mapUtils.js | Utility functions reference |

## 🔄 Update Flow

```
User Triggers Emergency
    ↓
Set ambulance location
    ↓
Set destination hospital
    ↓
Calculate route (OpenRouteService)
    ↓
Display route on map
    ↓
Show distance & ETA
    ↓
Start live simulation (optional)
    ↓
Update ambulance position every 2s
```

## ✅ Browser Support

- ✓ Chrome/Edge 88+
- ✓ Firefox 85+
- ✓ Safari 14+
- ✓ Mobile browsers

## 💾 Build & Deploy

```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Build
npm run preview

# Check size
npm run build  # Shows bundle size
```

## 🆘 Need Help?

1. **Setup issues?** → OPENSTREETMAP_SETUP.md
2. **How to use?** → OPENSTREETMAP_INTEGRATION.md
3. **From Google Maps?** → MIGRATION_GUIDE.md
4. **API reference?** → See component files
5. **Utility functions?** → mapUtils.js docs

## 🎓 Key Concepts

### Coordinates
- Format: `[latitude, longitude]` in Leaflet
- Range: lat (-90 to 90), lng (-180 to 180)
- Example: `[13.0827, 80.2707]` (Chennai)

### Distance Calculation
- Uses Haversine formula
- Returns kilometers
- Works for any two coordinates

### Route Calculation
- Primary: OpenRouteService API
- Fallback: Direct line distance
- Includes real-time traffic (when available)

### Simulation
- Moves ambulance along route
- Updates every 2 seconds
- Smoothly animates on map

## 📊 API Limits

| Service | Limit | Cost |
|---------|-------|------|
| OpenRouteService | 2500/day free | Free tier available |
| Nominatim | 1 req/s | Free |
| OpenStreetMap tiles | Unlimited | Free |

## 🚨 Important Notes

1. **API Key Required** - Get free key from OpenRouteService
2. **CSS Must Import** - `import 'leaflet/dist/leaflet.css'`
3. **Coordinates Format** - Arrays in Leaflet, objects in services
4. **Icon Fix Needed** - Vite requires special icon configuration
5. **Bundle Size** - Leaflet adds ~50KB (gzipped)

## 📝 Code Template

```jsx
import InteractiveMap from '@/components/InteractiveMap';
import { useAmbulanceTracking } from '@/hooks/useAmbulanceTracking';

export default function MyMapPage() {
  const ambulanceLocation = {lat: 13.0827, lng: 80.2707};
  const destinationLocation = {lat: 13.1000, lng: 80.3000};

  const {
    ambulanceLocation: curLoc,
    routePath,
    routeInfo,
    startLiveSimulation,
    isSimulating,
  } = useAmbulanceTracking(ambulanceLocation, destinationLocation);

  return (
    <div>
      <InteractiveMap
        ambulanceLocation={curLoc}
        destinationLocation={destinationLocation}
        routePath={routePath}
        routeInfo={routeInfo}
      />
      <button onClick={startLiveSimulation}>
        {isSimulating ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}
```

---

**Last Updated**: May 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅
