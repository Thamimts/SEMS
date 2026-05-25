import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Route, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { animationVariants, transitionConfig } from '../utils/animationEffects';

const trafficPredictionData = [
  { time: '00:00', congestion: 20 },
  { time: '04:00', congestion: 15 },
  { time: '08:00', congestion: 55 },
  { time: '12:00', congestion: 75 },
  { time: '16:00', congestion: 90 },
  { time: '20:00', congestion: 70 },
  { time: '24:00', congestion: 30 },
];

const routeAlternatives = [
  {
    name: 'Primary Route',
    distance: 12.5,
    duration: 18,
    congestion: 75,
    status: 'active',
    color: 'cyber-green',
  },
  {
    name: 'Route B',
    distance: 14.2,
    duration: 20,
    congestion: 45,
    status: 'recommended',
    color: 'cyber-blue',
  },
  {
    name: 'Route C',
    distance: 13.8,
    duration: 19,
    congestion: 55,
    status: 'alternate',
    color: 'cyber-amber',
  },
];

export default function AITrafficAnalytics() {
  return (
    <motion.div
      {...animationVariants.slideInLeft}
      transition={transitionConfig.smooth}
      className="glass-card p-5 backdrop-blur-xl border border-cyber-amber/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-cyber-amber/10">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, linear: true }}
          >
            <TrendingUp className="w-5 h-5 text-cyber-amber" />
          </motion.div>
          <h3 className="font-display text-sm font-bold text-cyber-amber uppercase">AI Traffic Analytics</h3>
        </div>
      </div>

      {/* Traffic Prediction Chart */}
      <div className="mb-4 pb-4 border-b border-cyber-amber/10">
        <h4 className="text-xs font-bold text-white/60 uppercase mb-2">24h Congestion Forecast</h4>
        <div className="h-32 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficPredictionData}>
              <defs>
                <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffb800" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffb800" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                stroke="#ffffff20"
                style={{ fontSize: '10px' }}
                tick={{ fill: '#ffffff80' }}
              />
              <YAxis
                stroke="#ffffff20"
                style={{ fontSize: '10px' }}
                tick={{ fill: '#ffffff80' }}
              />
              <Area
                type="monotone"
                dataKey="congestion"
                stroke="#ffb800"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCongestion)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Smart Route Recommendations */}
      <div className="mb-4 pb-4 border-b border-cyber-amber/10">
        <h4 className="text-xs font-bold text-white/60 uppercase mb-3 flex items-center gap-1">
          <Route className="w-3 h-3" />
          Smart Routes
        </h4>
        <div className="space-y-2">
          {routeAlternatives.map((route, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-3 rounded-lg border ${
                route.status === 'active'
                  ? 'border-cyber-green/40 bg-gradient-to-r from-cyber-green/20 to-cyber-green/5'
                  : route.status === 'recommended'
                    ? 'border-cyber-blue/40 bg-gradient-to-r from-cyber-blue/20 to-cyber-blue/5'
                    : 'border-cyber-amber/40 bg-gradient-to-r from-cyber-amber/20 to-cyber-amber/5'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className={`text-xs font-bold uppercase ${`text-cyber-${route.color.split('-')[1]}`}`}>
                    {route.name}
                  </p>
                  {route.status === 'recommended' && (
                    <motion.span
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-[9px] text-cyber-blue font-semibold"
                    >
                      ★ RECOMMENDED
                    </motion.span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div>
                  <p className="text-white/40">Distance</p>
                  <p className="font-mono font-bold">{route.distance} km</p>
                </div>
                <div>
                  <p className="text-white/40">ETA</p>
                  <p className="font-mono font-bold">{route.duration} min</p>
                </div>
                <div>
                  <p className="text-white/40">Congestion</p>
                  <motion.p
                    className={`font-mono font-bold ${route.congestion > 70 ? 'text-cyber-red' : route.congestion > 50 ? 'text-cyber-amber' : 'text-cyber-green'}`}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                  >
                    {route.congestion}%
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Green Corridor Status */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="p-3 rounded-lg bg-gradient-to-r from-cyber-green/20 to-cyber-green/5 border border-cyber-green/40"
      >
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="w-4 h-4 text-cyber-green" />
          </motion.div>
          <p className="text-xs font-bold text-cyber-green uppercase">Green Corridor Active</p>
        </div>
        <p className="text-[10px] text-white/60">8 Traffic signals coordinated</p>
      </motion.div>
    </motion.div>
  );
}
