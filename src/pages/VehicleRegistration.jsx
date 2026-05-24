import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Truck, Siren, Hash, Palette, FileText } from 'lucide-react';
import { vehicleAPI } from '../services/api';

const vehicleTypes = [
  { id: 'ambulance', label: 'Ambulance', icon: Siren },
  { id: 'personal', label: 'Personal Car', icon: Car },
  { id: 'commercial', label: 'Commercial', icon: Truck },
];

export default function VehicleRegistration() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('sems_otp_verified') !== 'true') {
      navigate('/otp', { replace: true });
    }
  }, [navigate]);

  const [type, setType] = useState('ambulance');
  const [form, setForm] = useState({
    plateNumber: '',
    model: '',
    color: '',
    registrationDoc: '',
    v2xDeviceId: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vehicleAPI.register({ ...form, vehicleType: type });
    } catch {
      /* continue onboarding if API unavailable */
    }
    sessionStorage.setItem('sems_vehicle', JSON.stringify({ ...form, vehicleType: type }));
    navigate('/emergency-contacts');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl glass-card p-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono text-cyber-blue">STEP 2/3</span>
        </div>
        <h1 className="font-display text-2xl font-bold mb-1">Vehicle Registration</h1>
        <p className="text-white/40 text-sm mb-6">Register your vehicle for V2X emergency communication</p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {vehicleTypes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setType(id)}
              className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                type === id
                  ? 'border-cyber-blue bg-cyber-blue/10 text-cyber-blue'
                  : 'border-white/10 hover:border-white/20 text-white/50'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { field: 'plateNumber', label: 'License Plate', icon: Hash, placeholder: 'DL 01 AB 1234' },
            { field: 'model', label: 'Vehicle Model', icon: Car, placeholder: 'Toyota Innova Crysta' },
            { field: 'color', label: 'Color', icon: Palette, placeholder: 'White' },
            { field: 'registrationDoc', label: 'Registration Number', icon: FileText, placeholder: 'RC-XXXX-XXXX' },
            { field: 'v2xDeviceId', label: 'V2X Device ID (Optional)', icon: Hash, placeholder: 'V2X-DSRC-001' },
          ].map(({ field, label, icon: Icon, placeholder }) => (
            <div key={field}>
              <label className="text-xs text-white/50 uppercase tracking-wider mb-1.5 block">{label}</label>
              <div className="relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  value={form[field]}
                  onChange={update(field)}
                  className="input-field pl-11"
                  placeholder={placeholder}
                  required={field !== 'v2xDeviceId'}
                />
              </div>
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Registering...' : 'Register Vehicle'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
