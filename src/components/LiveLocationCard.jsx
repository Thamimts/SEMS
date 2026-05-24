import { useEffect } from 'react';
import { MapPin, RefreshCw, AlertCircle, Navigation, Droplet, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { getBloodGroupColor } from '../constants/bloodGroups';

export default function LiveLocationCard({ compact = false }) {
  const { position, address, addressLoading, error, loading, refresh, isTracking, coords } =
    useLocation();
  const { user } = useAuth();
  const { hospitals, fetchHospitals } = useEmergency();

  const bloodGroup =
    user?.bloodGroup || sessionStorage.getItem('sems_blood_group') || null;

  useEffect(() => {
    if (coords) fetchHospitals(coords);
  }, [coords, fetchHospitals]);

  if (loading && !position) {
    return (
      <div className={`glass-card ${compact ? 'p-3' : 'p-5'}`}>
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin text-cyber-blue" />
          Acquiring GPS signal...
        </div>
      </div>
    );
  }

  if (error && !position) {
    return (
      <div className={`glass-card border-cyber-amber/30 ${compact ? 'p-3' : 'p-5'}`}>
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-cyber-amber shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-cyber-amber font-medium">Location unavailable</p>
            <p className="text-xs text-white/40 mt-1">{error}</p>
            <button
              type="button"
              onClick={refresh}
              className="mt-2 text-xs text-cyber-blue hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!position) return null;

  const latDir = position.lat >= 0 ? 'N' : 'S';
  const lngDir = position.lng >= 0 ? 'E' : 'W';

  return (
    <div className={`glass-card ${compact ? 'p-3' : 'p-5'}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyber-blue" />
          <h3 className="font-display text-sm font-semibold">LIVE LOCATION</h3>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-cyber-blue transition-colors"
          title="Refresh location"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Blood group */}
      {bloodGroup && (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-3 ${getBloodGroupColor(bloodGroup)}`}
        >
          <Droplet className="w-4 h-4 fill-current" />
          <span className="text-[10px] uppercase tracking-wider text-white/50">Blood Group</span>
          <span className="font-display font-bold text-base">{bloodGroup}</span>
        </div>
      )}

      <p className="font-mono text-sm text-cyber-blue">
        {Math.abs(position.lat).toFixed(5)}° {latDir}, {Math.abs(position.lng).toFixed(5)}° {lngDir}
      </p>

      <p className="text-xs text-white/50 mt-1 line-clamp-2">
        {addressLoading ? 'Resolving address...' : address || 'Live GPS coordinates'}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[10px] text-white/40">
        <span className="flex items-center gap-1.5">
          <motion.span
            className={`w-2 h-2 rounded-full ${isTracking ? 'bg-cyber-green' : 'bg-cyber-amber'}`}
            animate={isTracking ? { opacity: [1, 0.4, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {isTracking ? 'GPS live' : 'GPS limited'}
        </span>
        {position.accuracy != null && (
          <span className="flex items-center gap-1">
            <Navigation className="w-3 h-3" />
            ±{Math.round(position.accuracy)}m
          </span>
        )}
        {position.speed != null && position.speed >= 0 && (
          <span>{(position.speed * 3.6).toFixed(0)} km/h</span>
        )}
      </div>

      {/* Nearby hospitals */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-4 h-4 text-cyber-green" />
          <span className="text-xs font-display font-semibold text-white/70 uppercase tracking-wider">
            Nearby Hospitals
          </span>
          <span className="ml-auto text-[10px] font-mono text-cyber-blue">{hospitals.length} found</span>
        </div>
        <ul className="space-y-2 max-h-36 overflow-y-auto">
          {hospitals.map((h, i) => (
            <motion.li
              key={h.id ?? i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start justify-between gap-2 p-2 rounded-lg bg-cyber-dark/50 border border-white/5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">{h.name}</p>
                <p className="text-[10px] text-white/35 mt-0.5">
                  {h.distance != null ? `${h.distance} km` : '—'}
                  {h.eta != null && ` · ${h.eta} min ETA`}
                </p>
              </div>
              {i === 0 && (
                <span className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold rounded bg-cyber-green/20 text-cyber-green">
                  NEAREST
                </span>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
