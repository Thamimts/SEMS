# OpenStreetMap Integration Setup Guide

## Quick Start

### 1. Install Dependencies

The Leaflet and React Leaflet packages are already installed. If you need to reinstall:

```bash
npm install leaflet react-leaflet
```

### 2. Configure Environment Variables

Create or update your `.env` file:

```bash
# Copy from .env.example
cp .env.example .env

# Edit .env and add your OpenRouteService API key
```

**Example `.env`:**
```env
# OpenRouteService API Configuration
VITE_ORS_API_KEY=YOUR_API_KEY_HERE
VITE_ORS_API_URL=https://api.openrouteservice.org

# Map Configuration (Chennai by default)
VITE_DEFAULT_CENTER_LAT=13.0827
VITE_DEFAULT_CENTER_LNG=80.2707
VITE_DEFAULT_ZOOM=14

# API
VITE_API_URL=/api
```

### 3. Get OpenRouteService API Key

1. Visit [https://openrouteservice.org/](https://openrouteservice.org/)
2. Sign up for free account
3. Go to Dashboard → API Keys
4. Create a new API key
5. Add to `.env` file

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` and navigate to the Emergency Tracking page.

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── InteractiveMap.jsx           # Main map component (NEW)
│   ├── services/
│   │   └── routeService.js               # Route calculation (NEW)
│   ├── hooks/
│   │   └── useAmbulanceTracking.js      # Tracking hook (NEW)
│   ├── utils/
│   │   └── mapUtils.js                   # Map utilities (NEW)
│   ├── pages/
│   │   └── EmergencyTracking.jsx        # Updated with new map
│   └── ...
├── .env                                  # Configuration (NEW)
├── .env.example                          # Configuration template (UPDATED)
├── package.json                          # Updated with new deps
├── vite.config.js                        # Vite config
├── OPENSTREETMAP_INTEGRATION.md          # Full documentation (NEW)
└── OPENSTREETMAP_SETUP.md                # This file (NEW)
```

## New Components & Files

### Components
- **`InteractiveMap.jsx`** - Full-screen map with markers, popups, and route visualization

### Services
- **`routeService.js`** - OpenRouteService API integration for route calculation

### Hooks
- **`useAmbulanceTracking.js`** - State management for ambulance tracking and simulation
- **`useLiveLocationUpdates`** - Real-time location updates
- **`useLocationHistory`** - Location history tracking

### Utilities
- **`mapUtils.js`** - Helper functions for map operations

## Key Features

### 1. Interactive Map
- OpenStreetMap tiles with dark theme
- Smooth pan and zoom controls
- Responsive design for all screen sizes

### 2. Live Ambulance Tracking
- Red pulsing ambulance marker at current location
- Blue marker for destination/hospital
- Yellow markers for nearby vehicles
- Real-time location updates

### 3. Route Visualization
- Green polyline showing calculated route
- Distance and travel time display
- Automatic route recalculation

### 4. Live Simulation
- Move ambulance along route for demonstration
- Play/pause controls
- Smooth animation every 2 seconds

### 5. Green Corridor
- Circle overlay showing green corridor area
- Dynamic visibility based on emergency status

## Usage Examples

### Basic Map Usage

```jsx
import InteractiveMap from '@/components/InteractiveMap';

export default function MapPage() {
  return (
    <InteractiveMap
      ambulanceLocation={{ lat: 13.0827, lng: 80.2707 }}
      destinationLocation={{ lat: 13.1, lng: 80.3 }}
      routePath={[
        { lat: 13.0827, lng: 80.2707 },
        { lat: 13.1, lng: 80.3 }
      ]}
      routeInfo={{
        distance: 2.5,
        duration: 10,
        message: '2.5 km, 10 min'
      }}
    />
  );
}
```

### With Ambulance Tracking Hook

```jsx
import { useAmbulanceTracking } from '@/hooks/useAmbulanceTracking';
import InteractiveMap from '@/components/InteractiveMap';

export default function TrackingPage() {
  const initialLoc = { lat: 13.0827, lng: 80.2707 };
  const destLoc = { lat: 13.1, lng: 80.3 };

  const {
    ambulanceLocation,
    routePath,
    routeInfo,
    isSimulating,
    updateRoute,
    startLiveSimulation,
    stopLiveSimulation,
  } = useAmbulanceTracking(initialLoc, destLoc);

  return (
    <div>
      <InteractiveMap
        ambulanceLocation={ambulanceLocation}
        destinationLocation={destLoc}
        routePath={routePath}
        routeInfo={routeInfo}
      />
      
      <button onClick={updateRoute}>Recalculate Route</button>
      <button onClick={isSimulating ? stopLiveSimulation : startLiveSimulation}>
        {isSimulating ? 'Stop' : 'Start'} Simulation
      </button>
    </div>
  );
}
```

## Styling

### Dark Theme Colors
- Primary background: `#0a0e17`
- Panel background: `#141c2f`
- Border: `#1e2a45`
- Accent colors:
  - Red: `#ff2d55` (ambulance)
  - Blue: `#00d4ff` (destination)
  - Green: `#00ff88` (route)
  - Amber: `#ffb800` (vehicles)

### Custom CSS Classes
- `.leaflet-container` - Map container
- `.custom-ambulance-icon` - Ambulance marker (pulsing)
- `.custom-destination-icon` - Destination marker
- `.custom-vehicle-icon` - Vehicle marker
- `.custom-popup` - Map popup styling

## API Integration

### OpenRouteService

**Route Calculation:**
```javascript
import { calculateRoute } from '@/services/routeService';

const result = await calculateRoute(
  13.0827,  // start lat
  80.2707,  // start lng
  13.1,     // end lat
  80.3      // end lng
);

// result.distance (in km)
// result.duration (in minutes)
// result.coordinates (array of [lat, lng])
```

**Nominatim Reverse Geocoding:**
```javascript
import { reverseGeocode } from '@/services/routeService';

const address = await reverseGeocode(13.0827, 80.2707);
```

## Performance Tips

1. **Reduce marker count** - Use clustering for >100 markers
2. **Simplify routes** - Use `mapUtils.simplifyPolyline()` for long routes
3. **Lazy load map** - Load map component only when needed
4. **Memoize locations** - Prevent unnecessary recalculations
5. **Debounce updates** - Limit API calls with debouncing

## Troubleshooting

### Issue: Map shows blank/gray
**Solution:** 
- Check browser console for errors
- Ensure internet connection (for tiles)
- Clear browser cache and reload

### Issue: Markers not visible
**Solution:**
- Verify `ambulanceLocation`, `destinationLocation` have valid lat/lng
- Check z-index conflicts
- Ensure marker positions are within map bounds

### Issue: Route not calculating
**Solution:**
- Verify OpenRouteService API key in `.env`
- Check API key quota hasn't been exceeded
- Ensure coordinates are valid (lat: -90 to 90, lng: -180 to 180)
- Check browser console for network errors

### Issue: Slow map performance
**Solution:**
- Reduce number of markers/popups
- Simplify route polylines
- Disable animations if not needed
- Use leaflet-canvas-marker for many markers

## Development Workflow

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Emergency Tracking:**
   - `http://localhost:5173/emergency-tracking`

3. **Features to test:**
   - ✓ Map loads with markers
   - ✓ Route calculates and displays
   - ✓ Simulation starts/stops
   - ✓ Distance and time show correctly
   - ✓ Pan and zoom work smoothly

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview build:**
   ```bash
   npm run preview
   ```

## Browser Compatibility

- ✓ Chrome 88+
- ✓ Firefox 85+
- ✓ Safari 14+
- ✓ Edge 88+
- ✓ iOS Safari 14+
- ✓ Chrome Mobile

## Resources

- [Leaflet Documentation](https://leafletjs.com/)
- [React Leaflet Docs](https://react-leaflet.js.org/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [OpenRouteService API](https://openrouteservice.org/docs/)
- [Nominatim Search API](https://nominatim.org/release-docs/latest/api/)

## Getting Help

1. Check `OPENSTREETMAP_INTEGRATION.md` for detailed documentation
2. Review example usage in `EmergencyTracking.jsx`
3. Check map utility functions in `mapUtils.js`
4. Inspect browser console for error messages

## Next Steps

### To Add New Features:

1. **Traffic Layer:**
   ```jsx
   import { TileServers } from '@/utils/mapUtils';
   
   // Use TileServers.dark or TileServers.satellite
   <TileLayer url={TileServers.dark} />
   ```

2. **Marker Clustering:**
   ```bash
   npm install leaflet.markercluster
   ```

3. **Route Alternatives:**
   ```javascript
   // Use calculateRoute with additional options
   ```

4. **WebSocket Updates:**
   ```javascript
   // Use useLiveLocationUpdates hook
   const { isConnected, lastUpdate } = useLiveLocationUpdates(onUpdate);
   ```

## Contributing

When adding new map features:
1. Add new functions to `mapUtils.js`
2. Create new hooks in `src/hooks/` if needed
3. Update documentation in `OPENSTREETMAP_INTEGRATION.md`
4. Test on mobile and desktop
5. Ensure theme colors match existing design

## Support

For issues or questions:
1. Review documentation files
2. Check existing GitHub issues
3. Consult OpenRouteService and Leaflet docs
4. Test in development mode first

---

**Last Updated:** 2024
**Version:** 1.0.0
