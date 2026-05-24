import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Activity,
  Clock,
  TrendingUp,
  Bell,
  Navigation,
  Brain,
  Users,
} from 'lucide-react';
import Layout from '../components/Layout';
import EmergencyButton from '../components/EmergencyButton';
import HospitalCard from '../components/HospitalCard';
import V2XPanel from '../components/V2XPanel';
import AlertPopup from '../components/AlertPopup';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import LiveLocationCard from '../components/LiveLocationCard';
import { v2xAPI, trafficAPI } from '../services/api';

function formatCountdown(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function TrafficDensityGauge({ density }) {
  const level = density > 75 ? 'Heavy' : density > 45 ? 'Moderate' : 'Light';
  const color = density > 75 ? 'text-cyber-red' : density > 45 ? 'text-cyber-amber' : 'text-cyber-green';
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyber-amber" />
          <h3 className="font-display text-sm font-semibold">TRAFFIC DENSITY</h3>
        </div>
        <span className={`text-xs font-bold ${color}`}>{level}</span>
      </div>
      <div className="relative h-3 rounded-full bg-cyber-dark overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            density > 75 ? 'bg-cyber-red' : density > 45 ? 'bg-cyber-amber' : 'bg-cyber-green'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${density}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      <p className="mt-2 text-2xl font-mono font-bold">{density}%</p>
      <p className="text-[10px] text-white/30 mt-1">AI-predicted congestion index</p>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    isActive,
    hospitals,
    trafficDensity,
    v2xStatus,
    connectedVehicles,
    countdown,
    greenCorridor,
    showAlertPopup,
    alertDistance,
    activateEmergency,
    setShowAlertPopup,
    setTrafficDensity,
    fetchHospitals,
    updateEmergencyLocation,
  } = useEmergency();

  const { coords, position } = useLocation();
  const [loading, setLoading] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(hospitals[0]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'V2X network synchronized', time: '2m ago' },
    { id: 2, text: '3 hospitals within 5km radius', time: '5m ago' },
  ]);

  useEffect(() => {
    if (coords) fetchHospitals(coords);
  }, [coords, fetchHospitals]);

  useEffect(() => {
    if (coords) {
      trafficAPI
        .getStatus({ lat: coords.lat, lng: coords.lng })
        .then((r) => setTrafficDensity(r.data?.density ?? 62))
        .catch(() => {});
    }
  }, [coords, setTrafficDensity]);

  useEffect(() => {
    if (isActive && position) {
      updateEmergencyLocation(position);
    }
  }, [isActive, position, updateEmergencyLocation]);

  const handleActivate = async () => {
    if (isActive) {
      navigate('/tracking');
      return;
    }
    setLoading(true);
    if (!coords) {
      setNotifications((n) => [
        { id: Date.now(), text: 'Waiting for GPS — enable location permission', time: 'now' },
        ...n,
      ]);
      setLoading(false);
      return;
    }

    await activateEmergency({
      type: 'medical',
      hospitalId: selectedHospital?.id,
      bloodGroup: user?.bloodGroup || sessionStorage.getItem('sems_blood_group'),
      location: { lat: coords.lat, lng: coords.lng },
    });
    try {
      await v2xAPI.broadcast({ type: 'emergency', priority: 'critical' });
    } catch {
      /* demo */
    }
    setNotifications((n) => [
      { id: Date.now(), text: 'Emergency mode activated — V2X broadcasting', time: 'now' },
      ...n,
    ]);
    setLoading(false);
    navigate('/tracking');
  };

  return (
    <Layout>
      <AlertPopup
        show={showAlertPopup}
        distance={alertDistance}
        onDismiss={() => setShowAlertPopup(false)}
      />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-cyber-blue font-mono uppercase tracking-widest mb-1">
                Smart City Emergency Hub
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">
                Welcome, <span className="neon-text-blue">{user?.name?.split(' ')[0] || 'Operator'}</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {isActive && countdown !== null && (
                <div className="glass-card px-4 py-2 flex items-center gap-2 border-cyber-red/30">
                  <Clock className="w-4 h-4 text-cyber-red" />
                  <span className="font-mono text-lg font-bold text-cyber-red">{formatCountdown(countdown)}</span>
                </div>
              )}
              <button
                onClick={() => setShowAlertPopup(true)}
                className="glass-card p-3 hover:border-cyber-blue/30 transition-colors relative"
                title="Simulate nearby alert"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyber-red rounded-full" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Emergency button + status */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 flex flex-col items-center"
            >
              <EmergencyButton onActivate={handleActivate} isActive={isActive} loading={loading} />
            </motion.div>

            {/* Emergency Status */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className={`w-5 h-5 ${isActive ? 'text-cyber-red' : 'text-cyber-green'}`} />
                <h3 className="font-display text-sm font-semibold">EMERGENCY STATUS</h3>
              </div>
              <div className={`p-4 rounded-xl border ${isActive ? 'bg-cyber-red/10 border-cyber-red/30' : 'bg-cyber-green/5 border-cyber-green/20'}`}>
                <p className={`font-bold text-lg ${isActive ? 'text-cyber-red' : 'text-cyber-green'}`}>
                  {isActive ? 'ACTIVE' : 'STANDBY'}
                </p>
                <p className="text-xs text-white/40 mt-1">
                  {isActive
                    ? 'V2X alerts broadcasting to nearby vehicles & infrastructure'
                    : 'System ready — no active emergency'}
                </p>
              </div>
              {greenCorridor && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-xs text-cyber-green font-bold flex items-center gap-1"
                >
                  <Navigation size={12} /> Green corridor generation active
                </motion.p>
              )}
            </div>

            <LiveLocationCard />

            {/* Connected vehicles */}
            <div className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyber-purple" />
                <span className="text-sm text-white/60">Connected Vehicles</span>
              </div>
              <motion.span
                key={connectedVehicles}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="font-mono font-bold text-cyber-purple"
              >
                {connectedVehicles.toLocaleString()}
              </motion.span>
            </div>
          </div>

          {/* Right columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <TrafficDensityGauge density={trafficDensity} />
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-cyber-purple" />
                  <h3 className="font-display text-sm font-semibold">AI TRAFFIC PREDICTION</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { time: '+5 min', prediction: 'Density ↓ 12%', color: 'text-cyber-green' },
                    { time: '+15 min', prediction: 'Green corridor optimal', color: 'text-cyber-blue' },
                    { time: '+30 min', prediction: 'Congestion ↑ 8%', color: 'text-cyber-amber' },
                  ].map((item) => (
                    <div key={item.time} className="flex justify-between text-sm">
                      <span className="text-white/40 font-mono">{item.time}</span>
                      <span className={`font-medium ${item.color}`}>{item.prediction}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <V2XPanel status={v2xStatus} connectedVehicles={connectedVehicles} />

            {/* Hospitals */}
            <div>
              <h3 className="font-display text-sm font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyber-blue" /> NEARBY HOSPITALS
              </h3>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {hospitals.map((h, i) => (
                  <HospitalCard
                    key={h.id}
                    hospital={h}
                    index={i}
                    selected={selectedHospital?.id === h.id}
                    onSelect={setSelectedHospital}
                  />
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="glass-card p-5">
              <h3 className="font-display text-sm font-semibold mb-3">REAL-TIME NOTIFICATIONS</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="flex justify-between text-sm py-2 border-b border-white/5 last:border-0">
                    <span className="text-white/70">{n.text}</span>
                    <span className="text-white/30 text-xs shrink-0 ml-2">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
