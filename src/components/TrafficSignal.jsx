import { motion } from 'framer-motion';
import { TrafficCone } from 'lucide-react';

const lights = ['red', 'amber', 'green'];

export default function TrafficSignal({ activeLight = 'green', label = 'Smart Signal #42', corridor = false }) {
  return (
    <div className={`glass-card p-4 ${corridor ? 'border-cyber-green/40 shadow-[0_0_20px_rgba(0,255,136,0.2)]' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-2 p-2 rounded-xl bg-cyber-black border border-white/10">
          {lights.map((color) => {
            const isOn = activeLight === color || (corridor && color === 'green');
            const colors = {
              red: 'bg-cyber-red shadow-[0_0_12px_rgba(255,45,85,0.8)]',
              amber: 'bg-cyber-amber shadow-[0_0_12px_rgba(255,184,0,0.8)]',
              green: 'bg-cyber-green shadow-[0_0_12px_rgba(0,255,136,0.8)]',
            };
            return (
              <motion.div
                key={color}
                className={`w-4 h-4 rounded-full transition-all ${
                  isOn ? colors[color] : 'bg-white/10'
                }`}
                animate={isOn && corridor && color === 'green' ? { opacity: [1, 0.6, 1] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            );
          })}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <TrafficCone className="w-4 h-4 text-cyber-amber" />
            <p className="text-xs font-semibold">{label}</p>
          </div>
          <p className="text-[10px] text-white/40 mt-1">
            {corridor ? (
              <span className="text-cyber-green font-bold">GREEN CORRIDOR ACTIVE</span>
            ) : (
              `V2I Control • Phase ${activeLight.toUpperCase()}`
            )}
          </p>
          {corridor && (
            <motion.div
              className="mt-2 h-1 rounded-full bg-cyber-green/30 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-full bg-cyber-green"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{ width: '50%' }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
