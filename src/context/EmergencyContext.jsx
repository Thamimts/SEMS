import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSocket, SOCKET_EVENTS } from '../services/socket';
import { emergencyAPI, hospitalAPI } from '../services/api';

const EmergencyContext = createContext(null);

const MOCK_HOSPITALS = [
  { id: 1, name: 'Apollo Emergency Care', distance: 2.4, eta: 6, beds: 12, rating: 4.8, lat: 28.6139, lng: 77.209 },
  { id: 2, name: 'Max Super Specialty', distance: 3.1, eta: 9, beds: 8, rating: 4.6, lat: 28.6289, lng: 77.2065 },
  { id: 3, name: 'AIIMS Trauma Center', distance: 4.2, eta: 12, beds: 24, rating: 4.9, lat: 28.5672, lng: 77.21 },
];

export const EmergencyProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [hospitals, setHospitals] = useState(MOCK_HOSPITALS);
  const [trafficDensity, setTrafficDensity] = useState(62);
  const [v2xStatus, setV2xStatus] = useState({ connected: true, nodes: 847, latency: 12 });
  const [connectedVehicles, setConnectedVehicles] = useState(1247);
  const [nearbyAlerts, setNearbyAlerts] = useState([]);
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const [alertDistance, setAlertDistance] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [greenCorridor, setGreenCorridor] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handlers = {
      [SOCKET_EVENTS.EMERGENCY_ACTIVATED]: (data) => {
        setIsActive(true);
        setEmergencyData(data);
        setCountdown(data?.countdown ?? 300);
      },
      [SOCKET_EVENTS.EMERGENCY_UPDATE]: (data) => setEmergencyData((p) => ({ ...p, ...data })),
      [SOCKET_EVENTS.EMERGENCY_DEACTIVATED]: () => {
        setIsActive(false);
        setEmergencyData(null);
        setCountdown(null);
        setGreenCorridor(false);
      },
      [SOCKET_EVENTS.TRAFFIC_UPDATE]: (data) => setTrafficDensity(data?.density ?? 50),
      [SOCKET_EVENTS.V2X_ALERT]: (data) => {
        setNearbyAlerts((prev) => [data, ...prev].slice(0, 10));
      },
      [SOCKET_EVENTS.NEARBY_VEHICLE_ALERT]: (data) => {
        setShowAlertPopup(true);
        setAlertDistance(data?.distance ?? 150);
        setTimeout(() => setShowAlertPopup(false), 8000);
      },
      [SOCKET_EVENTS.GREEN_CORRIDOR]: () => setGreenCorridor(true),
      [SOCKET_EVENTS.CONNECTED_VEHICLES]: (data) => setConnectedVehicles(data?.count ?? 0),
    };

    const entries = Object.entries(handlers);
    entries.forEach(([event, handler]) => socket.on(event, handler));
    return () => entries.forEach(([event, handler]) => socket.off(event, handler));
  }, []);

  useEffect(() => {
    if (!isActive) return;
    const t = setInterval(() => setCountdown((c) => (c != null && c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [isActive]);

  const activateEmergency = useCallback(async (payload = {}) => {
    try {
      const { data } = await emergencyAPI.activate(payload);
      setIsActive(true);
      setEmergencyData(data);
      setCountdown(data?.countdown ?? 300);
      setGreenCorridor(true);
      return data;
    } catch {
      const mock = {
        id: `EMG-${Date.now()}`,
        status: 'active',
        type: payload.type || 'medical',
        activatedAt: new Date().toISOString(),
        countdown: 300,
        location: payload.location || { lat: 28.6139, lng: 77.209 },
      };
      setIsActive(true);
      setEmergencyData(mock);
      setCountdown(300);
      setGreenCorridor(true);
      return mock;
    }
  }, []);

  const deactivateEmergency = useCallback(async () => {
    try {
      await emergencyAPI.deactivate();
    } catch {
      /* demo mode */
    }
    setIsActive(false);
    setEmergencyData(null);
    setCountdown(null);
    setGreenCorridor(false);
  }, []);

  const fetchHospitals = useCallback(async (coords) => {
    if (!coords?.lat || !coords?.lng) return;
    try {
      const res = await hospitalAPI.getNearby({ lat: coords.lat, lng: coords.lng });
      if (res?.data?.hospitals) setHospitals(res.data.hospitals);
      else if (Array.isArray(res?.data)) setHospitals(res.data);
    } catch {
      setHospitals(MOCK_HOSPITALS);
    }
  }, []);

  const updateEmergencyLocation = useCallback((location) => {
    if (!location?.lat || !location?.lng) return;
    setEmergencyData((prev) =>
      prev ? { ...prev, location: { lat: location.lat, lng: location.lng } } : prev
    );
  }, []);

  return (
    <EmergencyContext.Provider
      value={{
        isActive,
        emergencyData,
        hospitals,
        trafficDensity,
        v2xStatus,
        connectedVehicles,
        nearbyAlerts,
        showAlertPopup,
        alertDistance,
        countdown,
        greenCorridor,
        activateEmergency,
        deactivateEmergency,
        fetchHospitals,
        updateEmergencyLocation,
        setShowAlertPopup,
        setTrafficDensity,
        setV2xStatus,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const ctx = useContext(EmergencyContext);
  if (!ctx) throw new Error('useEmergency must be used within EmergencyProvider');
  return ctx;
};
