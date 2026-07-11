import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiLoader, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-4 py-16 relative overflow-hidden bg-[#F8FAFC]">
      
      {/* Premium ambient light glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-rose-200/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-1/2 right-1/3 w-[250px] h-[250px] bg-amber-100/30 rounded-full blur-[90px] pointer-events-none" />

      <motion.div 
        className="w-full max-w-[440px] flex flex-col gap-6 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        
        {/* Header Section */}
        <motion.div className="flex flex-col gap-2 text-center" variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Sign in to browse collections and manage your purchases
          </p>
        </motion.div>

        {/* Card */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 md:p-10 shadow-[0_24px_50px_-12px_rgba(15,23,42,0.06)] relative overflow-hidden"
          variants={itemVariants}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Error Notification */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200/80 text-red-700 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2.5"
              >
                <FiAlertCircle className="flex-shrink-0 text-red-500" size={15} />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label 
                className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px]" 
                htmlFor="login-email-input"
              >
                Email Address
              </label>
              <div className="flex items-center relative">
                <FiMail className="absolute left-4 text-slate-400" size={16} />
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label 
                  className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px]" 
                  htmlFor="login-password-input"
                >
                  Password
                </label>
              </div>
              <div className="flex items-center relative">
                <FiLock className="absolute left-4 text-slate-400" size={16} />
                <input
                  id="login-password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-xl py-3 pl-11 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded-lg hover:bg-slate-100/80 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              id="btn-login-submit"
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="bg-slate-900 hover:bg-slate-950 text-white font-bold py-3.5 rounded-xl shadow-md shadow-slate-950/10 hover:shadow-lg hover:shadow-slate-950/15 transition-all duration-300 flex items-center justify-center gap-2 mt-2 text-xs uppercase tracking-[2px] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={14} />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <FiLogIn size={14} />
                  <span>Access Account</span>
                </>
              )}
            </motion.button>

            {/* Redirection */}
            <p className="text-xs text-slate-500 text-center mt-2">
              Don't have a profile?{' '}
              <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-500 hover:underline transition-colors">
                Create one now
              </Link>
            </p>

          </form>
        </motion.div>

        {/* Demo Credentials Panel */}
        <motion.div 
          className="bg-white/40 backdrop-blur-md border border-slate-200/50 rounded-2xl p-4 text-xs text-slate-500 shadow-sm"
          variants={itemVariants}
        >
          <p className="font-bold text-slate-700 mb-2 uppercase tracking-wider text-[10px] text-center">Quick Access Accounts</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
              <span className="font-medium text-slate-600">Customer:</span>
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10.5px]">customer@cottonhouse.com</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-600">Admin:</span>
              <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10.5px]">admin@cottonhouse.com</span>
            </div>
            <p className="text-[9.5px] text-center text-slate-400 mt-0.5">Password for both accounts: <span className="font-mono font-semibold">Customer@123</span> / <span className="font-mono font-semibold">Admin@123</span></p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Login;
