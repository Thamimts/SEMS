import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 5000,
};

export function useGeolocation(options = {}, enabled = true) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const watchIdRef = useRef(null);
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const clearWatch = useCallback(() => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp,
        });
        setLoading(false);
        setError(null);
      },
      (err) => {
        const messages = {
          1: 'Location permission denied. Enable GPS in browser settings.',
          2: 'Location unavailable. Check device GPS.',
          3: 'Location request timed out.',
        };
        setError(messages[err.code] || err.message);
        setLoading(false);
      },
      opts
    );

    return clearWatch;
  }, [enabled, clearWatch, opts.enableHighAccuracy, opts.timeout, opts.maximumAge]);

  const refresh = useCallback(() => {
    if (!navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: pos.timestamp,
        });
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      opts
    );
  }, [opts]);

  return { position, error, loading, refresh, clearWatch };
}
