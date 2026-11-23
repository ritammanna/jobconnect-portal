import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Users,
  Building2,
  Globe,
  Bookmark,
  CheckCircle,
  Share2,
  ArrowLeft,
  Clock,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, showToast } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // Apply modal
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.job);
        }

        // Check if seeker has applied
        if (user && user.role === 'seeker') {
          try {
            const appsRes = await api.get('/applications/my-applications');
            if (appsRes.data.success) {
              const applied = appsRes.data.applications.some(
                (a) => a.job?._id === id || a.job === id
              );
              setHasApplied(applied);
            }
          } catch (e) {
            console.warn(e);
          }
        }
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id, user]);

  const handleSaveToggle = async () => {
    if (!user) {
      showToast('Please log in to bookmark this job', 'error');
      navigate('/login');
      return;
    }
    try {
      const res = await api.post(`/profile/save-job/${id}`);
      if (res.data.success) {
        setIsSaved(res.data.isSaved);
        showToast(res.data.message, 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please log in to submit your application', 'error');
      navigate('/login');
      return;
    }

    try {
      setApplying(true);
      const res = await api.post(`/applications/${id}`, {
        coverLetter,
        resumeUrl: user.profile?.resumeUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeName: user.profile?.resumeName || `${user.name}_Resume.pdf`,
      });

      if (res.data.success) {
        showToast('Application sent successfully! 🎉', 'success');
        setHasApplied(true);
        setApplyModalOpen(false);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading position details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Position Not Found</h2>
        <p className="text-sm text-slate-500">The job listing you are looking for has been closed or removed.</p>
        <Link to="/jobs" className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive Salary';
    if (min && max) return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')} / yr`;
    return `₹${(min || max).toLocaleString('en-IN')} / yr`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all listings
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 border border-slate-200 p-2.5 flex items-center justify-center overflow-hidden flex-shrink-0">
              {job.company?.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Briefcase className="w-8 h-8 text-brand-600" />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-500">{job.company?.name}</span>
                {job.company?.isVerified && (
                  <CheckCircle className="w-4 h-4 text-blue-500" title="Verified Organization" />
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  Posted {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleSaveToggle}
              className={`p-3 rounded-2xl border transition-all ${
                isSaved
                  ? 'bg-amber-50 border-amber-200 text-amber-500'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
              title="Save Job"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-500' : ''}`} />
            </button>

            {hasApplied ? (
              <div className="px-6 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm flex items-center gap-2 shadow-xs">
                <CheckCircle className="w-4 h-4" />
                Applied Already
              </div>
            ) : (
              <button
                onClick={() => setApplyModalOpen(true)}
                className="flex-1 md:flex-initial px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all hover:scale-102 flex items-center justify-center gap-2"
              >
                <span>Apply for this Position</span>
              </button>
            )}
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-6 border-t border-slate-100">
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-brand-50 text-brand-700 border border-brand-100">
            {job.jobType}
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            {job.workplaceType}
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            {job.experienceLevel}
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
            {job.category}
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 text-slate-600">
            {job.applicantsCount} Applicants
          </span>
        </div>
      </div>

      {/* Grid: Job Details & Company Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description, Responsibilities, Requirements */}
        <div className="lg:col-span-2 space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Role Overview</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Key Responsibilities</h3>
              <ul className="space-y-2.5">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-2 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Qualifications & Requirements</h3>
              <ul className="space-y-2.5">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills tags */}
          {job.skills && job.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Technologies & Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200/70"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Company Snapshot */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              About the Company
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <p className="leading-relaxed">{job.company?.description || 'Leading enterprise in its sector.'}</p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Industry</span>
                  <span className="font-semibold text-slate-800">{job.company?.industry}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Company Size</span>
                  <span className="font-semibold text-slate-800">{job.company?.companySize} Employees</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Location</span>
                  <span className="font-semibold text-slate-800">{job.company?.location}</span>
                </div>
                {job.company?.website && (
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-400 font-medium">Website</span>
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-600 font-bold hover:underline truncate max-w-[150px]"
                    >
                      {job.company.website.replace('https://', '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <div className="p-3 bg-brand-50/70 rounded-2xl border border-brand-100">
            <div className="text-xs font-bold text-slate-800">{job.title}</div>
            <div className="text-[11px] text-slate-500">{job.company?.name} • {job.location}</div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Resume Attached
            </label>
            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 truncate">
                {user?.profile?.resumeName || `${user?.name || 'Applicant'}_Resume.pdf`}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Verified
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Cover Note (Optional)
            </label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Why are you the right fit for this role? Share projects or achievements..."
              className="w-full text-xs bg-white border border-slate-200 rounded-2xl p-3 focus:outline-brand-500 shadow-2xs"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setApplyModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={applying}
              className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 disabled:opacity-50"
            >
              {applying ? 'Submitting...' : 'Send Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default JobDetail;
