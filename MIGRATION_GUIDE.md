# Migration Guide: Google Maps → OpenStreetMap

This guide helps developers migrate from Google Maps to OpenStreetMap in the Smart Emergency Mode System.

## Overview

- **Old:** Google Maps API (`@react-google-maps/api`)
- **New:** OpenStreetMap + React Leaflet (`leaflet`, `react-leaflet`)
- **Routing:** OpenRouteService (free alternative to Google Maps Directions)

## Key Changes

### 1. Component Replacement

**Old Code (Google Maps):**
```jsx
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

export default function LiveMap({ center, hospital, routePath }) {
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: apiKey });
  
  return (
    <GoogleMap center={center} zoom={14} >
      <Marker position={center} />
    </GoogleMap>
  );
}
```

**New Code (OpenStreetMap):**
```jsx
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import InteractiveMap from '@/components/InteractiveMap';

export default function EmergencyTracking() {
  return (
    <InteractiveMap
      ambulanceLocation={ambulanceLocation}
      destinationLocation={destinationLocation}
      routePath={routePath}
      routeInfo={routeInfo}
    />
  );
}
```

### 2. Dependencies

**Old:**
```json
{
  "@react-google-maps/api": "^2.20.6"
}
```

**New:**
```json
{
  "leaflet": "^1.9.x",
  "react-leaflet": "^4.2.1"
}
```

**To Update:**
```bash
# Remove old dependency
npm uninstall @react-google-maps/api

# Install new dependencies
npm install leaflet react-leaflet
```

### 3. Environment Variables

**Old `.env`:**
```env
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

**New `.env`:**
```env
VITE_ORS_API_KEY=your_openrouteservice_key
VITE_DEFAULT_CENTER_LAT=13.0827
VITE_DEFAULT_CENTER_LNG=80.2707
VITE_DEFAULT_ZOOM=14
```

### 4. Marker Handling

**Old (Google Maps Icons):**
```jsx
<Marker
  position={center}
  icon={{
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 10,
    fillColor: '#ff2d55',
  }}
