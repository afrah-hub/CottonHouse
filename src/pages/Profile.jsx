import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiEdit2, FiCheck, FiLoader } from 'react-icons/fi';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');

    const res = await updateProfile(name, email);
    if (res.success) {
      setMessage("Profile details updated successfully!");
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 flex flex-col gap-8">
      
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-extrabold text-slate-100 uppercase tracking-tight">Account Settings</h1>
        <p className="text-xs text-slate-500">Manage your profile and communication credentials</p>
      </div>

      <div className="glass-card border border-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        
        {/* Glowing background decor */}
        <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Form Message indicators */}
          {message && (
            <div className="bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2">
              <FiCheck />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-950/40 border border-red-900/30 text-red-400 text-xs font-semibold px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest" htmlFor="profile-name-input">Full Name</label>
            <div className="flex items-center relative">
              <FiUser className="absolute left-3 text-slate-500" />
              <input
                id="profile-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Your Name"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest" htmlFor="profile-email-input">Email Address</label>
            <div className="flex items-center relative">
              <FiMail className="absolute left-3 text-slate-500" />
              <input
                id="profile-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="yourname@example.com"
              />
            </div>
          </div>

          {/* Role Status Tag */}
          <div className="flex justify-between items-center bg-slate-950 border border-slate-900 rounded-xl p-3.5 mt-2">
            <div>
              <span className="text-xs font-bold text-slate-500 block uppercase tracking-widest">Account Clearance</span>
              <span className="text-xs text-slate-300 font-bold block mt-0.5">{user?.role}</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shadow shadow-indigo-500/50" />
          </div>

          {/* Submit Button */}
          <button
            id="btn-profile-submit"
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mt-2 text-sm"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin" />
                <span>Updating Profile...</span>
              </>
            ) : (
              <>
                <FiEdit2 size={14} />
                <span>Update Account</span>
              </>
            )}
          </button>

        </form>

      </div>

    </div>
  );
};

export default Profile;
