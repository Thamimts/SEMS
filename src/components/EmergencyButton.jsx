import { motion } from 'framer-motion';
import { AlertTriangle, Zap } from 'lucide-react';

export default function EmergencyButton({ onActivate, isActive, loading }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Outer pulse rings */}
      {!isActive && (
        <>
          <motion.div
            className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border-2 border-cyber-red/30"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-cyber-red/20"
            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
        </>
      )}

      <motion.button
        onClick={onActivate}
        disabled={loading || isActive}
        whileHover={{ scale: isActive ? 1 : 1.03 }}
        whileTap={{ scale: isActive ? 1 : 0.97 }}
        className={`relative z-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full flex flex-col items-center justify-center gap-3 font-display font-bold tracking-wider transition-all ${
          isActive
            ? 'bg-cyber-red/20 border-4 border-cyber-red cursor-default shadow-neon-red'
            : 'bg-gradient-to-br from-cyber-red via-cyber-red-glow to-red-900 border-4 border-cyber-red/80 shadow-neon-red hover:shadow-[0_0_60px_rgba(255,45,85,0.7)]'
        }`}
      >
        {isActive ? (
          <>
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Zap className="w-12 h-12 text-cyber-red" fill="currentColor" />
            </motion.div>
            <span className="text-cyber-red text-sm sm:text-base">EMERGENCY ACTIVE</span>
            <span className="text-[10px] text-white/50 font-sans font-normal">V2X Broadcasting</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-14 h-14 sm:w-16 sm:h-16 text-white" strokeWidth={2.5} />
            <span className="text-white text-xs sm:text-sm text-center px-4 leading-tight">
              ACTIVATE
              <br />
              EMERGENCY MODE
            </span>
          </>
        )}
      </motion.button>

      {!isActive && (
        <p className="mt-6 text-sm text-white/40 text-center max-w-xs">
          Instantly alerts nearby vehicles, traffic systems & hospitals via V2X
        </p>
      )}
    </div>
  );
}
