import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Phone, Trash2, CheckCircle } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EmergencyContacts() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [contacts, setContacts] = useState([
    { name: '', phone: '', relation: 'Family' },
  ]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const addContact = () => {
    if (contacts.length < 5) setContacts([...contacts, { name: '', phone: '', relation: 'Family' }]);
  };

  const removeContact = (i) => setContacts(contacts.filter((_, idx) => idx !== i));

  const updateContact = (i, field, value) => {
    const next = [...contacts];
    next[i] = { ...next[i], [field]: value };
    setContacts(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.setupEmergencyContacts({ contacts });
    } catch {
      /* demo */
    }
    const user = {
      name: 'Emergency User',
      email: sessionStorage.getItem('sems_signup_email') || 'user@sems.io',
      vehicleType: JSON.parse(sessionStorage.getItem('sems_vehicle') || '{}')?.vehicleType || 'ambulance',
      bloodGroup: sessionStorage.getItem('sems_blood_group') || 'O+',
      role: 'user',
      contacts,
    };
    login(user, 'demo-token-' + Date.now());
    setDone(true);
    setTimeout(() => navigate('/dashboard'), 1500);
    setLoading(false);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <CheckCircle className="w-20 h-20 text-cyber-green mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold">Setup Complete!</h2>
          <p className="text-white/40 text-sm mt-2">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl glass-card p-8"
      >
        <span className="text-[10px] font-mono text-cyber-blue">STEP 3/3</span>
        <h1 className="font-display text-2xl font-bold mb-1 mt-1">Emergency Contacts</h1>
        <p className="text-white/40 text-sm mb-6">People to notify during an active emergency</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {contacts.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl bg-cyber-dark/50 border border-white/5 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/40">Contact {i + 1}</span>
                {contacts.length > 1 && (
                  <button type="button" onClick={() => removeContact(i)} className="text-cyber-red p-1">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <input
                value={c.name}
                onChange={(e) => updateContact(i, 'name', e.target.value)}
                className="input-field"
                placeholder="Full name"
                required
              />
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    value={c.phone}
                    onChange={(e) => updateContact(i, 'phone', e.target.value)}
                    className="input-field pl-11"
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
                <select
                  value={c.relation}
                  onChange={(e) => updateContact(i, 'relation', e.target.value)}
                  className="input-field w-32"
                >
                  {['Family', 'Friend', 'Doctor', 'Other'].map((r) => (
                    <option key={r} value={r} className="bg-cyber-dark">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          ))}

          {contacts.length < 5 && (
            <button
              type="button"
              onClick={addContact}
              className="w-full py-3 rounded-xl border border-dashed border-white/20 text-white/50 hover:border-cyber-blue/40 hover:text-cyber-blue flex items-center justify-center gap-2 text-sm transition-colors"
            >
              <UserPlus size={16} /> Add Contact
            </button>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Saving...' : 'Complete Setup & Enter Dashboard'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
