import { motion } from 'framer-motion';
import { Clock, Radio, AlertTriangle, CheckCircle, Zap, Send } from 'lucide-react';
import { animationVariants, transitionConfig } from '../utils/animationEffects';

const timelineEvents = [
  {
    id: 1,
    time: '00:00',
    title: 'Ambulance Dispatched',
    description: 'Emergency unit activated',
    icon: AlertTriangle,
    status: 'completed',
    color: 'cyber-red',
  },
  {
    id: 2,
    time: '00:15',
    title: 'Route Calculated',
    description: 'Optimal path selected: 12.5km',
    icon: Zap,
    status: 'completed',
    color: 'cyber-amber',
  },
  {
    id: 3,
    time: '00:30',
    title: 'Green Corridor Activated',
    description: '8 traffic signals coordinated',
    icon: Radio,
    status: 'active',
    color: 'cyber-green',
  },
  {
    id: 4,
    time: '00:45',
    title: 'Hospital Notified',
    description: 'Emergency team prepared',
    icon: Send,
    status: 'active',
    color: 'cyber-blue',
  },
  {
    id: 5,
    time: '01:00',
    title: 'Arrival Expected',
    description: 'ETA: ~18 minutes',
    icon: CheckCircle,
    status: 'pending',
    color: 'cyber-green',
  },
];

export default function RealTimeEventTimeline() {
  return (
    <motion.div
      {...animationVariants.slideInBottom}
      transition={transitionConfig.smooth}
      className="glass-card p-5 backdrop-blur-xl border border-cyber-blue/20"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyber-blue/10">
        <Clock className="w-5 h-5 text-cyber-blue" />
        <h3 className="font-display text-sm font-bold text-cyber-blue uppercase">Live Event Timeline</h3>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        {timelineEvents.map((event, idx) => {
          const Icon = event.icon;
          const isActive = event.status === 'active';
          const isCompleted = event.status === 'completed';

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-3 rounded-lg border transition-all ${
                isActive
                  ? `border-${event.color}/40 bg-gradient-to-r from-${event.color}/20 to-${event.color}/5`
                  : isCompleted
                    ? 'border-white/10 bg-cyber-dark/30'
                    : 'border-white/5 bg-cyber-dark/20'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center pt-1">
                  <motion.div
                    animate={
                      isActive
                        ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }
                        : isCompleted
                          ? { scale: 1, opacity: 1 }
                          : { scale: 1, opacity: 0.5 }
                    }
                    transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                    className={`flex items-center justify-center w-6 h-6 rounded-full border-2 
                      ${
                        isActive
                          ? `border-${event.color}/60 bg-${event.color}/20`
                          : isCompleted
                            ? 'border-white/30 bg-white/10'
                            : 'border-white/20 bg-white/5'
                      }`}
                  >
                    <Icon className={`w-3 h-3 ${`text-${event.color}`}`} />
                  </motion.div>
                  {idx < timelineEvents.length - 1 && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      transition={{ delay: idx * 0.1 + 0.2 }}
                      className={`w-0.5 h-8 ${isCompleted ? 'bg-white/20' : 'bg-white/10'}`}
                    />
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-white/80">{event.title}</h4>
                    <motion.span
                      animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
                      transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                      className={`text-[9px] font-mono ${
                        isActive
                          ? `text-${event.color} font-bold`
                          : isCompleted
                            ? 'text-white/40'
                            : 'text-white/30'
                      }`}
                    >
                      {event.time}
                    </motion.span>
                  </div>
                  <p className="text-[10px] text-white/50">{event.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Status indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 pt-4 border-t border-cyber-blue/10 flex items-center gap-2 text-xs text-white/60"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-cyber-green"
        />
        <span>Emergency in progress • Last update 2 seconds ago</span>
      </motion.div>
    </motion.div>
  );
}
