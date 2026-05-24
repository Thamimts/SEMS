import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Zap, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authAPI.login({ email, password });
      if (data.user?.bloodGroup) {
        sessionStorage.setItem('sems_blood_group', data.user.bloodGroup);
      }
      login(data.user, data.token);
      navigate('/dashboard');
    } catch {
      login(
        {
          name: 'Demo User',
          email,
          vehicleType: 'Ambulance',
          bloodGroup: sessionStorage.getItem('sems_blood_group') || 'O+',
          role: 'user',
          vehicleRegistered: true,
        },
        'demo-token-' + Date.now()
      );
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-cyber-dark">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255,45,85,0.15), transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(0,212,255,0.15), transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255,45,85,0.15), transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="relative z-10 flex flex-col justify-center p-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyber-red to-cyber-blue flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold tracking-wider">SEMS</h1>
                <p className="text-xs text-white/40 uppercase tracking-[0.3em]">Smart Emergency Mode</p>
              </div>
            </div>
            <h2 className="font-display text-4xl font-bold leading-tight mb-4">
              V2X-Powered
              <br />
              <span className="neon-text-blue">Emergency Response</span>
            </h2>
            <p className="text-white/50 max-w-md leading-relaxed">
              Connect ambulances and personal vehicles to hospitals, traffic infrastructure, and nearby
              drivers through real-time Vehicle-to-Everything communication.
            </p>
            <div className="mt-10 flex gap-6">
              {['V2V', 'V2I', 'V2H', '5.9GHz'].map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs font-mono border border-cyber-blue/30 rounded-full text-cyber-blue">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <h2 className="font-display text-2xl font-bold mb-1 lg:hidden">SEMS Login</h2>
          <p className="text-white/40 text-sm mb-8">Access your emergency dashboard</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-cyber-red/10 border border-cyber-red/30 text-cyber-red text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11 pr-11"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            No account?{' '}
            <Link to="/signup" className="text-cyber-blue hover:underline">
              Create account
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-white/20">
            Demo: any credentials work offline
          </p>
        </motion.div>
      </div>
    </div>
  );
}
