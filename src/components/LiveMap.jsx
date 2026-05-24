import { useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, Circle } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { MapPin, Loader2 } from 'lucide-react';

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

function GoogleMapView({
  center,
  hospital,
  routePath,
  showCorridor,
  nearbyVehicles,
  className,
  apiKey,
}) {
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: apiKey });
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && center?.lat && center?.lng) {
      mapRef.current.panTo({ lat: center.lat, lng: center.lng });
    }
  }, [center?.lat, center?.lng]);

  const routeCoords =
    routePath.length > 0
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
        <Marker
          position={center}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#ff2d55',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2,
          }}
        />
        {hospital && (
          <Marker
            position={{ lat: hospital.lat, lng: hospital.lng }}
            icon={{
              path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 6,
              fillColor: '#00d4ff',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 1,
            }}
          />
        )}
        {routeCoords.length > 1 && (
          <Polyline
            path={routeCoords}
            options={{
              strokeColor: showCorridor ? '#00ff88' : '#00d4ff',
              strokeOpacity: 0.9,
              strokeWeight: 5,
            }}
          />
        )}
        {showCorridor && (
          <Circle
            center={center}
            radius={200}
            options={{
              fillColor: '#00ff88',
              fillOpacity: 0.08,
              strokeColor: '#00ff88',
              strokeOpacity: 0.4,
              strokeWeight: 2,
            }}
          />
        )}
        {nearbyVehicles.map((v, i) => (
          <Marker
            key={i}
            position={{ lat: v.lat, lng: v.lng }}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 5,
              fillColor: '#ffb800',
              fillOpacity: 0.8,
              strokeColor: '#fff',
              strokeWeight: 1,
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

export default function LiveMap({
  center = defaultCenter,
  hospital,
  routePath = [],
  showCorridor = false,
  nearbyVehicles = [],
  className = '',
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className={`relative bg-cyber-dark grid-bg flex items-center justify-center ${className}`}>
        <div className="text-center p-4 sm:p-8 max-w-lg w-full">
          <MapPin className="w-10 h-10 text-cyber-blue mx-auto mb-3 opacity-50" />
          <h3 className="font-display text-base sm:text-lg mb-2">Map Preview Mode</h3>
          <p className="text-xs sm:text-sm text-white/40 mb-4">
            Add <code className="text-cyber-blue">VITE_GOOGLE_MAPS_API_KEY</code> in .env for live maps.
          </p>
          <MockMapVisualization
            center={center}
            hospital={hospital}
            showCorridor={showCorridor}
            nearbyVehicles={nearbyVehicles}
          />
        </div>
      </div>
    );
  }

  return (
    <GoogleMapView
      center={center}
      hospital={hospital}
      routePath={routePath}
      showCorridor={showCorridor}
      nearbyVehicles={nearbyVehicles}
      className={className}
      apiKey={apiKey}
    />
  );
}

function MockMapVisualization({ center, hospital, showCorridor, nearbyVehicles }) {
  const defaults = [
    { offsetX: 150, offsetY: 100 },
    { offsetX: 220, offsetY: 150 },
  ];
  const vehicles = nearbyVehicles.length ? nearbyVehicles : defaults;

  return (
    <div className="relative w-full aspect-video rounded-2xl border border-cyber-blue/20 overflow-hidden bg-cyber-panel">
      <svg viewBox="0 0 400 240" className="w-full h-full">
        {[...Array(8)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 30} x2="400" y2={i * 30} stroke="#1e2a45" strokeWidth="1" />
        ))}
        {[...Array(12)].map((_, i) => (
          <line key={`v${i}`} x1={i * 35} y1="0" x2={i * 35} y2="240" stroke="#1e2a45" strokeWidth="1" />
        ))}

        {showCorridor && (
          <motion.path
            d="M 80 180 Q 200 120 320 60"
            fill="none"
            stroke="#00ff88"
            strokeWidth="4"
            strokeDasharray="8 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <path d="M 80 180 Q 200 120 320 60" fill="none" stroke="#00d4ff" strokeWidth="3" opacity="0.6" />

        {hospital && (
          <g transform="translate(300, 50)">
            <rect x="-12" y="-12" width="24" height="24" rx="4" fill="#00d4ff" opacity="0.3" />
            <text textAnchor="middle" y="4" fill="#00d4ff" fontSize="10" fontFamily="monospace">
              H
            </text>
          </g>
        )}

        <motion.g
          animate={{ x: [0, 5, 0], y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <circle cx="80" cy="180" r="10" fill="#ff2d55" />
        </motion.g>

        {vehicles.map((v, i) => (
          <circle
            key={i}
            cx={v.offsetX ?? 150 + i * 40}
            cy={v.offsetY ?? 100 + i * 30}
            r="5"
            fill="#ffb800"
          />
        ))}
      </svg>
      <div className="absolute bottom-2 left-2 text-[10px] font-mono text-white/30">
        {center.lat?.toFixed(4)}, {center.lng?.toFixed(4)}
      </div>
    </div>
  );
}
