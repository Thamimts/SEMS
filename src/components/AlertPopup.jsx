import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Navigation } from 'lucide-react';

export default function AlertPopup({ show, distance = 150, onDismiss }) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onDismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[101] max-w-md mx-auto"
          >
            <div className="relative overflow-hidden rounded-2xl border-2 border-cyber-red shadow-neon-red">
              {/* Siren flash overlay */}
              <motion.div
                className="absolute inset-0 bg-cyber-red/20 pointer-events-none"
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />

              <div className="relative bg-gradient-to-b from-cyber-panel to-cyber-dark p-6 sm:p-8 text-center">
                <motion.div
                  animate={{ rotate: [0, -8, 8, -8, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyber-red/20 mb-4"
                >
                  <AlertTriangle className="w-10 h-10 text-cyber-red" />
                </motion.div>

                <h2 className="font-display text-xl sm:text-2xl font-bold text-cyber-red mb-1">
                  🚨 Emergency Vehicle Approaching
                </h2>
                <p className="text-lg font-semibold text-white mb-4">Please Give Way</p>

                <div className="glass-card p-4 mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Navigation className="w-5 h-5 text-cyber-amber" />
                    <span className="text-sm text-white/60">Distance to emergency vehicle</span>
                  </div>
                  <motion.p
                    key={distance}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="font-display text-4xl font-bold neon-text-red"
                  >
                    {distance}m
                  </motion.p>
                  <div className="mt-3 h-2 rounded-full bg-cyber-dark overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyber-red to-cyber-amber rounded-full"
                      initial={{ width: '100%' }}
                      animate={{ width: `${Math.min(100, (distance / 300) * 100)}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <p className="text-xs text-white/40 mb-4">
                  V2X alert received • Move to the right lane safely
                </p>

                <button onClick={onDismiss} className="btn-danger w-full text-sm">
                  Acknowledge Alert
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
