import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Volume2, X, Navigation } from 'lucide-react';
import { animationVariants } from '../utils/animationEffects';

export default function SmartEmergencyAlert({
  show,
  distance,
  vehicleCount,
  onDismiss,
  onReroute,
  playSound = true,
}) {
  const playAudio = () => {
    if (playSound && typeof window !== 'undefined') {
      const utterance = new SpeechSynthesisUtterance('Emergency vehicle approaching. Please give way.');
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (playSound && show) {
    playAudio();
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
        >
          {/* Background blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none"
          />

          {/* Alert panel */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 45, 85, 0.3)',
                '0 0 40px rgba(255, 45, 85, 0.6)',
                '0 0 20px rgba(255, 45, 85, 0.3)',
              ],
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className="relative pointer-events-auto"
          >
            <div className="glass-card p-6 border-2 border-cyber-red/60 backdrop-blur-xl w-96 max-w-[90vw]">
              {/* Flashing red overlay */}
              <motion.div
                animate={{
                  opacity: [0.8, 0.2, 0.8],
                  backgroundColor: ['rgba(255, 45, 85, 0.1)', 'rgba(255, 45, 85, 0.3)', 'rgba(255, 45, 85, 0.1)'],
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute inset-0 rounded-lg pointer-events-none"
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1],
                    }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <AlertTriangle className="w-12 h-12 text-cyber-red" />
                  </motion.div>
                </div>

                {/* Title */}
                <motion.h2
                  animate={{
                    textShadow: [
                      '0 0 10px rgba(255, 45, 85, 0.5)',
                      '0 0 20px rgba(255, 45, 85, 0.8)',
                      '0 0 10px rgba(255, 45, 85, 0.5)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="font-display text-2xl font-bold text-cyber-red text-center mb-2 uppercase"
                >
                  EMERGENCY ALERT
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center text-white text-lg font-semibold mb-3"
                >
                  "Emergency vehicle approaching."
                </motion.p>

                {/* Details */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-cyber-dark/50 p-3 rounded-lg border border-cyber-red/30 mb-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Distance</span>
                    <motion.span
                      animate={{ opacity: [0.7, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="text-cyber-red font-bold font-mono"
                    >
                      {distance || '20'}m
                    </motion.span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Vehicles Alerted</span>
                    <span className="text-cyber-green font-bold">{vehicleCount || 5}</span>
                  </div>
                </motion.div>

                {/* Recommended Action */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-cyber-amber/20 to-cyber-orange/20 p-3 rounded-lg border border-cyber-amber/40 mb-4"
                >
                  <p className="text-cyber-amber text-sm font-semibold flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Recommended: Change lane or reduce speed
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onReroute}
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-cyber-green to-cyber-green/70 text-white font-bold uppercase text-sm hover:shadow-lg hover:shadow-cyber-green/50 transition flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Reroute
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onDismiss}
                    className="flex-1 px-4 py-3 rounded-lg bg-cyber-dark border border-white/20 text-white font-bold uppercase text-sm hover:border-white/40 transition"
                  >
                    Dismiss
                  </motion.button>
                </div>

                {/* Sound indicator */}
                {playSound && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 flex items-center justify-center gap-2 text-cyber-blue text-sm"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Volume2 className="w-4 h-4" />
                    </motion.div>
                    <span>Voice Alert Playing...</span>
                  </motion.div>
                )}
              </div>

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDismiss}
                className="absolute top-3 right-3 p-2 hover:bg-cyber-dark/50 rounded-lg transition z-20"
              >
                <X className="w-5 h-5 text-white/60 hover:text-white" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
