import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, showToast } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const role = result.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'recruiter') navigate('/recruiter/dashboard');
      else navigate('/seeker/dashboard');
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    const result = await login(demoEmail, demoPassword);
    setLoading(false);

    if (result.success) {
      const role = result.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'recruiter') navigate('/recruiter/dashboard');
      else navigate('/seeker/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-brand-500/25 mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="mt-1.5 text-xs text-slate-500 font-medium">
            Sign in to access your jobs, applications, and dashboards
          </p>
        </div>

        {/* 1-Click Demo Accounts Box */}
        <div className="bg-brand-50/70 border border-brand-200/80 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 block mb-2 text-center">
            ⚡ Quick 1-Click Test Logins (Demo Data)
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('rahul.dev@seeker.com', 'seeker123')}
              className="px-2 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-emerald-700 text-[11px] font-bold shadow-2xs transition-all flex flex-col items-center gap-1"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Job Seeker</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('techcorp@recruiter.com', 'recruiter123')}
              className="px-2 py-2 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-purple-700 text-[11px] font-bold shadow-2xs transition-all flex flex-col items-center gap-1"
            >
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span>Recruiter</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@jobconnect.com', 'admin123')}
              className="px-2 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-rose-700 text-[11px] font-bold shadow-2xs transition-all flex flex-col items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <span>Super Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-brand-500 shadow-2xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-brand-500 shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all hover:scale-101 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 font-medium">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 underline">
              Create an account free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
