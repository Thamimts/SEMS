import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { getSocket, emitLocationUpdate } from '../services/socket';
import { locationAPI } from '../services/api';
import { useAuth } from './AuthContext';

const LocationContext = createContext(null);

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.display_name || null;
  } catch {
    return null;
  }
}

export const LocationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { position, error, loading, refresh } = useGeolocation({}, isAuthenticated);
  const [address, setAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const lastGeocodeRef = useRef({ lat: null, lng: null });
  const lastEmitRef = useRef(0);

  useEffect(() => {
    if (!position) return;

    const distMoved =
      lastGeocodeRef.current.lat != null
        ? Math.hypot(position.lat - lastGeocodeRef.current.lat, position.lng - lastGeocodeRef.current.lng)
        : 999;

    if (distMoved < 0.0005 && address) return;

    lastGeocodeRef.current = { lat: position.lat, lng: position.lng };
    setAddressLoading(true);

    const t = setTimeout(async () => {
      const name = await reverseGeocode(position.lat, position.lng);
      setAddress(name);
      setAddressLoading(false);
    }, 800);

    return () => clearTimeout(t);
  }, [position?.lat, position?.lng]);

  useEffect(() => {
    if (!position || !isAuthenticated) return;

    const now = Date.now();
    if (now - lastEmitRef.current < 5000) return;
    lastEmitRef.current = now;

    const payload = {
      lat: position.lat,
      lng: position.lng,
      accuracy: position.accuracy,
      heading: position.heading,
      speed: position.speed,
      timestamp: position.timestamp,
    };

    emitLocationUpdate(payload);
    locationAPI.update(payload).catch(() => {});
  }, [position, isAuthenticated]);

  const getCoords = useCallback(() => {
    if (position) return { lat: position.lat, lng: position.lng };
    return null;
  }, [position]);

  return (
    <LocationContext.Provider
      value={{
        position,
        coords: getCoords(),
        address,
        addressLoading,
        error,
        loading,
        refresh,
        isTracking: !!position && !error,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
};
