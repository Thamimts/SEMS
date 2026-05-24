/**
 * Hook: useAmbulanceTracking
 * Manages ambulance location, route, and live location updates with simulation
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateRoute } from '../services/routeService';

export const useAmbulanceTracking = (initialLocation, destinationLocation) => {
  const [ambulanceLocation, setAmbulanceLocation] = useState(initialLocation);
  const [routePath, setRoutePath] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationIntervalRef = useRef(null);
  const currentRouteIndexRef = useRef(0);

  /**
   * Calculate route and update route info
   */
  const updateRoute = useCallback(async () => {
    if (!ambulanceLocation || !destinationLocation) return;

    setIsCalculatingRoute(true);
    try {
      const route = await calculateRoute(
        ambulanceLocation.lat,
        ambulanceLocation.lng,
        destinationLocation.lat,
        destinationLocation.lng
      );

      if (route.success || route.fallback) {
        setRoutePath(route.coordinates);
        setRouteInfo({
          distance: route.distance,
          duration: route.duration,
          message: route.message,
        });
      }
    } catch (error) {
      console.error('Failed to calculate route:', error);
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [ambulanceLocation, destinationLocation]);

  /**
   * Start live location simulation (ambulance movement along route)
   */
  const startLiveSimulation = useCallback(() => {
    if (isSimulating || routePath.length < 2) {
      console.warn('Cannot start simulation. Route not ready.');
      return;
    }

    setIsSimulating(true);
    currentRouteIndexRef.current = 0;

    // Simulate ambulance movement along the route every 2 seconds
    simulationIntervalRef.current = setInterval(() => {
      setAmbulanceLocation((prev) => {
        const nextIndex = currentRouteIndexRef.current + 1;

        if (nextIndex >= routePath.length) {
          // Reached destination
          clearInterval(simulationIntervalRef.current);
          setIsSimulating(false);
          return prev;
        }

        currentRouteIndexRef.current = nextIndex;
        const nextCoord = routePath[nextIndex];

        return {
          lat: nextCoord[0],
          lng: nextCoord[1],
          address: prev.address,
        };
      });
    }, 2000); // Update every 2 seconds
  }, [isSimulating, routePath]);

  /**
   * Stop live location simulation
   */
  const stopLiveSimulation = useCallback(() => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsSimulating(false);
    currentRouteIndexRef.current = 0;
  }, []);

  /**
   * Reset ambulance to initial location
   */
  const resetLocation = useCallback(() => {
    stopLiveSimulation();
    setAmbulanceLocation(initialLocation);
    setRoutePath([]);
    setRouteInfo(null);
    currentRouteIndexRef.current = 0;
  }, [initialLocation, stopLiveSimulation]);

  /**
   * Manually update ambulance location
   */
  const setManualLocation = useCallback((lat, lng, address = null) => {
    stopLiveSimulation();
    setAmbulanceLocation({
      lat,
      lng,
      address,
    });
  }, [stopLiveSimulation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  return {
    ambulanceLocation,
    routePath,
    routeInfo,
    isCalculatingRoute,
    isSimulating,
    updateRoute,
    startLiveSimulation,
    stopLiveSimulation,
    resetLocation,
    setManualLocation,
  };
};

/**
 * Hook: useLiveLocationUpdates
 * Manages real-time location updates from WebSocket or polling
 */
export const useLiveLocationUpdates = (onLocationUpdate) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // In a real application, this would connect to a WebSocket
    // For now, we'll simulate periodic location updates
    const interval = setInterval(() => {
      // Simulate location update
      const randomLat = 13.0827 + (Math.random() - 0.5) * 0.05;
      const randomLng = 80.2707 + (Math.random() - 0.5) * 0.05;

      const update = {
        lat: randomLat,
        lng: randomLng,
        timestamp: new Date().toISOString(),
      };

      setLastUpdate(update);
      onLocationUpdate?.(update);
    }, 5000); // Update every 5 seconds

    setIsConnected(true);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [onLocationUpdate]);

  return {
    isConnected,
    lastUpdate,
  };
};

/**
 * Hook: useLocationHistory
 * Maintains a history of ambulance locations for visualization
 */
export const useLocationHistory = (maxHistory = 50) => {
  const [history, setHistory] = useState([]);

  const addLocation = useCallback((location) => {
    setHistory((prev) => {
      const newHistory = [location, ...prev];
      // Keep only last maxHistory items
      return newHistory.slice(0, maxHistory);
    });
  }, [maxHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addLocation,
    clearHistory,
  };
};
