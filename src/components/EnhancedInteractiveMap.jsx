import { useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, Circle, InfoWindow } from '@react-google-maps/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Loader2, Zap, AlertTriangle } from 'lucide-react';

const mapContainerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 28.6139, lng: 77.209 };

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#0f1629' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0f1629' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8b9cb3' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e2a45' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#2a3a5c' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2a4060' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a1628' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  ],
};

export default function EnhancedInteractiveMap({
  center = defaultCenter,
  hospital,
  routePath,
  routeInfo,
  nearbyVehicles,
  showCorridor,
  isLoading,
  className,
  apiKey,
  ambulanceLocation,
  emergencyLevel,
}) {
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey });
  const mapRef = useRef(null);
  const pulseRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && center?.lat && center?.lng) {
      mapRef.current.panTo({ lat: center.lat, lng: center.lng });
    }
  }, [center?.lat, center?.lng]);

  const routeCoords =
    routePath && routePath.length > 0
      ? routePath
      : hospital
        ? [center, { lat: hospital.lat, lng: hospital.lng }]
        : [];

  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-cyber-dark ${className}`}>
        <p className="text-cyber-red text-sm">Failed to load Google Maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-cyber-dark ${className}`}>
        <Loader2 className="w-8 h-8 text-cyber-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className={className}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        options={mapOptions}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {/* Emergency Radius Circle with animation */}
        <Circle
          center={ambulanceLocation || center}
          radius={20}
          options={{
            fillColor: '#ff2d55',
            fillOpacity: 0.1,
            strokeColor: '#ff2d55',
            strokeOpacity: 0.3,
            strokeWeight: 2,
          }}
        />

        {/* Extended Warning Radius */}
        <Circle
          center={ambulanceLocation || center}
          radius={50}
          options={{
            fillColor: '#ff2d55',
            fillOpacity: 0.02,
            strokeColor: '#ff2d55',
            strokeOpacity: 0.15,
            strokeWeight: 1,
            strokeDasharray: [5, 5],
          }}
        />

        {/* Green Corridor Zones */}
        {showCorridor && routePath && routePath.length > 1 && (
          <Polyline
            path={routePath}
            options={{
              strokeColor: '#00ff88',
              strokeOpacity: 0.3,
              strokeWeight: 8,
              geodesic: true,
              zIndex: 0,
            }}
          />
        )}

        {/* Route Path with gradient effect */}
        {routeCoords.length > 1 && (
          <Polyline
            path={routeCoords}
            options={{
              strokeColor: '#00d4ff',
              strokeOpacity: 0.8,
              strokeWeight: 3,
              geodesic: true,
              zIndex: 1,
            }}
          />
        )}

        {/* Ambulance Marker with glow effect */}
        <Marker
          position={ambulanceLocation || center}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#ff2d55',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
            zIndex: 10,
          }}
        >
          <InfoWindow>
            <div className="bg-cyber-dark p-3 rounded-lg border border-cyber-red/40 text-white">
              <p className="font-bold text-cyber-red mb-1">Ambulance Status</p>
              <p className="text-xs">Speed: 65 km/h</p>
              <p className="text-xs">ETA: 18 minutes</p>
              <p className="text-xs">Emergency Level: {emergencyLevel}/5</p>
            </div>
          </InfoWindow>
        </Marker>

        {/* Hospital Destination */}
        {hospital && (
          <Marker
            position={{ lat: hospital.lat, lng: hospital.lng }}
            icon={{
              path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
              scale: 2,
              fillColor: '#00d4ff',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 1,
              anchor: new window.google.maps.Point(12, 24),
            }}
          >
            <InfoWindow>
              <div className="bg-cyber-dark p-3 rounded-lg border border-cyber-blue/40 text-white">
                <p className="font-bold text-cyber-blue mb-1">{hospital.name}</p>
                <p className="text-xs">Available Beds: 8</p>
                <p className="text-xs">ICU Ready: Yes</p>
                <p className="text-xs">Distance: {hospital.distance} km</p>
              </div>
            </InfoWindow>
          </Marker>
        )}

        {/* Nearby Vehicles with alert animation */}
        {nearbyVehicles &&
          nearbyVehicles.map((vehicle, idx) => (
            <Marker
              key={idx}
              position={{ lat: vehicle.lat, lng: vehicle.lng }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: vehicle.type === 'bike' ? '#ffb800' : '#8b5cf6',
                fillOpacity: 0.8,
                strokeColor: '#ffffff',
                strokeWeight: 1,
                zIndex: 5,
              }}
              title={vehicle.name}
            >
              <InfoWindow>
                <div className="bg-cyber-dark p-2 rounded-lg border border-white/20 text-white">
                  <p className="text-xs font-bold">{vehicle.name}</p>
                  <p className="text-[10px]">Alerted: Yes</p>
                  <p className="text-[10px]">Distance: ~15m</p>
                </div>
              </InfoWindow>
            </Marker>
          ))}
      </GoogleMap>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-cyber-dark/50 backdrop-blur-sm flex items-center justify-center rounded-lg"
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, linear: true }}>
                <Zap className="w-6 h-6 text-cyber-blue" />
              </motion.div>
              <p className="text-cyber-blue text-sm font-semibold">CALCULATING ROUTE...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
