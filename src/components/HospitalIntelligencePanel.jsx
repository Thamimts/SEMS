import { motion } from 'framer-motion';
import { Heart, AlertTriangle, Clock, Activity } from 'lucide-react';
import { animationVariants, transitionConfig } from '../utils/animationEffects';

export default function HospitalIntelligencePanel({ hospital }) {
  const hospitalData = hospital || {
    name: 'Apollo Hospital',
    distance: 12.5,
    eta: 18,
    availableBeds: 8,
    icuBeds: 3,
    emergencyReadiness: 95,
    occupancy: 78,
    departments: [
      { name: 'Emergency', status: 'Ready', availability: 100, icon: '🚨' },
      { name: 'ICU', status: 'Ready', availability: 75, icon: '🏥' },
      { name: 'Surgery', status: 'Ready', availability: 90, icon: '⚕️' },
      { name: 'Trauma', status: 'Ready', availability: 85, icon: '🩹' },
    ],
  };

  return (
    <motion.div
      {...animationVariants.slideInTop}
      transition={transitionConfig.smooth}
      className="glass-card p-5 backdrop-blur-xl border border-cyber-red/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-cyber-red/10">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Heart className="w-5 h-5 text-cyber-red" />
          </motion.div>
          <div>
            <h3 className="font-display text-sm font-bold text-cyber-red uppercase">Hospital Intel</h3>
            <p className="text-[10px] text-white/40">{hospitalData.name}</p>
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="px-2 py-1 rounded-lg bg-cyber-red/20 border border-cyber-red/40"
        >
          <p className="text-[10px] font-bold text-cyber-red">NOTIFIED</p>
        </motion.div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Available Beds */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-gradient-to-br from-cyber-green/20 to-cyber-green/5 border border-cyber-green/20"
        >
          <p className="text-[10px] font-bold text-cyber-green uppercase mb-1">Available Beds</p>
          <p className="font-display text-xl font-bold text-cyber-green">{hospitalData.availableBeds}</p>
          <p className="text-[9px] text-white/50">+ {hospitalData.icuBeds} ICU</p>
        </motion.div>

        {/* Emergency Readiness */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-3 rounded-lg bg-gradient-to-br from-cyber-red/20 to-cyber-red/5 border border-cyber-red/20"
        >
          <p className="text-[10px] font-bold text-cyber-red uppercase mb-1">Emergency Ready</p>
          <p className="font-display text-xl font-bold text-cyber-red">{hospitalData.emergencyReadiness}%</p>
          <p className="text-[9px] text-white/50">Full capacity</p>
        </motion.div>
      </div>

      {/* ETA Card */}
      <div className="mb-4 pb-4 border-b border-cyber-red/10">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-cyber-blue/20 to-cyber-blue/5 border border-cyber-blue/20">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyber-blue" />
            <div>
              <p className="text-[10px] text-white/40">Estimated Arrival</p>
              <p className="font-display font-bold text-cyber-blue">{hospitalData.eta} min</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/40">{hospitalData.distance} km</p>
          </div>
        </div>
      </div>

      {/* Department Status */}
      <div>
        <h4 className="text-xs font-bold text-white/60 uppercase mb-2 flex items-center gap-1">
          <Activity className="w-3 h-3" />
          Department Status
        </h4>
        <div className="space-y-2">
          {hospitalData.departments.map((dept, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-2 rounded-lg bg-cyber-dark/40 border border-white/5"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-white/70">{dept.name}</p>
                <motion.span
                  animate={{ opacity: [0.7, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-[9px] text-cyber-green"
                >
                  {dept.status}
                </motion.span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-cyber-dark/50 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyber-green to-cyber-blue"
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.availability}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span className="text-[9px] text-cyber-green font-mono">{dept.availability}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
