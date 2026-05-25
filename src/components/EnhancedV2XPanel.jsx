import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Zap, Activity, Signal, Wifi } from 'lucide-react';
import { animationVariants, transitionConfig } from '../utils/animationEffects';

export default function EnhancedV2XPanel({ v2xStatus, connectedVehicles, activeAlerts }) {
  const v2xNodes = {
    v2v: connectedVehicles || 0,
    v2i: 3,
    v2h: 1,
    v2n: 1,
  };

  const signalStrength = [90, 85, 88, 92];
  const latency = [12, 18, 15, 14];

  return (
    <motion.div
      {...animationVariants.slideInRight}
      transition={transitionConfig.smooth}
      className="glass-card p-5 backdrop-blur-xl border border-cyber-blue/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-cyber-blue/10">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, linear: true }}
          >
            <Radio className="w-5 h-5 text-cyber-blue" />
          </motion.div>
          <h3 className="font-display text-sm font-bold text-cyber-blue uppercase">V2X Network</h3>
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="ml-auto w-2 h-2 rounded-full bg-cyber-green"
          />
        </div>
      </div>

      {/* V2X Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* V2V */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-gradient-to-br from-cyber-blue/20 to-cyber-blue/5 border border-cyber-blue/20"
        >
          <p className="text-[10px] font-bold text-cyber-blue uppercase mb-1">V2V</p>
          <p className="font-display text-lg font-bold text-cyber-blue">{v2xNodes.v2v}</p>
          <p className="text-[9px] text-white/50">Vehicles</p>
        </motion.div>

        {/* V2I */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-3 rounded-lg bg-gradient-to-br from-cyber-green/20 to-cyber-green/5 border border-cyber-green/20"
        >
          <p className="text-[10px] font-bold text-cyber-green uppercase mb-1">V2I</p>
          <p className="font-display text-lg font-bold text-cyber-green">{v2xNodes.v2i}</p>
          <p className="text-[9px] text-white/50">Signals</p>
        </motion.div>

        {/* V2H */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-3 rounded-lg bg-gradient-to-br from-cyber-amber/20 to-cyber-amber/5 border border-cyber-amber/20"
        >
          <p className="text-[10px] font-bold text-cyber-amber uppercase mb-1">V2H</p>
          <p className="font-display text-lg font-bold text-cyber-amber">{v2xNodes.v2h}</p>
          <p className="text-[9px] text-white/50">Hospital</p>
        </motion.div>

        {/* V2N */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-3 rounded-lg bg-gradient-to-br from-cyber-purple/20 to-cyber-purple/5 border border-cyber-purple/20"
        >
          <p className="text-[10px] font-bold text-cyber-purple uppercase mb-1">V2N</p>
          <p className="font-display text-lg font-bold text-cyber-purple">{v2xNodes.v2n}</p>
          <p className="text-[9px] text-white/50">Cloud</p>
        </motion.div>
      </div>

      {/* Signal Strength Monitor */}
      <div className="mb-4 pb-4 border-b border-cyber-blue/10">
        <h4 className="text-xs font-bold text-white/60 uppercase mb-2 flex items-center gap-1">
          <Signal className="w-3 h-3" />
          Signal Strength
        </h4>
        <div className="space-y-2">
          {signalStrength.map((strength, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-2"
            >
              <span className="text-[10px] text-white/40 w-6">Node {idx + 1}</span>
              <div className="flex-1 h-1.5 rounded-full bg-cyber-dark/50 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyber-green to-cyber-blue"
                  initial={{ width: 0 }}
                  animate={{ width: `${strength}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span className="text-[10px] text-cyber-green font-mono">{strength}%</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Latency Monitor */}
      <div className="mb-4 pb-4 border-b border-cyber-blue/10">
        <h4 className="text-xs font-bold text-white/60 uppercase mb-2 flex items-center gap-1">
          <Activity className="w-3 h-3" />
          Connection Latency
        </h4>
        <div className="space-y-1">
          {latency.map((lat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between text-[10px] px-2 py-1 rounded-lg bg-cyber-dark/40"
            >
              <span className="text-white/50">Node {idx + 1}</span>
              <span className={`font-mono font-bold ${lat < 15 ? 'text-cyber-green' : 'text-cyber-amber'}`}>
                {lat}ms
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Nearby Vehicles Alert */}
      <div>
        <h4 className="text-xs font-bold text-white/60 uppercase mb-2 flex items-center gap-1">
          <Wifi className="w-3 h-3" />
          Nearby (20m)
        </h4>
        <motion.div
          className="p-3 rounded-lg bg-gradient-to-r from-cyber-amber/20 to-cyber-red/20 border border-cyber-red/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Zap className="w-4 h-4 text-cyber-red" />
            </motion.div>
            <p className="text-xs font-bold text-cyber-red">5 Vehicles Detected</p>
          </div>
          <p className="text-[10px] text-white/60">All alerts broadcasted</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