/>
```

**New (Leaflet divIcon):**
```jsx
const createAmbulanceIcon = () =>
  L.divIcon({
    html: `<div class="bg-red-500">🚑</div>`,
    className: 'custom-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

<Marker position={[lat, lng]} icon={createAmbulanceIcon()} />
```

### 5. Route Calculation

**Old (Google Maps Directions):**
```jsx
import { DirectionsService } from '@react-google-maps/api';
// Complex DirectionsService component setup
```

**New (OpenRouteService):**
```jsx
import { calculateRoute } from '@/services/routeService';

const result = await calculateRoute(
  startLat, startLng,
  endLat, endLng
);
// result: { distance, duration, coordinates }
```

### 6. Live Tracking Integration

**Old Approach:**
- Manual WebSocket integration needed
- Google Maps update for each location

**New Approach:**
```jsx
import { useAmbulanceTracking } from '@/hooks/useAmbulanceTracking';

const {
  ambulanceLocation,
  routePath,
  routeInfo,
  isSimulating,
  startLiveSimulation,
  stopLiveSimulation,
  updateRoute,
} = useAmbulanceTracking(initialLocation, destination);
```

## Component API Comparison

### Marker Styling

| Feature | Google Maps | OpenStreetMap |
|---------|-------------|---------------|
| Basic Marker | `<Marker position={center} />` | `<Marker position={[lat, lng]} />` |
| Custom Icon | `icon={{...}}` object | `L.divIcon({...})` |
| Popup | `<InfoWindow>` | `<Popup>` |
| Custom HTML | Limited | Full HTML support |
| Animation | Native | CSS-based |

### Map Container

| Feature | Google Maps | OpenStreetMap |
|---------|-------------|---------------|
| Container | `<GoogleMap mapContainerStyle={{...}} />` | `<MapContainer style={{...}} />` |
| Controls | Prop-based | Native Leaflet controls |
| Styling | Google API styles | Custom CSS |
| Attribution | Automatic | Customizable |

### Coordinate Format

| Library | Format | Example |
|---------|--------|---------|
| Google Maps | `{lat: 13, lng: 80}` | Object |
| React Leaflet | `[lat, lng]` | Array |

## Common Migration Patterns

### Pattern 1: Converting a Marker Component

**Before:**
```jsx
<Marker position={center} />
```

**After:**
```jsx
<Marker position={[center.lat, center.lng]} />
```

### Pattern 2: Converting Polyline Routes

**Before:**
```jsx
<Polyline path={routePath} options={{strokeColor: '#ff2d55'}} />
```

**After:**
```jsx
<Polyline
  positions={routePath.map(p => [p.lat, p.lng])}
  color="#ff2d55"
  weight={3}
/>
```

### Pattern 3: Converting InfoWindows to Popups

**Before:**
```jsx
<Marker position={center}>
  <InfoWindow>
    <div>Hospital Name</div>
  </InfoWindow>
</Marker>
```

**After:**
```jsx
<Marker position={[center.lat, center.lng]}>
  <Popup>
    <div>Hospital Name</div>
  </Popup>
</Marker>
```

### Pattern 4: Map Reference Access

**Before:**
```jsx
const mapRef = useRef();
<GoogleMap onLoad={(map) => { mapRef.current = map; }} />
mapRef.current.panTo(newCenter);
```

**After:**
```jsx
const mapRef = useRef();
<MapContainer ref={mapRef}>...</MapContainer>
mapRef.current.setView([lat, lng], zoom);
```

## API Endpoint Changes

### Directions/Routes

**Google Maps:**
```
https://maps.googleapis.com/maps/api/directions/json
```

**OpenRouteService:**
```
https://api.openrouteservice.org/v2/directions/driving-car
```

### Geocoding

**Google Maps:**
```
https://maps.googleapis.com/maps/api/geocode/json
```

**Nominatim (OSM):**
```
https://nominatim.openstreetmap.org/reverse
```

## CSS Import Changes

**Old (not needed):**
```javascript
// Google Maps CSS loaded automatically
```

**New (Required!):**
```javascript
import 'leaflet/dist/leaflet.css';
```

## Icon Issues in Vite

The old project structure may need Leaflet icon fixes:

```javascript
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icon URLs for Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});
```

This is already handled in `InteractiveMap.jsx`.

## Testing Checklist

- [ ] Map loads without Google Maps API key
- [ ] Markers display correctly with custom icons
- [ ] Popups show information properly
- [ ] Routes calculate and display
- [ ] Zoom and pan work smoothly
- [ ] Ambulance simulation works
- [ ] Dark theme applied correctly
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] Build size acceptable

## Performance Comparison

| Metric | Google Maps | OpenStreetMap |
|--------|-------------|---------------|
| Initial Load | ~150 KB | ~50 KB (Leaflet) |
| Vendor Lock-in | Yes | No |
| API Cost | Paid | Free |
| Customization | Limited | Extensive |
| Offline Support | No | Yes (with caching) |

## Troubleshooting Migration Issues

### Issue: "Cannot read property 'maps' of undefined"
**Cause:** Still using Google Maps code
**Solution:** Replace all `google.maps.*` with Leaflet equivalents

### Issue: Markers showing at wrong locations
**Cause:** Forgetting to convert from `{lat, lng}` to `[lat, lng]`
**Solution:** Use array format consistently

### Issue: "Leaflet CSS not loaded"
**Cause:** Missing CSS import
**Solution:** Add `import 'leaflet/dist/leaflet.css'` at top of component

### Issue: Icons not displaying
**Cause:** Icon path issues with Vite
**Solution:** Use the icon fix code provided above

## Getting Help

1. Review `OPENSTREETMAP_INTEGRATION.md` for detailed documentation
2. Check `src/components/InteractiveMap.jsx` for implementation example
3. Review `src/services/routeService.js` for routing implementation
4. Check `src/hooks/useAmbulanceTracking.js` for tracking logic

## Rollback Plan

If you need to revert to Google Maps:

```bash
# Restore from git
git checkout HEAD~1 -- src/pages/EmergencyTracking.jsx src/components/LiveMap.jsx

# Reinstall Google Maps
npm install @react-google-maps/api

# Remove new packages (optional)
npm uninstall leaflet react-leaflet
```

## Additional Resources

- [Leaflet Documentation](https://leafletjs.com/reference.html)
- [React Leaflet Docs](https://react-leaflet.js.org/)
- [OpenRouteService API](https://openrouteservice.org/docs/)
- [Nominatim Documentation](https://nominatim.org/release-docs/latest/api/)

## Feedback

If you encounter issues during migration:
1. Check browser console for error messages
2. Verify `.env` file has correct API keys
3. Inspect network tab for API failures
4. Review component props and data formats

---

**Last Updated:** May 2024
**Migration Level:** Intermediate
