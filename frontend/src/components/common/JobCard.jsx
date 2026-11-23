import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Bookmark,
  CheckCircle,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const JobCard = ({ job, onApplyClick, isSavedInitial = false, onSaveToggle }) => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast('Please log in to save jobs', 'error');
      navigate('/login');
      return;
    }

    try {
      setSaving(true);
      const res = await api.post(`/profile/save-job/${job._id}`);
      if (res.data.success) {
        setIsSaved(res.data.isSaved);
        showToast(res.data.message, 'success');
        if (onSaveToggle) onSaveToggle(job._id, res.data.isSaved);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive Salary';
    if (min && max) return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')}`;
    return `₹${(min || max).toLocaleString('en-IN')}`;
  };

  return (
    <div className="group bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 relative flex flex-col justify-between">
      {/* Top row: Logo, Title, Bookmark */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-xl bg-slate-100 border border-slate-200/80 p-2 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Briefcase className="w-6 h-6 text-brand-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <span>{job.company?.name || 'Top Company'}</span>
                {job.company?.isVerified && (
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500" title="Verified Employer" />
                )}
              </div>
              <Link
                to={`/jobs/${job._id}`}
                className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 flex items-center gap-1"
              >
                {job.title}
              </Link>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleSaveToggle}
            disabled={saving}
            className={`p-2 rounded-xl transition-all ${
              isSaved
                ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Saved Job' : 'Save this job'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Tags / Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700">
            {job.jobType}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            {job.workplaceType}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
            {job.experienceLevel}
          </span>
        </div>

        {/* Short details */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mt-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[120px]">{job.location}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-slate-800">
            <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
          </div>
        </div>
      </div>

      {/* Bottom action row */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(job.createdAt).toLocaleDateString()}
        </span>

        <div className="flex items-center gap-2">
          <Link
            to={`/jobs/${job._id}`}
            className="text-xs font-bold text-slate-700 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1"
          >
            Details
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {onApplyClick && (
            <button
              onClick={() => onApplyClick(job)}
              className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition-all"
            >
              Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
