import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Phone, User, Zap, AlertCircle, CheckCircle2, Droplet } from 'lucide-react';
import { authAPI } from '../services/api';
import { BLOOD_GROUPS } from '../constants/bloodGroups';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleType: 'ambulance',
    bloodGroup: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const vehicleTypes = [
    { id: 'ambulance', label: 'Ambulance', icon: '🚑' },
    { id: 'car', label: 'Car', icon: '🚗' },
    { id: 'bike', label: 'Bike', icon: '🏍️' },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email required';
    if (formData.phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Enter a valid 10-digit phone';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be 8+ characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleVehicleSelect = (type) => {
    setFormData(prev => ({ ...prev, vehicleType: type }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (formData.name && formData.phone && formData.bloodGroup) {
        setCurrentStep(2);
      } else {
        setErrors({ form: 'Please fill name, phone, and blood group' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    const phoneDigits = formData.phone.replace(/\D/g, '');

    try {
      const { data } = await authAPI.register({
        name: formData.name,
        email: formData.email,
        phone: phoneDigits,
        password: formData.password,
        vehicleType: formData.vehicleType,
        bloodGroup: formData.bloodGroup,
      });

      sessionStorage.removeItem('sems_otp_verified');
      sessionStorage.setItem('sems_signup_email', formData.email.trim());
      sessionStorage.setItem('sems_signup_phone', phoneDigits);
      sessionStorage.setItem('sems_blood_group', formData.bloodGroup);
      if (data?.userId) sessionStorage.setItem('sems_signup_userId', String(data.userId));

      setSuccess(true);
      setTimeout(() => navigate('/otp'), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please check your details and ensure the backend is running.';
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Glow effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyber-blue opacity-5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyber-red opacity-5 rounded-full blur-3xl" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-cyber-red" />
            <h1 className="text-3xl font-display font-bold text-cyber-blue">SEMS</h1>
          </div>
          <p className="text-cyber-blue/60 font-mono text-sm">Smart Emergency Mode System</p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div className="flex gap-2 mb-8" variants={itemVariants}>
          {[1, 2].map((step) => (
            <div key={step} className="flex-1">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentStep >= step ? 'bg-cyber-blue shadow-neon' : 'bg-cyber-border'
                }`}
              />
              <p className="text-xs text-center mt-2 text-cyber-blue/60 font-mono">
                {step === 1 ? 'Personal' : 'Security'}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Card */}
        <motion.div
          className="bg-cyber-panel border border-cyber-border rounded-lg p-6 backdrop-blur-xl"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {errors.form && (
              <motion.div
                className="bg-cyber-red/10 border border-cyber-red text-cyber-red p-3 rounded flex gap-2 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errors.form}</span>
              </motion.div>
            )}

            {/* Success State */}
            {success && (
              <motion.div
                className="bg-cyber-green/10 border border-cyber-green text-cyber-green p-3 rounded flex gap-2 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Registration successful! Redirecting...</span>
              </motion.div>
            )}

            {currentStep === 1 ? (
              <>
                {/* Name Input */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-mono text-cyber-blue/80 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-cyber-blue/40" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-2 bg-cyber-black border border-cyber-border rounded text-cyber-blue placeholder-cyber-blue/40 focus:outline-none focus:border-cyber-blue focus:shadow-neon transition-all"
                    />
                  </div>
                  {errors.name && <p className="text-cyber-red text-xs mt-1 font-mono">{errors.name}</p>}
                </motion.div>

                {/* Phone Input */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-mono text-cyber-blue/80 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-cyber-blue/40" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      maxLength="10"
                      className="w-full pl-10 pr-4 py-2 bg-cyber-black border border-cyber-border rounded text-cyber-blue placeholder-cyber-blue/40 focus:outline-none focus:border-cyber-blue focus:shadow-neon transition-all"
                    />
                  </div>
                  {errors.phone && <p className="text-cyber-red text-xs mt-1 font-mono">{errors.phone}</p>}
                </motion.div>

                {/* Blood Group */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-mono text-cyber-blue/80 mb-2">Blood Group</label>
                  <div className="relative">
                    <Droplet className="absolute left-3 top-3 w-4 h-4 text-cyber-red/60" />
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 bg-cyber-black border border-cyber-border rounded text-cyber-blue focus:outline-none focus:border-cyber-blue focus:shadow-neon transition-all appearance-none"
                    >
                      <option value="" className="bg-cyber-dark">
                        Select blood group
                      </option>
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg} className="bg-cyber-dark">
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.bloodGroup && (
                    <p className="text-cyber-red text-xs mt-1 font-mono">{errors.bloodGroup}</p>
                  )}
                </motion.div>

                {/* Vehicle Type Selection */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-mono text-cyber-blue/80 mb-3">Vehicle Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {vehicleTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        type="button"
                        onClick={() => handleVehicleSelect(type.id)}
                        className={`p-3 rounded border transition-all text-center text-xs font-mono ${
                          formData.vehicleType === type.id
                            ? 'border-cyber-blue bg-cyber-blue/10 text-cyber-blue shadow-neon'
                            : 'border-cyber-border bg-transparent text-cyber-blue/60 hover:border-cyber-blue/50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-2xl mb-1">{type.icon}</div>
                        <div>{type.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Next Button */}
                <motion.button
                  type="button"
                  onClick={handleNext}
                  className="w-full mt-6 py-2 bg-cyber-blue text-cyber-black font-bold rounded hover:shadow-neon transition-all font-mono"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Next Step
                </motion.button>
              </>
            ) : (
              <>
                {/* Email Input */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-mono text-cyber-blue/80 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-cyber-blue/40" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-2 bg-cyber-black border border-cyber-border rounded text-cyber-blue placeholder-cyber-blue/40 focus:outline-none focus:border-cyber-blue focus:shadow-neon transition-all"
                    />
                  </div>
                  {errors.email && <p className="text-cyber-red text-xs mt-1 font-mono">{errors.email}</p>}
                </motion.div>

                {/* Password Input */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-mono text-cyber-blue/80 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-cyber-blue/40" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Min 8 characters"
                      className="w-full pl-10 pr-4 py-2 bg-cyber-black border border-cyber-border rounded text-cyber-blue placeholder-cyber-blue/40 focus:outline-none focus:border-cyber-blue focus:shadow-neon transition-all"
                    />
                  </div>
                  {errors.password && <p className="text-cyber-red text-xs mt-1 font-mono">{errors.password}</p>}
                </motion.div>

                {/* Confirm Password Input */}
                <motion.div variants={itemVariants}>
                  <label className="block text-xs font-mono text-cyber-blue/80 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-cyber-blue/40" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm password"
                      className="w-full pl-10 pr-4 py-2 bg-cyber-black border border-cyber-border rounded text-cyber-blue placeholder-cyber-blue/40 focus:outline-none focus:border-cyber-blue focus:shadow-neon transition-all"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-cyber-red text-xs mt-1 font-mono">{errors.confirmPassword}</p>
                  )}
                </motion.div>

                {/* Button Group */}
                <div className="flex gap-3 mt-6">
                  <motion.button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-2 border border-cyber-border text-cyber-blue rounded hover:border-cyber-blue transition-all font-mono text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 bg-cyber-blue text-cyber-black font-bold rounded hover:shadow-neon transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Signing up...' : 'Register'}
                  </motion.button>
                </div>
              </>
            )}
          </form>

          {/* Login Link */}
          <motion.p className="text-center text-xs text-cyber-blue/60 mt-4 font-mono" variants={itemVariants}>
            Already have account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-cyber-blue hover:text-cyber-red transition-colors"
            >
              Login
            </button>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;