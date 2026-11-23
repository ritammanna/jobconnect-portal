import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  PlusCircle,
  Building,
  CheckCircle,
  XCircle,
  Calendar,
  Video,
  FileText,
  Trash2,
  Edit,
  ExternalLink,
  Search,
  Filter,
  Check,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Modal from '../../components/common/Modal';

const RecruiterDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'jobs');

  // Data states
  const [myJobs, setMyJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobCategory, setJobCategory] = useState('Development & IT');
  const [jobType, setJobType] = useState('Full-time');
  const [workplaceType, setWorkplaceType] = useState('Remote');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [jobLocation, setJobLocation] = useState('Remote');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [skills, setSkills] = useState('');
  const [postingJob, setPostingJob] = useState(false);

  // Schedule Interview Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('11:00 AM');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/new');
  const [instructions, setInstructions] = useState('Technical discussion round');
  const [scheduling, setScheduling] = useState(false);

  // Edit Company Profile State
  const [compName, setCompName] = useState('');
  const [compTagline, setCompTagline] = useState('');
  const [compDesc, setCompDesc] = useState('');
  const [compIndustry, setCompIndustry] = useState('');
  const [compSize, setCompSize] = useState('11-50');
  const [compLocation, setCompLocation] = useState('');
  const [compWebsite, setCompWebsite] = useState('');
  const [compLogo, setCompLogo] = useState('');
  const [savingCompany, setSavingCompany] = useState(false);

  const fetchRecruiterData = async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes, compRes] = await Promise.all([
        api.get('/jobs/recruiter/my-jobs'),
        api.get('/applications/recruiter/applicants'),
        api.get('/companies/me'),
      ]);

      if (jobsRes.data.success) setMyJobs(jobsRes.data.jobs);
      if (appsRes.data.success) setApplicants(appsRes.data.applications);
      if (compRes.data.success) {
        const c = compRes.data.company;
        setCompany(c);
        setCompName(c.name || '');
        setCompTagline(c.tagline || '');
        setCompDesc(c.description || '');
        setCompIndustry(c.industry || '');
        setCompSize(c.companySize || '11-50');
        setCompLocation(c.location || '');
        setCompWebsite(c.website || '');
        setCompLogo(c.logo || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Create Job
  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!jobTitle || !description) {
      showToast('Please provide a title and description', 'error');
      return;
    }

    try {
      setPostingJob(true);
      const res = await api.post('/jobs', {
        title: jobTitle,
        category: jobCategory,
        jobType,
        workplaceType,
        experienceLevel,
        salaryMin: Number(salaryMin) || 0,
        salaryMax: Number(salaryMax) || 0,
        location: jobLocation,
        description,
        requirements,
        responsibilities,
        skills,
        status: 'Published',
      });

      if (res.data.success) {
        showToast('Job posted successfully! 🚀', 'success');
        // Reset form
        setJobTitle('');
        setDescription('');
        setRequirements('');
        setResponsibilities('');
        setSkills('');
        setSalaryMin('');
        setSalaryMax('');
        fetchRecruiterData();
        handleTabChange('jobs');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setPostingJob(false);
    }
  };

  // Delete Job
  const handleDeleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job listing?')) return;
    try {
      const res = await api.delete(`/jobs/${jobId}`);
      if (res.data.success) {
        showToast('Job deleted', 'success');
        fetchRecruiterData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Update Application Status
  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        showToast(`Candidate status updated to: ${newStatus}`, 'success');
        fetchRecruiterData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Open Schedule Interview Modal
  const openScheduleModal = (app) => {
    setSelectedApp(app);
    setInterviewDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setScheduleModalOpen(true);
  };

  // Submit Scheduled Interview
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setScheduling(true);
      const res = await api.put(`/applications/${selectedApp._id}/schedule-interview`, {
        date: interviewDate,
        time: interviewTime,
        meetingLink,
        instructions,
      });

      if (res.data.success) {
        showToast('Interview scheduled and candidate notified! 📅', 'success');
        setScheduleModalOpen(false);
        fetchRecruiterData();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setScheduling(false);
    }
  };

  // Save Company Profile
  const handleSaveCompany = async (e) => {
    e.preventDefault();
    try {
      setSavingCompany(true);
      const res = await api.put('/companies/me', {
        name: compName,
        tagline: compTagline,
        description: compDesc,
        industry: compIndustry,
        companySize: compSize,
        location: compLocation,
        website: compWebsite,
        logo: compLogo,
      });

      if (res.data.success) {
        setCompany(res.data.company);
        showToast('Company profile updated successfully! 🏢', 'success');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingCompany(false);
    }
  };

  // Computed stats
  const totalJobsCount = myJobs.length;
  const activeJobsCount = myJobs.filter((j) => j.status === 'Published').length;
  const totalApplicantsCount = applicants.length;
  const shortlistedCount = applicants.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Interview Scheduled'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome Card with Recruiter stats */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-100 border border-purple-200 p-2 overflow-hidden flex items-center justify-center">
            {company?.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Building className="w-8 h-8 text-purple-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{company?.name || user?.name}</h1>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Employer Dashboard
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{company?.tagline || 'Leading Technical Team'}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{company?.location} • {user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => handleTabChange('post-job')}
          className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Position
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Posted Jobs</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalJobsCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Published</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{activeJobsCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Applicants</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-600 mt-1">{totalApplicantsCount}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Shortlisted / Interview</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-1">{shortlistedCount}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => handleTabChange('jobs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'jobs'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Manage Jobs ({myJobs.length})
        </button>

        <button
          onClick={() => handleTabChange('applicants')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'applicants'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Applicants Manager ({applicants.length})
        </button>

        <button
          onClick={() => handleTabChange('post-job')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'post-job'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Post a Job
        </button>

        <button
          onClick={() => handleTabChange('company')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'company'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          Company Profile
        </button>
      </div>

      {/* TAB 1: MANAGE JOBS */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">All Posted Job Openings</h3>
            <button
              onClick={() => handleTabChange('post-job')}
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              + Create new listing
            </button>
          </div>

          {myJobs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No jobs posted yet</p>
              <button
                onClick={() => handleTabChange('post-job')}
                className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-3.5">Job Title</th>
                    <th className="px-6 py-3.5">Category & Type</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Applicants</th>
                    <th className="px-6 py-3.5">Posted Date</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/jobs/${job._id}`} className="font-bold text-slate-900 hover:text-brand-600">
                          {job.title}
                        </Link>
                        <div className="text-[11px] text-slate-400">{job.location}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div>{job.category}</div>
                        <div className="text-[11px] font-semibold text-brand-600">{job.jobType}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleTabChange('applicants')}
                          className="font-bold text-brand-600 hover:underline"
                        >
                          {job.applicantsCount || 0} Candidates
                        </button>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/jobs/${job._id}`}
                            className="p-1.5 text-slate-400 hover:text-brand-600"
                            title="View Public Link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: APPLICANTS MANAGER */}
      {activeTab === 'applicants' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Applicant Review & Interview Pipeline</h3>
            <span className="text-xs font-semibold text-slate-500">
              Total: {applicants.length} Applicants
            </span>
          </div>

          {applicants.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">
              No applications received yet for your posted jobs.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-3.5">Candidate</th>
                    <th className="px-6 py-3.5">Job Position</th>
                    <th className="px-6 py-3.5">Resume</th>
                    <th className="px-6 py-3.5">Current Status</th>
                    <th className="px-6 py-3.5">Applied Date</th>
                    <th className="px-6 py-3.5 text-right">Action Pipeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applicants.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.seeker?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.seeker?.name}`}
                            alt={app.seeker?.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{app.seeker?.name}</div>
                            <div className="text-[11px] text-slate-400">{app.seeker?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {app.job?.title}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-brand-600 hover:underline"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Resume</span>
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-100">
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                          </select>

                          <button
                            onClick={() => openScheduleModal(app)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                            title="Schedule Interview"
                          >
                            <Calendar className="w-3 h-3" />
                            Interview
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: POST A JOB FORM */}
      {activeTab === 'post-job' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-4xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Publish a New Job Listing</h3>
            <p className="text-xs text-slate-500 mt-0.5">Fill in the details to attract high-quality candidates</p>
          </div>

          <form onSubmit={handleCreateJob} className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Full Stack MERN Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500 shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Category
                </label>
                <select
                  value={jobCategory}
                  onChange={(e) => setJobCategory(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500 shadow-2xs"
                >
                  <option value="Development & IT">Development & IT</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Data & Analytics">Data & Analytics</option>
                  <option value="Customer Support">Customer Support</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Job Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500 shadow-2xs"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Workplace Mode
                </label>
                <select
                  value={workplaceType}
                  onChange={(e) => setWorkplaceType(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500 shadow-2xs"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500 shadow-2xs"
                >
                  <option value="Fresher">Fresher</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Min Salary (₹ INR / yr)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500000"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Max Salary (₹ INR / yr)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1200000"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500 shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Location
              </label>
              <input
                type="text"
                required
                placeholder="e.g. San Francisco, CA or 'Remote'"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500 shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Full Job Description *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Describe the opportunity, mission, team, and day-to-day impact..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500 shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Key Responsibilities (One per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Build React interfaces&#10;Optimize backend MongoDB queries&#10;Lead sprint releases"
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500 shadow-2xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Requirements & Qualifications (One per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="3+ years React experience&#10;Proficiency in Node.js&#10;BS in Computer Science or equivalent"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500 shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Required Skills (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind, TypeScript"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500 shadow-2xs"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={postingJob}
                className="px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50"
              >
                {postingJob ? 'Publishing...' : 'Publish Job Listing'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: COMPANY PROFILE */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Company Information</h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage public company details shown on your job cards</p>
          </div>

          <form onSubmit={handleSaveCompany} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Scaling enterprise cloud architectures"
                  value={compTagline}
                  onChange={(e) => setCompTagline(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={compIndustry}
                  onChange={(e) => setCompIndustry(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Team Size
                </label>
                <select
                  value={compSize}
                  onChange={(e) => setCompSize(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  HQ Location
                </label>
                <input
                  type="text"
                  value={compLocation}
                  onChange={(e) => setCompLocation(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={compWebsite}
                  onChange={(e) => setCompWebsite(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Company Description
              </label>
              <textarea
                rows={4}
                value={compDesc}
                onChange={(e) => setCompDesc(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-brand-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={savingCompany}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50"
              >
                {savingCompany ? 'Saving...' : 'Update Company Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title={`Schedule Interview: ${selectedApp?.seeker?.name}`}
      >
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div className="p-3 bg-brand-50 rounded-xl border border-brand-100 text-xs text-brand-900 font-medium">
            Candidate: <span className="font-bold">{selectedApp?.seeker?.name}</span> for role:{' '}
            <span className="font-bold">{selectedApp?.job?.title}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Time
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 11:00 AM EST"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Google Meet / Zoom Meeting Link
            </label>
            <input
              type="text"
              required
              placeholder="https://meet.google.com/abc-defg-hij"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Instructions for Candidate
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Please bring your code editor open for live coding round..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-brand-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setScheduleModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={scheduling}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {scheduling ? 'Scheduling...' : 'Confirm & Notify Candidate'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecruiterDashboard;
