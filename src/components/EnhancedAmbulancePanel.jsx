import { motion } from 'framer-motion';
import { Gauge, Power, MapPin, Signal, Zap, AlertCircle } from 'lucide-react';
import { animationVariants, transitionConfig } from '../utils/animationEffects';

export default function EnhancedAmbulancePanel({
  ambulanceLocation,
  speed,
  eta,
  driverStatus,
  fuelLevel,
  gpsAccuracy,
  emergencyLevel,
  v2xNodes,
}) {
  const data = {
    speed: speed || 65,
    eta: eta || 18,
    driverStatus: driverStatus || 'Alert',
    fuelLevel: fuelLevel || 85,
    gpsAccuracy: gpsAccuracy || 92,
    emergencyLevel: emergencyLevel || 5,
    v2xNodes: v2xNodes || 8,
    lat: ambulanceLocation?.lat || 13.0827,
    lng: ambulanceLocation?.lng || 80.2707,
  };

  return (
    <motion.div
      {...animationVariants.slideInRight}
      transition={transitionConfig.smooth}
      className="glass-card p-5 backdrop-blur-xl border border-cyber-red/20"
    >
      {/* Header with emergency level */}
      <div className="mb-4 pb-3 border-b border-cyber-red/10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-sm font-bold text-cyber-red uppercase">Ambulance Status</h3>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="px-2 py-1 rounded-lg bg-cyber-red/20 border border-cyber-red/40"
          >
            <p className="text-[10px] font-bold text-cyber-red">LIVE</p>
          </motion.div>
        </div>

        {/* Emergency Level Indicator */}
        <div className="mb-2">
          <p className="text-[10px] text-white/40 uppercase mb-1">Emergency Level</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <motion.div
                key={level}
                animate={level <= data.emergencyLevel ? { opacity: [0.5, 1] } : {}}
                transition={{ duration: 0.5, repeat: level <= data.emergencyLevel ? Infinity : 0 }}
                className={`h-2 flex-1 rounded-full ${
                  level <= data.emergencyLevel
                    ? 'bg-gradient-to-r from-cyber-red to-cyber-amber'
                    : 'bg-cyber-dark/40'
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] text-cyber-red mt-1 font-bold">Level {data.emergencyLevel}/5</p>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Speed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-lg bg-gradient-to-br from-cyber-blue/20 to-cyber-blue/5 border border-cyber-blue/20"
        >
          <div className="flex items-center gap-1 mb-1">
            <Gauge className="w-4 h-4 text-cyber-blue" />
            <p className="text-[10px] font-bold text-cyber-blue">Speed</p>
          </div>
          <p className="font-display text-lg font-bold text-cyber-blue">{data.speed} km/h</p>
        </motion.div>

        {/* ETA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="p-3 rounded-lg bg-gradient-to-br from-cyber-green/20 to-cyber-green/5 border border-cyber-green/20"
        >
          <div className="flex items-center gap-1 mb-1">
            <motion.div animate={{ rotate: [0, -30, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <MapPin className="w-4 h-4 text-cyber-green" />
            </motion.div>
            <p className="text-[10px] font-bold text-cyber-green">ETA</p>
          </div>
          <p className="font-display text-lg font-bold text-cyber-green">{data.eta} min</p>
        </motion.div>
      </div>

      {/* Secondary Stats */}
      <div className="space-y-2 mb-4 pb-4 border-b border-cyber-red/10">
        {/* Driver Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-2.5 rounded-lg bg-cyber-dark/40 border border-white/5 flex items-center justify-between"
        >
          <span className="text-xs text-white/60">Driver Status</span>
          <motion.span
            animate={{ opacity: [0.7, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-xs font-bold text-cyber-green"
          >
            {data.driverStatus}
          </motion.span>
        </motion.div>

        {/* Fuel Level */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="p-2.5 rounded-lg bg-cyber-dark/40 border border-white/5"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/60 flex items-center gap-1">
              <Power className="w-3 h-3" />
              Fuel / Battery
            </span>
            <span className={`text-xs font-bold ${data.fuelLevel > 50 ? 'text-cyber-green' : 'text-cyber-amber'}`}>
              {data.fuelLevel}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-cyber-dark/50 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${data.fuelLevel > 50 ? 'bg-cyber-green' : 'bg-cyber-amber'}`}
              initial={{ width: 0 }}
              animate={{ width: `${data.fuelLevel}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>

        {/* GPS Accuracy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-2.5 rounded-lg bg-cyber-dark/40 border border-white/5"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/60 flex items-center gap-1">
              <Signal className="w-3 h-3" />
              GPS Accuracy
            </span>
            <span className="text-xs font-bold text-cyber-blue">{data.gpsAccuracy}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-cyber-dark/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-cyber-blue"
              initial={{ width: 0 }}
              animate={{ width: `${data.gpsAccuracy}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Coordinates */}
      <div className="mb-4 pb-4 border-b border-cyber-red/10">
        <p className="text-[10px] text-white/40 uppercase mb-1.5">Current Coordinates</p>
        <motion.div
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-2 rounded-lg bg-cyber-dark/40 border border-cyber-green/20 font-mono text-[9px] text-cyber-green"
        >
          <p>{data.lat.toFixed(6)}</p>
          <p>{data.lng.toFixed(6)}</p>
        </motion.div>
      </div>

      {/* V2X Nodes Connected */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-3 rounded-lg bg-gradient-to-r from-cyber-purple/20 to-cyber-purple/5 border border-cyber-purple/20"
      >
        <div className="flex items-center gap-2 mb-1">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, linear: true }}
          >
            <Zap className="w-4 h-4 text-cyber-purple" />
          </motion.div>
          <p className="text-xs font-bold text-cyber-purple uppercase">V2X Connected</p>
        </div>
        <p className="text-[10px] text-white/60">{data.v2xNodes} Network Nodes Active</p>
      </motion.div>
    </motion.div>
  );
}
