/**
 * InteractiveMap Component
 * Full-screen interactive map using React Leaflet and OpenStreetMap
 * Features: Ambulance tracking, destination marker, route visualization, pan/zoom controls
 */

import { useEffect, useRef, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { AlertTriangle, Navigation, Loader2, Clock, Route } from 'lucide-react';

// Fix Leaflet marker icon issues in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

// Custom icons for ambulance and destination
const createAmbulanceIcon = () =>
  L.divIcon({
    html: `
      <div class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyber-red to-red-600 rounded-full border-2 border-white shadow-lg animate-pulse">
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      </div>
    `,
    className: 'custom-ambulance-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

const createDestinationIcon = () =>
  L.divIcon({
    html: `
      <div class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-cyber-blue to-blue-600 rounded-full border-2 border-white shadow-lg">
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    className: 'custom-destination-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

const createVehicleIcon = () =>
  L.divIcon({
    html: `
      <div class="flex items-center justify-center w-6 h-6 bg-cyber-amber rounded-full border border-white shadow-md">
        <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.22.42-1.42 1.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 15c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm11 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
        </svg>
      </div>
    `,
    className: 'custom-vehicle-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });

export default function InteractiveMap({
  ambulanceLocation,
  destinationLocation,
  hospitalLocation,
  routePath,
  routeInfo,
  nearbyVehicles = [],
  showCorridor = false,
  isLoading = false,
  onMapClick = null,
  className = 'w-full h-screen',
}) {
  const mapRef = useRef(null);
  const [mapCenter] = useState(() => {
    const lat = parseFloat(import.meta.env.VITE_DEFAULT_CENTER_LAT || 13.0827);
    const lng = parseFloat(import.meta.env.VITE_DEFAULT_CENTER_LAT || 80.2707);
    return [lat, lng];
  });
  const defaultZoom = parseInt(import.meta.env.VITE_DEFAULT_ZOOM || 14);

  // Get center for map based on ambulance location
  const center = useMemo(() => {
    if (ambulanceLocation?.lat && ambulanceLocation?.lng) {
      return [ambulanceLocation.lat, ambulanceLocation.lng];
    }
    return mapCenter;
  }, [ambulanceLocation, mapCenter]);

  // Pan to ambulance location when it updates
  useEffect(() => {
    if (mapRef.current && ambulanceLocation?.lat && ambulanceLocation?.lng) {
      mapRef.current.setView([ambulanceLocation.lat, ambulanceLocation.lng], defaultZoom, {
        animate: true,
        duration: 1,
      });
    }
  }, [ambulanceLocation?.lat, ambulanceLocation?.lng]);

  return (
    <div className={`relative ${className} bg-cyber-black`}>
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={defaultZoom}
        style={{ width: '100%', height: '100%' }}
        className="leaflet-container z-0"
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Ambulance Location - Red pulsing marker */}
        {ambulanceLocation && (
          <Marker
            position={[ambulanceLocation.lat, ambulanceLocation.lng]}
            icon={createAmbulanceIcon()}
            eventHandlers={{
              click: () => {
                if (mapRef.current) {
                  mapRef.current.setView(
                    [ambulanceLocation.lat, ambulanceLocation.lng],
                    defaultZoom + 1,
                    { animate: true }
                  );
                }
              },
            }}
          >
            <Popup autoPan={false} maxWidth={300} className="custom-popup">
              <div className="text-sm space-y-2">
                <div className="font-bold text-cyber-red flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Ambulance Location
                </div>
                <div className="text-xs text-gray-400">
                  Lat: {ambulanceLocation.lat.toFixed(6)}
                  <br />
                  Lng: {ambulanceLocation.lng.toFixed(6)}
                </div>
                {ambulanceLocation.address && (
                  <div className="text-xs text-gray-300 border-t pt-1">
                    {ambulanceLocation.address}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination/Hospital Location - Blue marker */}
        {destinationLocation && (
          <Marker
            position={[destinationLocation.lat, destinationLocation.lng]}
            icon={createDestinationIcon()}
          >
            <Popup autoPan={false} maxWidth={300} className="custom-popup">
              <div className="text-sm space-y-2">
                <div className="font-bold text-cyber-blue flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Destination
                </div>
                <div className="text-xs text-gray-400">
                  {destinationLocation.name || 'Hospital / Destination'}
                </div>
                <div className="text-xs text-gray-400">
                  Lat: {destinationLocation.lat.toFixed(6)}
                  <br />
                  Lng: {destinationLocation.lng.toFixed(6)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Hospital Location (if different from destination) - Alternative marker */}
        {hospitalLocation &&
          !(
            hospitalLocation.lat === destinationLocation?.lat &&
            hospitalLocation.lng === destinationLocation?.lng
          ) && (
            <Marker position={[hospitalLocation.lat, hospitalLocation.lng]} icon={createDestinationIcon()}>
              <Popup autoPan={false} maxWidth={300} className="custom-popup">
                <div className="text-sm space-y-2">
                  <div className="font-bold text-cyber-blue">Hospital</div>
                  <div className="text-xs text-gray-400">{hospitalLocation.name}</div>
                  <div className="text-xs text-gray-400">
                    Lat: {hospitalLocation.lat.toFixed(6)}
                    <br />
                    Lng: {hospitalLocation.lng.toFixed(6)}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

        {/* Nearby Vehicles - Yellow markers */}
        {nearbyVehicles.map((vehicle, idx) => (
          <Marker key={`vehicle-${idx}`} position={[vehicle.lat, vehicle.lng]} icon={createVehicleIcon()}>
            <Popup autoPan={false} maxWidth={250} className="custom-popup">
              <div className="text-sm space-y-1">
                <div className="font-bold text-cyber-amber">{vehicle.type || 'Vehicle'}</div>
                <div className="text-xs text-gray-400">
                  {vehicle.name || `${vehicle.type} #${idx + 1}`}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route Path - Polyline */}
        {routePath && routePath.length > 1 && (
          <Polyline
            positions={routePath.map((coord) => [coord.lat, coord.lng])}
            color="#00ff88"
            weight={3}
            opacity={0.8}
            dashArray="5, 5"
            eventHandlers={{
              click: () => {
                console.log('Route clicked');
              },
            }}
          />
        )}

        {/* Green Corridor Visualization - Circle areas along route */}
        {showCorridor && ambulanceLocation && (
          <Circle
            center={[ambulanceLocation.lat, ambulanceLocation.lng]}
            radius={500}
            color="#00ff88"
            fill={true}
            fillColor="#00ff88"
            fillOpacity={0.1}
            weight={2}
            dashArray="5, 5"
          />
        )}
      </MapContainer>

      {/* Route Information Panel */}
      {routeInfo && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 z-10 bg-gradient-to-br from-cyber-panel to-cyber-dark border border-cyber-border rounded-lg p-4 shadow-lg"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyber-green">
              <Route className="w-4 h-4" />
              <span className="font-bold">{routeInfo.distance} km</span>
            </div>
            <div className="flex items-center gap-2 text-cyber-blue">
              <Clock className="w-4 h-4" />
              <span className="font-bold">{routeInfo.duration} min</span>
            </div>
            <div className="text-xs text-gray-400 border-t border-cyber-border pt-2">
              {routeInfo.message || 'Route calculated'}
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-cyber-blue animate-spin" />
            <span className="text-cyber-blue text-sm">Loading map...</span>
          </div>
        </motion.div>
      )}

      {/* Custom Leaflet styles */}
      <style>{`
        .leaflet-container {
          font-family: 'Rajdhani', system-ui, sans-serif;
        }

        .leaflet-popup-content-wrapper {
          background: rgba(15, 22, 41, 0.95);
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
        }

        .leaflet-popup-tip {
          background: rgba(15, 22, 41, 0.95);
          border: 1px solid rgba(0, 212, 255, 0.3);
        }

        .leaflet-popup-content {
          margin: 0;
          color: #8b9cb3;
        }

        .leaflet-control-zoom {
          border: 1px solid rgba(0, 212, 255, 0.3);
          border-radius: 8px;
          background: rgba(15, 22, 41, 0.8);
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.2);
        }

        .leaflet-control-zoom-in,
        .leaflet-control-zoom-out {
          background: rgba(30, 42, 69, 0.8);
          color: #00d4ff;
          font-weight: bold;
          border: 1px solid rgba(0, 212, 255, 0.3);
          transition: all 0.3s ease;
        }

        .leaflet-control-zoom-in:hover,
        .leaflet-control-zoom-out:hover {
          background: rgba(0, 212, 255, 0.2);
          color: #fff;
        }

        .leaflet-container a.leaflet-control-attribution,
        .leaflet-control-attribution {
          background: rgba(15, 22, 41, 0.8);
          color: #8b9cb3;
          font-size: 10px;
          border-radius: 4px;
          border: 1px solid rgba(0, 212, 255, 0.2);
        }

        .leaflet-container a.leaflet-control-attribution:hover {
          background: rgba(30, 42, 69, 0.9);
        }

        .custom-ambulance-icon {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 45, 85, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(255, 45, 85, 0);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
