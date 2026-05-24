import { motion } from 'framer-motion';
import { Radio, Wifi, Car, Building, Signal } from 'lucide-react';

const channels = [
  { id: 'v2v', label: 'V2V', icon: Car, status: 'active', count: 342 },
  { id: 'v2i', label: 'V2I', icon: Building, status: 'active', count: 89 },
  { id: 'v2n', label: 'V2N', icon: Wifi, status: 'active', count: 1 },
  { id: 'v2h', label: 'V2H', icon: Signal, status: 'standby', count: 3 },
];

export default function V2XPanel({ status, connectedVehicles }) {
  return (
    <div className="glass-card p-5 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className={`w-5 h-5 ${status?.connected ? 'text-cyber-green' : 'text-cyber-red'}`} />
            <h3 className="font-display text-sm font-semibold tracking-wider">V2X NETWORK</h3>
          </div>
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              status?.connected
                ? 'bg-cyber-green/20 text-cyber-green'
                : 'bg-cyber-red/20 text-cyber-red'
            }`}
          >
            {status?.connected ? 'CONNECTED' : 'DISCONNECTED'}
          </motion.span>
        </div>

        {/* Animated communication lines */}
        <div className="relative h-24 mb-4 rounded-xl bg-cyber-dark/60 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 96">
            <defs>
              <linearGradient id="v2xGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
                <stop offset="50%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#ff2d55" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 1, 2].map((i) => (
              <line
                key={i}
                x1="20"
                y1={32 + i * 16}
                x2="280"
                y2={32 + i * 16}
                stroke="url(#v2xGrad)"
                strokeWidth="1"
                strokeDasharray="4 8"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            ))}
            <circle cx="150" cy="48" r="8" fill="#00d4ff" className="animate-pulse" />
          </svg>
          <p className="absolute bottom-2 left-3 text-[10px] text-white/30 font-mono">
            Broadcasting on 5.9 GHz DSRC / C-V2X
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {channels.map((ch, i) => (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`p-3 rounded-xl border ${
                ch.status === 'active'
                  ? 'bg-cyber-blue/5 border-cyber-blue/20'
                  : 'bg-white/5 border-white/5'
              }`}
            >
              <ch.icon className={`w-4 h-4 mb-1 ${ch.status === 'active' ? 'text-cyber-blue' : 'text-white/30'}`} />
              <p className="text-xs font-bold">{ch.label}</p>
              <p className="text-[10px] text-white/40">{ch.count} nodes</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-white/40">Latency</span>
          <span className="font-mono text-cyber-green">{status?.latency ?? 12}ms</span>
          <span className="text-white/40">Nodes</span>
          <span className="font-mono text-cyber-blue">{status?.nodes ?? 847}</span>
          <span className="text-white/40">Vehicles</span>
          <span className="font-mono text-cyber-amber">{connectedVehicles?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
