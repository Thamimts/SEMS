import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  Activity,
  Radio,
  Building2,
  Flag,
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Layout from '../components/Layout';
import { adminAPI } from '../services/api';

const MOCK_EMERGENCIES = [
  { id: 'EMG-2847', vehicle: 'DL 01 AB 1234', type: 'Ambulance', status: 'active', location: 'Ring Road', time: '2 min ago', fake: false },
  { id: 'EMG-2846', vehicle: 'DL 05 CD 5678', type: 'Personal', status: 'active', location: 'NH-48', time: '8 min ago', fake: false },
  { id: 'EMG-2845', vehicle: 'DL 09 EF 9012', type: 'Ambulance', status: 'resolved', location: 'AIIMS', time: '25 min ago', fake: false },
  { id: 'EMG-2844', vehicle: 'DL 12 GH 3456', type: 'Personal', status: 'flagged', location: 'Karol Bagh', time: '1 hr ago', fake: true },
];

const emergencyTrend = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 19 },
  { day: 'Wed', count: 15 },
  { day: 'Thu', count: 28 },
  { day: 'Fri', count: 22 },
  { day: 'Sat', count: 35 },
  { day: 'Sun', count: 18 },
];

const trafficData = [
  { hour: '6am', density: 30 },
  { hour: '9am', density: 85 },
  { hour: '12pm', density: 65 },
  { hour: '3pm', density: 70 },
  { hour: '6pm', density: 90 },
  { hour: '9pm', density: 45 },
];

const v2xStats = [
  { name: 'V2V', value: 45, color: '#00d4ff' },
  { name: 'V2I', value: 30, color: '#00ff88' },
  { name: 'V2N', value: 15, color: '#ffb800' },
  { name: 'V2H', value: 10, color: '#8b5cf6' },
];

const verificationLogs = [
  { id: 1, hospital: 'Apollo Emergency', vehicle: 'DL 01 AB 1234', amount: 5000, status: 'verified', time: '10:32 AM' },
  { id: 2, hospital: 'Max Specialty', vehicle: 'DL 05 CD 5678', amount: 5000, status: 'verified', time: '09:15 AM' },
  { id: 3, hospital: 'AIIMS Trauma', vehicle: 'DL 09 EF 9012', amount: 5000, status: 'pending', time: '08:42 AM' },
];

const chartTooltipStyle = {
  contentStyle: { background: '#141c2f', border: '1px solid #1e2a45', borderRadius: '12px' },
  labelStyle: { color: '#fff' },
};

