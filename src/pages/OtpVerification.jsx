import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { authAPI } from '../services/api';

const OTP_LENGTH = 6;

export default function OtpVerification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(60);
  const inputs = useRef([]);

  const email = sessionStorage.getItem('sems_signup_email') || '';
  const phone = sessionStorage.getItem('sems_signup_phone') || '';

  useEffect(() => {
    if (!email || !phone) {
      navigate('/signup', { replace: true });
    }
  }, [email, phone, navigate]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    setError('');
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...otp];
    pasted.split('').forEach((digit, i) => {
      next[i] = digit;
    });
    setOtp(next);
    inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await authAPI.verifyOtp({
        email,
        phone,
        otp: code,
      });

      sessionStorage.setItem('sems_otp_verified', 'true');
      if (data?.token) sessionStorage.setItem('sems_signup_token', data.token);
      if (data?.userId) sessionStorage.setItem('sems_signup_userId', data.userId);

      setSuccess('OTP verified successfully!');
      setTimeout(() => navigate('/vehicle-register'), 800);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.response?.status === 400
          ? 'Invalid or expired OTP. Please try again.'
          : 'Verification failed. Ensure your backend is running.');
      setError(msg);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    setError('');
    setSuccess('');

    try {
      await authAPI.resendOtp({ email, phone });
      setSuccess('A new OTP has been sent to your phone');
      setTimer(60);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to resend OTP. Please try again later.'
      );
    } finally {
      setResending(false);
    }
  };

  const maskedPhone =
    phone.length >= 4 ? `+91 ${phone.slice(0, 2)}****${phone.slice(-2)}` : phone;

  if (!email || !phone) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 rounded-2xl bg-cyber-blue/10 flex items-center justify-center mx-auto mb-6"
        >
          <ShieldCheck className="w-8 h-8 text-cyber-blue" />
        </motion.div>

        <h1 className="font-display text-xl font-bold mb-2">Verify OTP</h1>
        <p className="text-sm text-white/40 mb-2">
          Enter the 6-digit code sent to{' '}
          <span className="text-cyber-blue font-mono">{maskedPhone}</span>
        </p>
        <p className="text-xs text-white/25 mb-6 truncate">{email}</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-cyber-red/10 border border-cyber-red/30 text-cyber-red text-sm flex items-start gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-cyber-green/10 border border-cyber-green/30 text-cyber-green text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-2 sm:gap-3 mb-8" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={loading}
                className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-mono font-bold rounded-xl bg-cyber-dark border border-white/10 focus:border-cyber-blue focus:outline-none focus:ring-1 focus:ring-cyber-blue/40 disabled:opacity-50"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length < OTP_LENGTH}
            className="btn-primary w-full"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <p className="mt-6 text-xs text-white/30">
          {timer > 0 ? (
            <>
              Resend OTP in <span className="text-cyber-blue font-mono">{timer}s</span>
            </>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-cyber-blue hover:underline inline-flex items-center gap-1 disabled:opacity-50"
            >
              {resending ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" /> Sending...
                </>
              ) : (
                'Resend OTP'
              )}
            </button>
          )}
        </p>

        <Link to="/signup" className="inline-block mt-4 text-xs text-white/40 hover:text-cyber-blue">
          ← Change phone number
        </Link>
      </motion.div>
    </div>
  );
}
