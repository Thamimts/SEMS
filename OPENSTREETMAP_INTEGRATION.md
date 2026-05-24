# OpenStreetMap Integration Guide

## Overview

This document provides comprehensive information about the OpenStreetMap integration with React Leaflet in the Smart Emergency Mode System for Ambulance and Personal Cars.

## Architecture

### Components

#### 1. **InteractiveMap.jsx** (`src/components/InteractiveMap.jsx`)
The main map component using React Leaflet and OpenStreetMap tiles.

**Features:**
- Full-screen interactive map
- Custom markers for ambulance (red pulsing), destination (blue), and nearby vehicles (yellow)
- Route visualization with polyline
- Green corridor visualization using circle overlays
- Route information panel showing distance and travel time
- Smooth pan and zoom controls
- Custom styled popups matching the cyberpunk theme
- Loading state management

**Props:**
```jsx
<InteractiveMap
  ambulanceLocation={{lat: 13.0827, lng: 80.2707}}        // Current ambulance position
  destinationLocation={{lat: 13.1, lng: 80.3}}            // Hospital/destination position
  hospitalLocation={{lat: 13.1, lng: 80.3, name: "..."}} // Hospital details
  routePath={[{lat, lng}, ...]}                           // Array of route coordinates
  routeInfo={{distance: 2.5, duration: 10, message: "..."}} // Route details
  nearbyVehicles={[...]}                                  // Array of nearby vehicle locations
  showCorridor={true}                                     // Show green corridor visualization
  isLoading={false}                                       // Loading state
  className="w-full h-screen"                             // Custom CSS classes
/>
```

### Services

#### 2. **routeService.js** (`src/services/routeService.js`)
Handles route calculation, distance, and travel time using OpenRouteService API.

**Key Functions:**

- **`calculateRoute(startLat, startLng, endLat, endLng)`**
  - Calculates optimal route between two points
  - Returns: `{success, coordinates, distance, duration, message}`
  - Fallback: Direct line calculation if API unavailable

- **`calculateMultiPointRoute(coordinates)`**
  - Multi-waypoint routing support
  - Useful for routes with intermediate stops

- **`reverseGeocode(lat, lng)`**
  - Convert coordinates to address strings
  - Uses Nominatim (OSM) reverse geocoding

### Hooks

#### 3. **useAmbulanceTracking.js** (`src/hooks/useAmbulanceTracking.js`)

**`useAmbulanceTracking(initialLocation, destinationLocation)`**
- Manages ambulance location, route calculation, and live tracking
- Features:
  - Route calculation on location change
  - Live location simulation along route
  - Manual location updates
  - Route reset functionality

```jsx
const {
  ambulanceLocation,           // Current ambulance position
  routePath,                   // Full route coordinates
  routeInfo,                   // Distance & duration
  isCalculatingRoute,          // Loading state
  isSimulating,                // Simulation status
  updateRoute,                 // Recalculate route
  startLiveSimulation,         // Start ambulance movement
  stopLiveSimulation,          // Stop ambulance movement
  resetLocation,               // Reset to initial position
  setManualLocation,           // Set position manually
} = useAmbulanceTracking(initLoc, destLoc);
```

**`useLiveLocationUpdates(onLocationUpdate)`**
- Manages real-time location updates from WebSocket/API
- Integrates with backend location streaming

**`useLocationHistory(maxHistory)`**
- Maintains historical location data for visualization
- Configurable history size (default: 50)

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# OpenRouteService API Configuration
VITE_ORS_API_KEY=your_openrouteservice_api_key_here
VITE_ORS_API_URL=https://api.openrouteservice.org

# Map Configuration (Chennai, India by default)
VITE_DEFAULT_CENTER_LAT=13.0827
VITE_DEFAULT_CENTER_LNG=80.2707
VITE_DEFAULT_ZOOM=14

# Backend API
VITE_API_URL=/api
```

### Getting an OpenRouteService API Key

1. Visit [OpenRouteService](https://openrouteservice.org/)
2. Sign up for a free account
3. Navigate to your dashboard and create an API key
4. Add the key to your `.env` file

## Integration with Existing Components

### EmergencyTracking Page

The `EmergencyTracking.jsx` page has been updated to use the new map:

```jsx
import InteractiveMap from '../components/InteractiveMap';
import { useAmbulanceTracking } from '../hooks/useAmbulanceTracking';

// Inside component:
const {
  ambulanceLocation,
  routePath,
  routeInfo,
  isCalculatingRoute,
  isSimulating,
  updateRoute,
  startLiveSimulation,
  stopLiveSimulation,
} = useAmbulanceTracking(initialLocation, destinationLocation);

// Render map with all props
<InteractiveMap
  ambulanceLocation={ambulanceLocation}
  destinationLocation={destinationLocation}
  hospitalLocation={hospital}
  routePath={routePath}
  routeInfo={routeInfo}
  nearbyVehicles={MOCK_NEARBY}
  showCorridor={greenCorridor}
  isLoading={isCalculatingRoute}
/>
```

## Live Tracking Features

### Ambulance Movement Simulation

The system includes a built-in ambulance movement simulator that moves the ambulance along the calculated route:

```javascript
// Start simulation
startLiveSimulation();

// Stop simulation
stopLiveSimulation();

