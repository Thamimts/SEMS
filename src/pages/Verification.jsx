import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Scan,
  Building2,
  CreditCard,
  CheckCircle,
  Camera,
} from 'lucide-react';
import Layout from '../components/Layout';
import { hospitalAPI } from '../services/api';
import { useEmergency } from '../context/EmergencyContext';
import { useNavigate } from 'react-router-dom';

const STEPS = ['scan', 'arrival', 'deposit', 'complete'];

export default function Verification() {
  const navigate = useNavigate();
  const { deactivateEmergency, hospitals } = useEmergency();
  const [step, setStep] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [depositConfirmed, setDepositConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const hospital = hospitals[0];
  const qrValue = JSON.stringify({
    hospitalId: hospital?.id,
    name: hospital?.name,
    verifyToken: 'SEMS-VRF-' + Date.now(),
  });

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setStep(1);
    }, 2000);
  };

  const handleArrival = () => setStep(2);

  const handleDeposit = async () => {
    setLoading(true);
    try {
      await hospitalAPI.verify({
        hospitalId: hospital?.id,
        depositAmount: 5000,
        emergencyId: 'EMG-ACTIVE',
      });
    } catch {
      /* demo */
    }
    setDepositConfirmed(true);
    setStep(3);
    setLoading(false);
    setTimeout(async () => {
      await deactivateEmergency();
    }, 3000);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-black overflow-hidden">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="text-center p-8"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 m-auto w-64 h-64 rounded-full border border-cyber-green/30"
              animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <CheckCircle className="w-24 h-24 text-cyber-green mx-auto mb-6" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-display text-3xl font-bold text-cyber-green mb-2"
          >
            Emergency Completed
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-white/50 mb-8"
          >
            Hospital verification successful. V2X broadcast deactivated.
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Return to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-4 sm:p-8 max-w-2xl mx-auto">
        <h1 className="font-display text-2xl font-bold mb-2">Hospital Verification</h1>
        <p className="text-white/40 text-sm mb-8">Complete arrival verification at {hospital?.name}</p>

        {/* Progress steps */}
        <div className="flex items-center justify-between mb-10">
          {['QR Scan', 'Arrival', 'Deposit'].map((label, i) => (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  step > i
                    ? 'bg-cyber-green border-cyber-green text-cyber-black'
                    : step === i
                      ? 'border-cyber-blue text-cyber-blue'
                      : 'border-white/20 text-white/30'
                }`}
              >
                {step > i ? '✓' : i + 1}
              </div>
              <span className="text-[10px] text-white/40 mt-1">{label}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8 text-center"
            >
              <QrCode className="w-10 h-10 text-cyber-blue mx-auto mb-4" />
              <h2 className="font-display font-bold mb-2">Scan Hospital QR Code</h2>
              <p className="text-sm text-white/40 mb-6">
                Point your camera at the hospital verification QR code
              </p>

              <div className="relative mx-auto w-64 h-64 mb-6">
                {scanning ? (
                  <div className="w-full h-full rounded-2xl border-2 border-cyber-blue overflow-hidden relative bg-cyber-dark">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-cyber-blue/50" />
                    </div>
                    <motion.div
                      className="absolute inset-x-0 h-1 bg-cyber-blue shadow-neon"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <p className="absolute bottom-4 inset-x-0 text-xs text-cyber-blue">Scanning...</p>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-2xl inline-block">
                    <QRCodeSVG value={qrValue} size={200} level="H" />
                  </div>
                )}
              </div>

              <button onClick={handleScan} disabled={scanning} className="btn-primary w-full flex items-center justify-center gap-2">
                <Scan size={18} />
                {scanning ? 'Scanning...' : 'Start QR Scan'}
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="arrival"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8"
            >
              <Building2 className="w-10 h-10 text-cyber-green mx-auto mb-4" />
              <h2 className="font-display font-bold text-center mb-2">Confirm Hospital Arrival</h2>
              <div className="p-4 rounded-xl bg-cyber-dark/60 my-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Hospital</span>
                  <span className="font-medium">{hospital?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Arrival Time</span>
                  <span className="font-mono">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Status</span>
                  <span className="text-cyber-green font-bold">VERIFIED</span>
                </div>
              </div>
              <button onClick={handleArrival} className="btn-primary w-full">
                Confirm Arrival
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="deposit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8"
            >
              <CreditCard className="w-10 h-10 text-cyber-amber mx-auto mb-4" />
              <h2 className="font-display font-bold text-center mb-2">Emergency Deposit</h2>
              <p className="text-sm text-white/40 text-center mb-6">
                Refundable security deposit for emergency services
              </p>
              <div className="text-center p-6 rounded-xl bg-cyber-dark/60 mb-6">
                <p className="text-white/40 text-sm">Deposit Amount</p>
                <p className="font-display text-4xl font-bold text-cyber-amber mt-1">₹5,000</p>
                <p className="text-[10px] text-white/30 mt-2">Refunded after verification</p>
              </div>
              <button onClick={handleDeposit} disabled={loading || depositConfirmed} className="btn-primary w-full">
                {loading ? 'Processing...' : 'Confirm Deposit & Complete'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
