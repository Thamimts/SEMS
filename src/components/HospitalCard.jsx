import { motion } from 'framer-motion';
import { Building2, Clock, Bed, Star, Navigation } from 'lucide-react';

export default function HospitalCard({ hospital, index = 0, onSelect, selected }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => onSelect?.(hospital)}
      className={`glass-card-hover p-4 cursor-pointer ${
        selected ? 'border-cyber-blue/60 ring-1 ring-cyber-blue/30' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyber-blue/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-cyber-blue" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{hospital.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 text-cyber-amber fill-cyber-amber" />
              <span className="text-xs text-white/50">{hospital.rating}</span>
            </div>
          </div>
        </div>
        {index === 0 && (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-cyber-green/20 text-cyber-green rounded-full">
            NEAREST
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="text-center p-2 rounded-lg bg-cyber-dark/50">
          <Navigation className="w-3.5 h-3.5 text-cyber-blue mx-auto mb-1" />
          <p className="text-xs font-mono font-bold">{hospital.distance} km</p>
          <p className="text-[10px] text-white/30">Distance</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-cyber-dark/50">
          <Clock className="w-3.5 h-3.5 text-cyber-amber mx-auto mb-1" />
          <p className="text-xs font-mono font-bold">{hospital.eta} min</p>
          <p className="text-[10px] text-white/30">ETA</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-cyber-dark/50">
          <Bed className="w-3.5 h-3.5 text-cyber-green mx-auto mb-1" />
          <p className="text-xs font-mono font-bold">{hospital.beds}</p>
          <p className="text-[10px] text-white/30">Beds</p>
        </div>
      </div>
    </motion.div>
  );
}