// Manual location update
setManualLocation(lat, lng, address);
```

The simulation moves the ambulance every 2 seconds along the route path, providing realistic movement visualization.

### Route Calculation Flow

1. User initiates emergency
2. Ambulance location and destination hospital are set
3. Route is automatically calculated using OpenRouteService API
4. Route information (distance, duration) is displayed
5. Optional: Start live simulation to show ambulance movement
6. Markers update in real-time on the map

## Styling & Theme

The map components follow the existing cyberpunk theme:

- **Colors:**
  - Ambulance: Red (`#ff2d55`) with pulse animation
  - Destination: Blue (`#00d4ff`)
  - Route: Green (`#00ff88`)
  - Nearby vehicles: Amber (`#ffb800`)

- **Styling Features:**
  - Custom styled popups with border and glow effects
  - Responsive zoom controls with custom styling
  - Dark theme tiles matching the application
  - Attribution styling aligned with theme

## Marker Icons

### Custom Icon Creation

Leaflet marker icon issues in Vite are fixed by:

1. Importing leaflet CSS: `import 'leaflet/dist/leaflet.css'`
2. Configuring default icon paths:
   ```javascript
   import L from 'leaflet';
   
   delete L.Icon.Default.prototype._getIconUrl;
   L.Icon.Default.mergeOptions({
     iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
     iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
     shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
   });
   ```

3. Creating custom div-based icons:
   ```javascript
   const createCustomIcon = () => 
     L.divIcon({
       html: `<div class="custom-marker">...</div>`,
       className: 'custom-icon',
       iconSize: [32, 32],
       iconAnchor: [16, 16],
       popupAnchor: [0, -16],
     });
   ```

## API Integration

### OpenRouteService API

**Endpoint:** `POST https://api.openrouteservice.org/v2/directions/driving-car`

**Request:**
```javascript
{
  "coordinates": [[lng1, lat1], [lng2, lat2]],
  "radiuses": [20]
}
```

**Response:**
```javascript
{
  "routes": [{
    "geometry": {"coordinates": [...]},
    "distance": 2500,  // meters
    "duration": 600    // seconds
  }]
}
```

### Nominatim Reverse Geocoding

**Endpoint:** `GET https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lng}&format=json`

Returns address information for coordinates.

## Performance Optimization

### Memo Optimization
- Map center calculation is memoized to prevent unnecessary re-renders
- Route calculations are debounced to avoid excessive API calls

### Lazy Loading
- Leaflet components are only rendered when map container is ready
- Marker popups use `autoPan={false}` to improve performance

### State Management
- Location updates trigger minimal component re-renders
- Route path only updates when destination changes
- Simulation updates use interval callbacks for efficiency

## Troubleshooting

### Issue: Marker icons not showing
**Solution:** Ensure Leaflet CSS is imported and icon paths are correctly configured using `import.meta.url`

### Issue: OpenRouteService API errors
**Solution:** 
- Verify API key is valid and has sufficient quota
- Check network connectivity
- Enable fallback direct line calculation

### Issue: Map not loading in Vite
**Solution:**
- Clear Vite cache: `rm -rf .vite` or `del /s .vite` (Windows)
- Ensure all required CSS is imported
- Check browser console for CORS or import errors

### Issue: Markers cluster together
**Solution:** Use custom clustering library (e.g., Leaflet.markercluster) for large datasets

## Future Enhancements

1. **Clustering:** Add marker clustering for multiple nearby vehicles
2. **Traffic Layer:** Integrate traffic flow visualization
3. **Offline Mode:** Cache tiles and routes for offline capability
4. **Analytics:** Track and visualize historical route data
5. **WebSocket Integration:** Real-time location updates from backend
6. **Route Alternatives:** Show multiple route options to user
7. **Traffic-Aware Routing:** Integrate traffic data into route calculation
8. **Accessibility:** Add keyboard navigation and screen reader support

## Testing

### Manual Testing Checklist

- [ ] Map loads with default Chennai center
- [ ] Ambulance marker appears and is pulsing
- [ ] Destination marker appears in blue
- [ ] Route is calculated and displayed
- [ ] Distance and duration are shown in info panel
- [ ] Simulation starts/pauses correctly
- [ ] Nearby vehicles appear as yellow markers
- [ ] Green corridor circle appears when enabled
- [ ] Popups display correct information
- [ ] Pan and zoom controls work smoothly
- [ ] Map is responsive on mobile

### Environment Testing

- [ ] Works in development (Vite dev server)
- [ ] Works in production build
- [ ] API key correctly loaded from .env
- [ ] Fallback calculation works without API key

## File Structure

```
src/
├── components/
│   └── InteractiveMap.jsx          # Main map component
├── services/
│   └── routeService.js              # Route calculation service
├── hooks/
│   └── useAmbulanceTracking.js      # Ambulance tracking hook
└── pages/
    └── EmergencyTracking.jsx        # Updated emergency tracking page
```

## Dependencies

- **leaflet** (^1.9.0): Core mapping library
- **react-leaflet** (^4.2.1): React wrapper for Leaflet
- **framer-motion**: Already installed, used for animations
- **lucide-react**: Already installed, used for icons

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## References

- [Leaflet Documentation](https://leafletjs.com/)
- [React Leaflet Documentation](https://react-leaflet.js.org/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [OpenRouteService API Docs](https://openrouteservice.org/docs/)
- [Nominatim Documentation](https://nominatim.org/release-docs/latest/api/)

## License

This integration maintains the same license as the parent project.
