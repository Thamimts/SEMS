export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const getBloodGroupColor = (group) => {
  const colors = {
    'O+': 'text-cyber-red border-cyber-red/40 bg-cyber-red/10',
    'O-': 'text-cyber-red border-cyber-red/30 bg-cyber-red/5',
    'A+': 'text-cyber-amber border-cyber-amber/40 bg-cyber-amber/10',
    'A-': 'text-cyber-amber border-cyber-amber/30 bg-cyber-amber/5',
    'B+': 'text-cyber-blue border-cyber-blue/40 bg-cyber-blue/10',
    'B-': 'text-cyber-blue border-cyber-blue/30 bg-cyber-blue/5',
    'AB+': 'text-cyber-purple border-cyber-purple/40 bg-cyber-purple/10',
    'AB-': 'text-cyber-purple border-cyber-purple/30 bg-cyber-purple/5',
  };
  return colors[group] || 'text-white/70 border-white/20 bg-white/5';
};
