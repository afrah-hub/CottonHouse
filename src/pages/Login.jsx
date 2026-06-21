import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiLoader } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      
      <div className="w-full max-w-md flex flex-col gap-6">
        
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-extrabold text-slate-100 uppercase tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to browse collections and manage your purchases</p>
        </div>

        <div className="glass-card border border-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Decorative glowing gradient blur */}
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
            
            {error && (
              <div className="bg-red-950/40 border border-red-900/30 text-red-400 text-xs font-semibold px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest" htmlFor="login-email-input">Email Address</label>
              <div className="flex items-center relative">
                <FiMail className="absolute left-3 text-slate-500" />
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest" htmlFor="login-password-input">Password</label>
              </div>
              <div className="flex items-center relative">
                <FiLock className="absolute left-3 text-slate-500" />
                <input
                  id="login-password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-login-submit"
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mt-2 text-sm"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <FiLogIn size={15} />
                  <span>Access Account</span>
                </>
              )}
            </button>

            {/* Redirection */}
            <p className="text-xs text-slate-500 text-center mt-3">
              Don't have a profile?{' '}
              <Link to="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                Create one now
              </Link>
            </p>

          </form>

        </div>

        {/* Demo credentials for reviewer convenience */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 text-center text-xs text-slate-500">
          <p className="font-bold text-slate-400 mb-1">Quick Access Accounts</p>
          <p>Customer: <span className="text-indigo-400 font-mono">customer@cottonhouse.com</span> / Pass: <span className="text-indigo-400 font-mono">Customer@123</span></p>
          <p className="mt-1">Admin: <span className="text-purple-400 font-mono">admin@cottonhouse.com</span> / Pass: <span className="text-purple-400 font-mono">Admin@123</span></p>
        </div>

      </div>

    </div>
  );
};

export default Login;