export default function Admin() {
  const [emergencies, setEmergencies] = useState(MOCK_EMERGENCIES);
  const [stats, setStats] = useState({ active: 2, total: 149, fake: 3, avgResponse: '4.2 min' });

  useEffect(() => {
    adminAPI.getEmergencies().then((r) => r.data && setEmergencies(r.data)).catch(() => {});
    adminAPI.getAnalytics().then((r) => r.data && setStats((s) => ({ ...s, ...r.data }))).catch(() => {});
  }, []);

  const handleFlag = async (id) => {
    try {
      await adminAPI.flagFakeEmergency(id);
    } catch {
      /* demo */
    }
    setEmergencies((list) =>
      list.map((e) => (e.id === id ? { ...e, fake: true, status: 'flagged' } : e))
    );
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-cyber-purple" />
            <div>
              <p className="text-xs text-cyber-purple font-mono uppercase tracking-widest">Admin Control Center</p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">Emergency Operations</h1>
            </div>
          </div>
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Emergencies', value: stats.active, icon: AlertTriangle, color: 'text-cyber-red' },
            { label: 'Total Today', value: stats.total, icon: Activity, color: 'text-cyber-blue' },
            { label: 'Fake Detected', value: stats.fake, icon: Flag, color: 'text-cyber-amber' },
            { label: 'Avg Response', value: stats.avgResponse, icon: TrendingUp, color: 'text-cyber-green' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5"
            >
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <p className="text-2xl font-bold font-mono">{s.value}</p>
              <p className="text-xs text-white/40 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Emergency analytics */}
          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-semibold mb-4">EMERGENCY ANALYTICS</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={emergencyTrend}>
                <defs>
                  <linearGradient id="emgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff2d55" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ff2d55" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a45" />
                <XAxis dataKey="day" stroke="#8b9cb3" fontSize={11} />
                <YAxis stroke="#8b9cb3" fontSize={11} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="count" stroke="#ff2d55" fill="url(#emgGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic analytics */}
          <div className="glass-card p-5">
            <h3 className="font-display text-sm font-semibold mb-4">TRAFFIC ANALYTICS</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a45" />
                <XAxis dataKey="hour" stroke="#8b9cb3" fontSize={11} />
                <YAxis stroke="#8b9cb3" fontSize={11} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="density" fill="#00d4ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* V2X stats */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-5 h-5 text-cyber-blue" />
              <h3 className="font-display text-sm font-semibold">V2X COMMUNICATION</h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={v2xStats} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" paddingAngle={4}>
                  {v2xStats.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {v2xStats.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-white/50">{s.name}</span>
                  <span className="font-mono ml-auto">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* V2X line chart */}
          <div className="lg:col-span-2 glass-card p-5">
            <h3 className="font-display text-sm font-semibold mb-4">V2X MESSAGE THROUGHPUT</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart
                data={[
                  { t: '00:00', msgs: 1200 },
                  { t: '04:00', msgs: 800 },
                  { t: '08:00', msgs: 4500 },
                  { t: '12:00', msgs: 6200 },
                  { t: '16:00', msgs: 7800 },
                  { t: '20:00', msgs: 5100 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a45" />
                <XAxis dataKey="t" stroke="#8b9cb3" fontSize={11} />
                <YAxis stroke="#8b9cb3" fontSize={11} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="msgs" stroke="#00ff88" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active emergencies table */}
        <div className="glass-card p-5 mb-8 overflow-x-auto">
          <h3 className="font-display text-sm font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-cyber-red" /> ACTIVE EMERGENCIES MONITORING
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/40 text-xs uppercase border-b border-white/5">
                <th className="text-left py-3 px-2">ID</th>
                <th className="text-left py-3 px-2">Vehicle</th>
                <th className="text-left py-3 px-2">Type</th>
                <th className="text-left py-3 px-2">Location</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-left py-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {emergencies.map((e) => (
                <tr key={e.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-2 font-mono text-cyber-blue">{e.id}</td>
                  <td className="py-3 px-2">{e.vehicle}</td>
                  <td className="py-3 px-2">{e.type}</td>
                  <td className="py-3 px-2 text-white/60">{e.location}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        e.fake
                          ? 'bg-cyber-amber/20 text-cyber-amber'
                          : e.status === 'active'
                            ? 'bg-cyber-red/20 text-cyber-red'
                            : 'bg-cyber-green/20 text-cyber-green'
                      }`}
                    >
                      {e.fake ? 'FAKE' : e.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {!e.fake && e.status === 'active' && (
                      <button
                        onClick={() => handleFlag(e.id)}
                        className="text-xs text-cyber-amber hover:underline flex items-center gap-1"
                      >
                        <Flag size={12} /> Flag Fake
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Verification logs */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-cyber-green" />
            <h3 className="font-display text-sm font-semibold">HOSPITAL VERIFICATION LOGS</h3>
          </div>
          <div className="space-y-3">
            {verificationLogs.map((log) => (
              <div key={log.id} className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-cyber-dark/50">
                <div>
                  <p className="font-medium text-sm">{log.hospital}</p>
                  <p className="text-xs text-white/40">{log.vehicle} • ₹{log.amount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      log.status === 'verified'
                        ? 'bg-cyber-green/20 text-cyber-green'
                        : 'bg-cyber-amber/20 text-cyber-amber'
                    }`}
                  >
                    {log.status.toUpperCase()}
                  </span>
                  <p className="text-[10px] text-white/30 mt-1">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
