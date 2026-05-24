import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  MapPin,
  QrCode,
  Shield,
  LogOut,
  Radio,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tracking', label: 'Live Track', icon: MapPin },
  { path: '/verification', label: 'Verify', icon: QrCode },
  { path: '/admin', label: 'Admin', icon: Shield },
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isActive, connectedVehicles, v2xStatus } = useEmergency();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-cyber-dark/80 backdrop-blur-xl">
        <div className="p-6 border-b border-white/5">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-red to-cyber-blue flex items-center justify-center font-display font-bold text-sm">
              S
            </div>
            <div>
              <h1 className="font-display font-bold text-sm tracking-wider">SEMS</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">V2X Emergency</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{label}</span>
                {path === '/tracking' && isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-cyber-red animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="glass-card p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white/50 flex items-center gap-1">
                <Radio size={12} className={v2xStatus.connected ? 'text-cyber-green' : 'text-cyber-red'} />
                V2X Network
              </span>
              <span className={v2xStatus.connected ? 'text-cyber-green' : 'text-cyber-red'}>
                {v2xStatus.connected ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="flex justify-between text-white/40">
              <span>Connected</span>
              <span className="font-mono text-cyber-blue">{connectedVehicles.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-blue flex items-center justify-center text-xs font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.vehicleType || 'Vehicle'}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-white/40 hover:text-cyber-red transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-cyber-dark/95 backdrop-blur-xl border-b border-white/5">
        <Link to="/dashboard" className="font-display font-bold text-sm">SEMS</Link>
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-cyber-red/20 text-cyber-red rounded-full animate-pulse">
              EMERGENCY
            </span>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden fixed inset-x-0 top-14 z-30 bg-cyber-dark border-b border-white/10 p-4 space-y-1"
        >
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-cyber-red">
            <LogOut size={18} /> Logout
          </button>
        </motion.nav>
      )}

      <main className="flex-1 min-h-0 overflow-auto">{children}</main>
    </div>
  );
}
