import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLoginMock } from '../lib/api';
import { useAuthStore } from '../store';
import { motion } from 'motion/react';
import { User as UserIcon, Lock, Mail, ShieldAlert } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const loginAction = useAuthStore(state => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isAdminMode) {
        if (email.toLowerCase() === 'salesadmin' && password === '123456') {
          const data = { token: "admin_token_123", user: { id: 1, name: "Admin", role: "admin" as const } };
          loginAction(data.user, data.token);
          navigate('/dashboard');
        } else {
          setError('Invalid admin credentials. Try again.');
        }
      } else {
        const data = await handleLoginMock(email);
        loginAction(data.user as any, data.token);
        navigate('/shop');
      }
    } catch (err) {
      setError('Invalid credentials. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
      >
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            {isAdminMode ? 'Admin Portal' : (isLogin ? 'Welcome Back' : 'Create an Account')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isAdminMode ? 'Sign in with your administrator credentials' : (isLogin ? 'Sign in to your account to continue' : 'Join Biscuit Bazar for sweet deals')}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center border border-red-100">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isAdminMode && !isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm bg-gray-50"
                  placeholder="Full Name"
                />
              </div>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm bg-gray-50"
                placeholder={isAdminMode ? "Admin ID" : "Email address"}
              />
            </div>
            {(!isAdminMode || isAdminMode) && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full px-3 py-3 pl-10 border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm bg-gray-50"
                  placeholder="Password"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm">
            </div>
            {isLogin && !isAdminMode && (
              <div className="text-sm">
                <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Forgot password?
                </a>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors shadow-lg shadow-emerald-500/30 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isAdminMode ? 'Admin Login' : (isLogin ? 'Sign In' : 'Sign Up'))}
            </button>
          </div>
        </form>

        {!isAdminMode && (
          <div className="text-center mt-4">
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        )}

        {/* Separator and Admin Login Button */}
        <div className="mt-6 border-t border-gray-100 pt-6">
          <button 
            type="button" 
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              setIsLogin(true); // Always force login mode when switching back and forth
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-emerald-600" /> 
            {isAdminMode ? 'Switch to User Portal' : 'Admin Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
