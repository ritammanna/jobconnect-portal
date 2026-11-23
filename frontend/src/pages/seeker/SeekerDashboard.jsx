import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Bookmark,
  User,
  CheckCircle2,
  Clock,
  Calendar,
  Video,
  Upload,
  Plus,
  X,
  Trash2,
  ArrowUpRight,
  Bell,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const SeekerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, refreshUser, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'applied');

  // Data states
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('Remote');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Resume upload state
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [appsRes, savedRes, profRes, notifRes] = await Promise.all([
        api.get('/applications/my-applications'),
        api.get('/profile/saved-jobs'),
        api.get('/profile'),
        api.get('/profile/notifications'),
      ]);

      if (appsRes.data.success) setApplications(appsRes.data.applications);
      if (savedRes.data.success) setSavedJobs(savedRes.data.jobs);
      if (notifRes.data.success) setNotifications(notifRes.data.notifications);
      if (profRes.data.success) {
        const p = profRes.data.profile;
        setProfile(p);
        setHeadline(p.headline || '');
        setBio(p.bio || '');
        setPhone(p.phone || '');
        setLocation(p.location || '');
        setExpectedSalary(p.expectedSalary || '');
        setPreferredLocation(p.preferredLocation || 'Remote');
        setSkills(p.skills || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await api.put('/profile', {
        headline,
        bio,
        phone,
        location,
        expectedSalary,
        preferredLocation,
        skills,
      });

      if (res.data.success) {
        setProfile(res.data.profile);
        showToast('Profile updated successfully! ✨', 'success');
        refreshUser();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      showToast('Please select a PDF file first', 'error');
      return;
    }

    try {
      setUploadingResume(true);
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const res = await api.post('/profile/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setProfile(res.data.profile);
        showToast('Resume uploaded and attached! 📄', 'success');
        setResumeFile(null);
        refreshUser();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleWithdrawApplication = async (appId) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;
    try {
      const res = await api.put(`/applications/${appId}/withdraw`);
      if (res.data.success) {
        showToast('Application withdrawn', 'success');
        fetchDashboardData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      'Applied': { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
      'Under Review': { bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: FileText },
      'Shortlisted': { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: Sparkles },
      'Interview Scheduled': { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Calendar },
      'Accepted': { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: CheckCircle2 },
      'Rejected': { bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: X },
      'Withdrawn': { bg: 'bg-slate-100 text-slate-600 border-slate-200', icon: X },
    };

    const current = config[status] || { bg: 'bg-slate-50 text-slate-700 border-slate-200', icon: Clock };
    const Icon = current.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${current.bg}`}>
        <Icon className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user?.name}</h1>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Job Seeker
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{profile?.headline || 'Passionate Developer'}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{user?.email} • {profile?.location || 'Remote'}</p>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="w-full md:w-64 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700">Profile Strength</span>
            <span className="text-brand-600">{profile?.profileCompletion || 65}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${profile?.profileCompletion || 65}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => handleTabChange('applied')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'applied'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Applied Jobs ({applications.length})
        </button>

        <button
          onClick={() => handleTabChange('saved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'saved'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Saved Jobs ({savedJobs.length})
        </button>

        <button
          onClick={() => handleTabChange('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          Edit Profile & Resume
        </button>

        <button
          onClick={() => handleTabChange('notifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notifications ({notifications.filter((n) => !n.isRead).length})
        </button>
      </div>

      {/* TAB 1: APPLIED JOBS */}
      {activeTab === 'applied' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">You haven't applied to any jobs yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Discover active openings in tech, design, and management and apply in 1-click.
              </p>
              <Link to="/jobs" className="inline-block px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm">
                Explore Jobs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 p-2 flex items-center justify-center flex-shrink-0">
                      {app.job?.company?.logo ? (
                        <img
                          src={app.job.company.logo}
                          alt={app.job.company.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Briefcase className="w-6 h-6 text-brand-600" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-slate-400">
                        {app.job?.company?.name || 'Top Company'}
                      </div>
                      <Link
                        to={`/jobs/${app.job?._id}`}
                        className="text-base font-bold text-slate-900 hover:text-brand-600 transition-colors"
                      >
                        {app.job?.title}
                      </Link>
                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span>{app.job?.location}</span>
                        <span>•</span>
                        <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between">
                    <div>{getStatusBadge(app.status)}</div>

                    {/* Interview Link if status is Interview Scheduled */}
                    {app.status === 'Interview Scheduled' && app.interviewDetails?.meetingLink && (
                      <a
                        href={app.interviewDetails.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join Interview
                      </a>
                    )}

                    {app.status === 'Applied' && (
                      <button
                        onClick={() => handleWithdrawApplication(app._id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SAVED JOBS */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No saved jobs yet</h3>
              <p className="text-xs text-slate-500">Bookmark interesting roles to review and apply anytime.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-500">{job.company?.name}</div>
                    <Link to={`/jobs/${job._id}`} className="text-base font-bold text-slate-900 hover:text-brand-600">
                      {job.title}
                    </Link>
                    <div className="text-xs text-slate-500">{job.location} • {job.jobType}</div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600">${job.salaryMin?.toLocaleString()}</span>
                    <Link
                      to={`/jobs/${job._id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
                    >
                      View & Apply
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROFILE & RESUME */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main profile form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Personal & Professional Information
            </h3>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack MERN Developer | React & Node.js"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Current Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kolkata, India"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Expected Salary (USD)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $85,000 / yr"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                    Workplace Preference
                  </label>
                  <select
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  About Me / Bio
                </label>
                <textarea
                  rows={4}
                  placeholder="Share a short summary of your background, achievements, and career aspirations..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500"
                />
              </div>

              {/* Skills manager */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
                  Key Skills & Technologies
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add a skill (e.g. Docker, GraphQL)..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-brand-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-50 text-brand-700 text-xs font-semibold border border-brand-100"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="p-0.5 hover:bg-brand-200 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Resume Uploader */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600" />
                Resume Management
              </h3>

              {profile?.resumeUrl ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800">Active Resume</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded-full">
                      Attached
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 truncate">{profile.resumeName}</p>
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline pt-1"
                  >
                    Preview Current Resume
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                  No resume uploaded yet. Upload your PDF so recruiters can review your credentials.
                </div>
              )}

              {/* Upload New Resume */}
              <form onSubmit={handleResumeUpload} className="space-y-3 pt-2">
                <label className="text-xs font-bold text-slate-700 block">Upload New Resume (PDF / DOC)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
                />
                <button
                  type="submit"
                  disabled={uploadingResume || !resumeFile}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingResume ? 'Uploading...' : 'Upload & Save Resume'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
            System & Application Notifications
          </h3>

          {notifications.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No notifications yet.</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  className={`p-4 rounded-2xl border transition-colors flex items-start gap-3 ${
                    n.isRead ? 'bg-slate-50/50 border-slate-100' : 'bg-brand-50/40 border-brand-200'
                  }`}
                >
                  <Bell className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-0.5 flex-1">
                    <div className="text-xs font-bold text-slate-800">{n.title}</div>
                    <div className="text-xs text-slate-600">{n.message}</div>
                    <div className="text-[10px] text-slate-400 pt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;
