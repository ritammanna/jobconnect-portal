import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Search,
  Building2,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  FileText,
  Bookmark,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'recruiter') return '/recruiter/dashboard';
    return '/seeker/dashboard';
  };

  const roleBadge = () => {
    if (!user) return null;
    const styles = {
      admin: 'bg-rose-100 text-rose-700 border-rose-200',
      recruiter: 'bg-purple-100 text-purple-700 border-purple-200',
      seeker: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    const labels = {
      admin: 'Super Admin',
      recruiter: 'Employer',
      seeker: 'Job Seeker',
    };
    return (
      <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border ${styles[user.role]}`}>
        {labels[user.role]}
      </span>
    );
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-brand-700 to-indigo-600 bg-clip-text text-transparent">
                JobConnect
              </span>
              <span className="text-xs text-brand-600 font-semibold block -mt-1 tracking-wide">SMART PORTAL</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/jobs"
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                location.pathname === '/jobs'
                  ? 'text-brand-600'
                  : 'text-slate-600 hover:text-brand-600'
              }`}
            >
              <Search className="w-4 h-4" />
              Find Jobs
            </Link>
            <Link
              to="/companies"
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                location.pathname === '/companies'
                  ? 'text-brand-600'
                  : 'text-slate-600 hover:text-brand-600'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Companies
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Role specific quick action button */}
                {user.role === 'recruiter' && (
                  <Link
                    to="/recruiter/dashboard?tab=post-job"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Post a Job
                  </Link>
                )}

                {user.role === 'seeker' && (
                  <Link
                    to="/seeker/dashboard?tab=applied"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-600" />
                    Applications
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div className="text-left hidden lg:block">
                      <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1.5">
                        {user.name.split(' ')[0]}
                        {roleBadge()}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-none">{user.email}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      onMouseLeave={() => setDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                        <div className="mt-1">{roleBadge()}</div>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-medium transition-colors"
                        >
                          <Briefcase className="w-4 h-4" />
                          Dashboard
                        </Link>

                        {user.role === 'seeker' && (
                          <Link
                            to="/seeker/dashboard?tab=saved"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-medium transition-colors"
                          >
                            <Bookmark className="w-4 h-4" />
                            Saved Jobs
                          </Link>
                        )}

                        {user.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 font-medium transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Admin Moderation
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login?role=recruiter"
                  className="text-xs font-semibold px-3 py-2 text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Employers / Post Job
                </Link>
                <div className="h-4 w-[1px] bg-slate-200"></div>
                <Link
                  to="/login"
                  className="text-xs font-semibold px-4 py-2 text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all hover:scale-102"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            Find Jobs
          </Link>
          <Link
            to="/companies"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            Companies
          </Link>

          {user ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-brand-600"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 text-sm font-semibold text-rose-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-bold bg-brand-600 text-white rounded-lg shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
