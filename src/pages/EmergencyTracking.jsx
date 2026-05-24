import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Navigation,
  Radio,
  Car,
  Volume2,
  X,
  Zap,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
} from 'lucide-react';
import Layout from '../components/Layout';
import InteractiveMap from '../components/InteractiveMap';
import TrafficSignal from '../components/TrafficSignal';
import AlertPopup from '../components/AlertPopup';
import { useEmergency } from '../context/EmergencyContext';
import { useLocation } from '../context/LocationContext';
import LiveLocationCard from '../components/LiveLocationCard';
import { useNavigate } from 'react-router-dom';
import { useAmbulanceTracking } from '../hooks/useAmbulanceTracking';

const MOCK_NEARBY = [
  { lat: 13.095, lng: 80.276, type: 'car', name: 'Vehicle DL-04-XX' },
  { lat: 13.087, lng: 80.268, type: 'car', name: 'Vehicle DL-05-XX' },
  { lat: 13.078, lng: 80.275, type: 'bike', name: 'Bike DL-09-XX' },
];

export default function EmergencyTracking() {
  const navigate = useNavigate();
  const {
    isActive,
    hospitals,
    greenCorridor,
    showAlertPopup,
    alertDistance,
    setShowAlertPopup,
    emergencyData,
    countdown,
    updateEmergencyLocation,
  } = useEmergency();

  const { coords, position } = useLocation();

  // Default location: Chennai, India
  const defaultLocation = {
    lat: parseFloat(import.meta.env.VITE_DEFAULT_CENTER_LAT || 13.0827),
    lng: parseFloat(import.meta.env.VITE_DEFAULT_CENTER_LNG || 80.2707),
  };

  const ambulanceInitialLocation = coords || position || emergencyData?.location || defaultLocation;
  const hospital = hospitals && hospitals.length > 0 ? hospitals[0] : null;
  const destinationLocation = hospital
    ? { lat: hospital.lat, lng: hospital.lng, name: hospital.name }
    : null;

  // Ambulance tracking hook with route calculation
  const {
    ambulanceLocation,
    routePath,
    routeInfo,
    isCalculatingRoute,
    isSimulating,
    updateRoute,
    startLiveSimulation,
    stopLiveSimulation,
  } = useAmbulanceTracking(ambulanceInitialLocation, destinationLocation);

  const [eta, setEta] = useState(6);
  const [sirenOn, setSirenOn] = useState(true);
  const [widgetsOpen, setWidgetsOpen] = useState(true);
  const [v2vMessages, setV2vMessages] = useState([
    { id: 1, from: 'Vehicle DL-04-XX', msg: 'Clearing lane', time: '2s' },
    { id: 2, from: 'Signal #42', msg: 'Green corridor granted', time: '5s' },
  ]);

  useEffect(() => {
    if (isActive && position) updateEmergencyLocation(position);
  }, [isActive, position, updateEmergencyLocation]);

  // Calculate route when ambulance or destination location changes
  useEffect(() => {
    if (isActive && ambulanceLocation && destinationLocation) {
      updateRoute();
    }
  }, [isActive, ambulanceLocation?.lat, ambulanceLocation?.lng, destinationLocation]);

  // Auto-start simulation after route is calculated
  useEffect(() => {
    if (isActive && routePath.length > 1 && !isSimulating) {
      // Optionally auto-start: startLiveSimulation();
    }
  }, [isActive, routePath, isSimulating]);

  useEffect(() => {
    if (!isActive) return;
    const t = setInterval(() => setEta((e) => Math.max(1, e - 0.1)), 3000);
    return () => clearInterval(t);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setV2vMessages((msgs) => [
        {
          id: Date.now(),
          from: `Vehicle DL-${Math.floor(Math.random() * 90 + 10)}-XX`,
          msg: ['Yielding right', 'Lane cleared', 'Slowing down', 'Acknowledged'][Math.floor(Math.random() * 4)],
          time: 'now',
        },
        ...msgs.slice(0, 4),
      ]);
    }, 5000);
    return () => clearInterval(interval);
  }, [isActive]);

  const formatEta = (min) => `${Math.floor(min)} min ${Math.round((min % 1) * 60)} sec`;

  if (!isActive) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-cyber-amber mb-4" />
          <h2 className="font-display text-xl font-bold mb-2">No Active Emergency</h2>
          <p className="text-white/40 text-sm mb-6 max-w-sm">
            Activate Emergency Mode from the dashboard to start live V2X tracking.
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Go to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AlertPopup show={showAlertPopup} distance={alertDistance} onDismiss={() => setShowAlertPopup(false)} />

      <div className="relative h-[calc(100vh-0px)] lg:h-screen">
        {/* Full screen interactive map */}
        <InteractiveMap
          className="absolute inset-0"
          ambulanceLocation={ambulanceLocation}
          destinationLocation={destinationLocation}
          hospitalLocation={hospital ? { lat: hospital.lat, lng: hospital.lng, name: hospital.name } : null}
          routePath={routePath}
          routeInfo={routeInfo}
          nearbyVehicles={MOCK_NEARBY}
          showCorridor={greenCorridor || isActive}
          isLoading={isCalculatingRoute}
        />

        {/* Siren overlay animation */}
        <AnimatePresence>
          {sirenOn && isActive && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              animate={{ boxShadow: ['inset 0 0 0 0 rgba(255,45,85,0)', 'inset 0 0 80px 20px rgba(255,45,85,0.15)', 'inset 0 0 0 0 rgba(255,45,85,0)'] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </AnimatePresence>

        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 z-20 p-4 flex items-start justify-between gap-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-card px-4 py-3 flex items-center gap-3 border-cyber-red/30"
          >
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
              <AlertTriangle className="w-6 h-6 text-cyber-red" />
            </motion.div>
            <div>
              <p className="font-display text-xs font-bold text-cyber-red tracking-wider">EMERGENCY ACTIVE</p>
              <p className="text-[10px] text-white/40 font-mono">{emergencyData?.id || 'EMG-LIVE'}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-card px-5 py-3 text-center border-cyber-blue/30"
          >
            <p className="text-[10px] text-white/40 uppercase">ETA to Hospital</p>
            <p className="font-display text-2xl font-bold neon-text-blue">{formatEta(eta)}</p>
            <p className="text-xs text-white/50">{hospital?.name}</p>
          </motion.div>

          <button
            onClick={() => setSirenOn(!sirenOn)}
            className={`glass-card p-3 ${sirenOn ? 'border-cyber-red/40' : ''}`}
          >
            <Volume2 className={`w-5 h-5 ${sirenOn ? 'text-cyber-red animate-siren' : 'text-white/40'}`} />
          </button>
        </div>

        {/* Floating widgets */}
        <AnimatePresence>
          {widgetsOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="absolute left-4 top-24 bottom-24 z-20 w-72 sm:w-80 overflow-y-auto space-y-3 hidden sm:block"
            >
              {/* V2V Communication */}
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Car className="w-4 h-4 text-cyber-amber" />
                  <h4 className="font-display text-xs font-bold">V2V COMMUNICATION</h4>
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="ml-auto w-2 h-2 rounded-full bg-cyber-green"
                  />
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {v2vMessages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-2 rounded-lg bg-cyber-dark/60 text-xs"
                    >
                      <p className="text-cyber-blue font-mono">{m.from}</p>
                      <p className="text-white/70">{m.msg}</p>
                      <p className="text-white/20 text-[10px] mt-0.5">{m.time}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* V2I Traffic signals */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <Radio className="w-4 h-4 text-cyber-green" />
                  <h4 className="font-display text-xs font-bold">V2I SMART SIGNALS</h4>
                </div>
                <TrafficSignal activeLight="green" label="Signal #42 — Ring Road" corridor={greenCorridor} />
                <TrafficSignal activeLight="red" label="Signal #18 — CP Junction" corridor={false} />
                <TrafficSignal activeLight="green" label="Signal #07 — Barakhamba" corridor={greenCorridor} />
              </div>

              <LiveLocationCard compact />

              {/* Nearby alerts */}
              <div className="glass-card p-4">
                <h4 className="font-display text-xs font-bold mb-2">NEARBY VEHICLE ALERTS</h4>
                {MOCK_NEARBY.map((_, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 text-xs text-white/50">
                    <Zap className="w-3 h-3 text-cyber-amber" />
                    Alert sent to vehicle #{i + 1}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom bar */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-4">
          <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-cyber-green" />
                <div>
                  <p className="text-[10px] text-white/40">Distance</p>
                  <p className="font-mono font-bold">{routeInfo?.distance || hospital?.distance || '--'} km</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyber-blue" />
                <div>
                  <p className="text-[10px] text-white/40">ETA</p>
                  <p className="font-mono font-bold text-cyber-blue">
                    {routeInfo?.duration || countdown ? `${Math.floor((routeInfo?.duration || countdown) / 60)}:${((routeInfo?.duration || countdown) % 60).toString().padStart(2, '0')}` : '--:--'}
                  </p>
                </div>
              </div>
              {greenCorridor && (
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="px-3 py-1 text-xs font-bold bg-cyber-green/20 text-cyber-green rounded-full border border-cyber-green/30"
                >
                  GREEN CORRIDOR
                </motion.span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Live Simulation Controls */}
              <div className="flex gap-2">
                {routePath.length > 1 && (
                  <>
                    <button
                      onClick={isSimulating ? stopLiveSimulation : startLiveSimulation}
                      className="px-3 py-2 rounded-xl border border-cyber-blue/30 text-sm hover:bg-cyber-blue/10 flex items-center gap-2 text-cyber-blue transition"
                      title={isSimulating ? 'Stop ambulance simulation' : 'Start ambulance movement simulation'}
                    >
                      {isSimulating ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Simulate
                        </>
                      )}
                    </button>
                    <button
                      onClick={updateRoute}
                      className="px-3 py-2 rounded-xl border border-cyber-amber/30 text-sm hover:bg-cyber-amber/10 flex items-center gap-2 text-cyber-amber transition"
                      title="Recalculate route"
                    >
                      <RefreshCw className={`w-4 h-4 ${isCalculatingRoute ? 'animate-spin' : ''}`} />
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => setWidgetsOpen(!widgetsOpen)}
                className="px-4 py-2 rounded-xl border border-white/10 text-sm hover:bg-white/5 hidden sm:block"
              >
                {widgetsOpen ? 'Hide' : 'Show'} Panels
              </button>
              <button onClick={() => navigate('/verification')} className="btn-primary text-sm py-2">
                Arrived at Hospital
              </button>
            </div>
          </div>
        </div>

        {/* Mobile widget toggle */}
        <button
          onClick={() => setWidgetsOpen(!widgetsOpen)}
          className="sm:hidden absolute right-4 top-24 z-20 glass-card p-3"
        >
          {widgetsOpen ? <X size={18} /> : <Car size={18} />}
        </button>
      </div>
    </Layout>
  );
}
