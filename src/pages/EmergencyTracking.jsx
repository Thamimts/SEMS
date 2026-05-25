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
  Menu,
} from 'lucide-react';
import Layout from '../components/Layout';
import EnhancedInteractiveMap from '../components/EnhancedInteractiveMap';
import EnhancedV2XPanel from '../components/EnhancedV2XPanel';
import AITrafficAnalytics from '../components/AITrafficAnalytics';
import HospitalIntelligencePanel from '../components/HospitalIntelligencePanel';
import RealTimeEventTimeline from '../components/RealTimeEventTimeline';
import EnhancedAmbulancePanel from '../components/EnhancedAmbulancePanel';
import SmartEmergencyAlert from '../components/SmartEmergencyAlert';
import TrafficSignal from '../components/TrafficSignal';
import AlertPopup from '../components/AlertPopup';
import { useEmergency } from '../context/EmergencyContext';
import { useLocation } from '../context/LocationContext';
import LiveLocationCard from '../components/LiveLocationCard';
import { useNavigate } from 'react-router-dom';
import { useAmbulanceTracking } from '../hooks/useAmbulanceTracking';
import { animationVariants, transitionConfig } from '../utils/animationEffects';

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
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showBottomPanel, setShowBottomPanel] = useState(true);
  const [panelLayout, setPanelLayout] = useState('expanded'); // expanded, compact, fullscreen
  const [emergencyAlertActive, setEmergencyAlertActive] = useState(false);
  const [emergencyLevel, setEmergencyLevel] = useState(5);
  const [currentSpeed, setCurrentSpeed] = useState(65);
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

  // ETA countdown
  useEffect(() => {
    if (!isActive) return;
    const t = setInterval(() => setEta((e) => Math.max(1, e - 0.1)), 3000);
    return () => clearInterval(t);
  }, [isActive]);

  // V2V message simulation
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

  // Simulate speed variations
  useEffect(() => {
    if (!isActive) return;
    const speedInterval = setInterval(() => {
      setCurrentSpeed((s) => {
        const variation = (Math.random() - 0.5) * 10;
        return Math.max(30, Math.min(80, s + variation));
      });
    }, 2000);
    return () => clearInterval(speedInterval);
  }, [isActive]);

  // Emergency level indicator (decreases as we approach)
  useEffect(() => {
    if (!isActive) return;
    const levelInterval = setInterval(() => {
      setEmergencyLevel((l) => Math.max(1, l - 0.1));
    }, 4000);
    return () => clearInterval(levelInterval);
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
      {/* Smart Emergency Alert - appears when ambulance is near */}
      <SmartEmergencyAlert
        show={emergencyAlertActive}
        distance={20}
        vehicleCount={5}
        onDismiss={() => setEmergencyAlertActive(false)}
        onReroute={() => {
          // Handle rerouting logic
          updateRoute();
          setEmergencyAlertActive(false);
        }}
        playSound={sirenOn}
      />

      <AlertPopup show={showAlertPopup} distance={alertDistance} onDismiss={() => setShowAlertPopup(false)} />

      <div className="relative h-[calc(100vh-0px)] lg:h-screen overflow-hidden bg-cyber-black">
        {/* Full screen interactive map */}
        <EnhancedInteractiveMap
          className="absolute inset-0"
          ambulanceLocation={ambulanceLocation}
          destinationLocation={destinationLocation}
          hospitalLocation={hospital ? { lat: hospital.lat, lng: hospital.lng, name: hospital.name } : null}
          routePath={routePath}
          routeInfo={routeInfo}
          nearbyVehicles={MOCK_NEARBY}
          showCorridor={greenCorridor || isActive}
          isLoading={isCalculatingRoute}
          emergencyLevel={emergencyLevel}
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        />

        {/* Siren overlay animation */}
        <AnimatePresence>
          {sirenOn && isActive && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              animate={{
                boxShadow: [
                  'inset 0 0 0 0 rgba(255,45,85,0)',
                  'inset 0 0 80px 20px rgba(255,45,85,0.15)',
                  'inset 0 0 0 0 rgba(255,45,85,0)',
                ],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </AnimatePresence>

        {/* Top bar - Emergency Status */}
        <div className="absolute top-0 inset-x-0 z-20 p-4 flex items-start justify-between gap-4 flex-wrap">
          <motion.div
            {...animationVariants.slideInTop}
            transition={transitionConfig.normal}
            className="glass-card px-4 py-3 flex items-center gap-3 border-cyber-red/30"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <AlertTriangle className="w-6 h-6 text-cyber-red" />
            </motion.div>
            <div>
              <p className="font-display text-xs font-bold text-cyber-red tracking-wider uppercase">
                EMERGENCY ACTIVE
              </p>
              <p className="text-[10px] text-white/40 font-mono">{emergencyData?.id || 'EMG-LIVE'}</p>
            </div>
          </motion.div>

          <motion.div
            {...animationVariants.slideInTop}
            transition={{ ...transitionConfig.normal, delay: 0.1 }}
            className="glass-card px-5 py-3 text-center border-cyber-blue/30"
          >
            <p className="text-[10px] text-white/40 uppercase">ETA to Hospital</p>
            <p className="font-display text-2xl font-bold text-cyber-blue">{formatEta(eta)}</p>
            <p className="text-xs text-white/50">{hospital?.name}</p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSirenOn(!sirenOn)}
            className={`glass-card p-3 transition ${sirenOn ? 'border-cyber-red/40 hover:shadow-lg hover:shadow-cyber-red/30' : 'border-white/10'}`}
            title={sirenOn ? 'Disable siren' : 'Enable siren'}
          >
            <motion.div
              animate={sirenOn ? { scale: [1, 1.1, 1], opacity: [1, 0.7, 1] } : {}}
              transition={{ duration: 0.6, repeat: sirenOn ? Infinity : 0 }}
            >
              <Volume2 className={`w-5 h-5 ${sirenOn ? 'text-cyber-red' : 'text-white/40'}`} />
            </motion.div>
          </motion.button>
        </div>

        {/* Left Panel - Ambulance & V2X */}
        <AnimatePresence>
          {showLeftPanel && (
            <motion.div
              {...animationVariants.slideInLeft}
              transition={transitionConfig.smooth}
              className="absolute left-4 top-32 bottom-24 z-20 w-80 overflow-y-auto space-y-3 hidden lg:block"
            >
              {/* Enhanced Ambulance Panel */}
              <EnhancedAmbulancePanel
                ambulanceLocation={ambulanceLocation}
                speed={currentSpeed}
                eta={eta}
                driverStatus="Alert"
                fuelLevel={85}
                gpsAccuracy={92}
                emergencyLevel={Math.ceil(emergencyLevel)}
                v2xNodes={8}
              />

              {/* Enhanced V2X Panel */}
              <EnhancedV2XPanel v2xStatus="Active" connectedVehicles={8} activeAlerts={5} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Panel - Traffic Analytics & Hospital Intel */}
        <AnimatePresence>
          {showRightPanel && (
            <motion.div
              {...animationVariants.slideInRight}
              transition={transitionConfig.smooth}
              className="absolute right-4 top-32 bottom-24 z-20 w-80 overflow-y-auto space-y-3 hidden lg:block"
            >
              {/* AI Traffic Analytics */}
              <AITrafficAnalytics />

              {/* Hospital Intelligence Panel */}
              <HospitalIntelligencePanel hospital={hospital} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Panel - Timeline & Controls */}
        <AnimatePresence>
          {showBottomPanel && (
            <motion.div
              {...animationVariants.slideInBottom}
              transition={transitionConfig.smooth}
              className="absolute bottom-0 inset-x-0 z-20 p-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Timeline - takes full width on mobile, 1/3 on desktop */}
                <div className="lg:col-span-2">
                  <RealTimeEventTimeline />
                </div>

                {/* Control Panel */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={transitionConfig.smooth}
                  className="glass-card p-4 backdrop-blur-xl border border-cyber-blue/20"
                >
                  <h3 className="font-display text-sm font-bold text-cyber-blue uppercase mb-3">Controls</h3>

                  <div className="space-y-2 mb-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-cyber-dark/40 border border-white/5">
                        <p className="text-[10px] text-white/40">Distance</p>
                        <p className="font-mono font-bold text-sm">{routeInfo?.distance?.toFixed(1) || '--'} km</p>
                      </div>
                      <div className="p-2 rounded-lg bg-cyber-dark/40 border border-white/5">
                        <p className="text-[10px] text-white/40">Speed</p>
                        <p className="font-mono font-bold text-sm text-cyber-blue">{Math.round(currentSpeed)} km/h</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {routePath.length > 1 && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={isSimulating ? stopLiveSimulation : startLiveSimulation}
                            className="flex-1 px-2 py-2 rounded-lg border border-cyber-blue/30 text-xs hover:bg-cyber-blue/10 flex items-center justify-center gap-1 text-cyber-blue transition"
                            title={isSimulating ? 'Stop simulation' : 'Start simulation'}
                          >
                            {isSimulating ? (
                              <>
                                <Pause className="w-3 h-3" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3" />
                                Simulate
                              </>
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={updateRoute}
                            className="px-2 py-2 rounded-lg border border-cyber-amber/30 text-xs hover:bg-cyber-amber/10 text-cyber-amber transition"
                            title="Recalculate route"
                          >
                            <RefreshCw className={`w-3 h-3 ${isCalculatingRoute ? 'animate-spin' : ''}`} />
                          </motion.button>
                        </>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/verification')}
                      className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-cyber-green to-cyber-green/70 text-white font-bold text-xs uppercase hover:shadow-lg hover:shadow-cyber-green/30 transition"
                    >
                      Arrived at Hospital
                    </motion.button>
                  </div>

                  {/* Status */}
                  {greenCorridor && (
                    <motion.div
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="p-2 rounded-lg bg-cyber-green/20 text-cyber-green border border-cyber-green/30 text-center text-xs font-bold uppercase"
                    >
                      GREEN CORRIDOR ACTIVE
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Buttons - Mobile & Desktop Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-4 right-4 z-20 flex flex-col gap-2 lg:hidden"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowLeftPanel(!showLeftPanel)}
            className="glass-card p-3 hover:shadow-lg hover:shadow-cyber-blue/30 transition"
            title={showLeftPanel ? 'Hide left panel' : 'Show left panel'}
          >
            <Car className="w-5 h-5 text-cyber-blue" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowRightPanel(!showRightPanel)}
            className="glass-card p-3 hover:shadow-lg hover:shadow-cyber-amber/30 transition"
            title={showRightPanel ? 'Hide right panel' : 'Show right panel'}
          >
            <Radio className="w-5 h-5 text-cyber-amber" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowBottomPanel(!showBottomPanel)}
            className="glass-card p-3 hover:shadow-lg hover:shadow-cyber-green/30 transition"
            title={showBottomPanel ? 'Hide bottom panel' : 'Show bottom panel'}
          >
            <Menu className="w-5 h-5 text-cyber-green" />
          </motion.button>
        </motion.div>

        {/* Desktop Panel Toggles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-4 left-4 z-20 flex gap-2 hidden lg:flex"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLeftPanel(!showLeftPanel)}
            className="glass-card px-3 py-2 text-xs text-cyber-blue border border-cyber-blue/20 hover:border-cyber-blue/40 transition"
          >
            {showLeftPanel ? 'Hide' : 'Show'} Left
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRightPanel(!showRightPanel)}
            className="glass-card px-3 py-2 text-xs text-cyber-amber border border-cyber-amber/20 hover:border-cyber-amber/40 transition"
          >
            {showRightPanel ? 'Hide' : 'Show'} Right
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBottomPanel(!showBottomPanel)}
            className="glass-card px-3 py-2 text-xs text-cyber-green border border-cyber-green/20 hover:border-cyber-green/40 transition"
          >
            {showBottomPanel ? 'Hide' : 'Show'} Bottom
          </motion.button>
        </motion.div>
      </div>
    </Layout>
  );
}
