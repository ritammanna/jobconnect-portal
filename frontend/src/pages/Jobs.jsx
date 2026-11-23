import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from 'lucide-react';
import api from '../services/api';
import JobCard from '../components/common/JobCard';
import Modal from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, showToast } = useAuth();

  // Filter states
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || 'All');
  const [workplaceType, setWorkplaceType] = useState(searchParams.get('workplaceType') || 'All');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || 'All');
  const [minSalary, setMinSalary] = useState(searchParams.get('minSalary') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Data states
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Quick Apply Modal states
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/jobs/categories');
        if (res.data.success) setCategories(res.data.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch filtered jobs whenever filters or page change
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (location) params.append('location', location);
      if (category && category !== 'All Categories') params.append('category', category);
      if (jobType && jobType !== 'All') params.append('jobType', jobType);
      if (workplaceType && workplaceType !== 'All') params.append('workplaceType', workplaceType);
      if (experienceLevel && experienceLevel !== 'All') params.append('experienceLevel', experienceLevel);
      if (minSalary) params.append('minSalary', minSalary);
      if (sort) params.append('sort', sort);
      params.append('page', page.toString());
      params.append('limit', '9');

      setSearchParams(params);

      const res = await api.get(`/jobs?${params.toString()}`);
      if (res.data.success) {
        setJobs(res.data.jobs);
        setTotalJobs(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category, jobType, workplaceType, experienceLevel, minSalary, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleClearFilters = () => {
    setKeyword('');
    setLocation('');
    setCategory('All Categories');
    setJobType('All');
    setWorkplaceType('All');
    setExperienceLevel('All');
    setMinSalary('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  const handleOpenApplyModal = (job) => {
    if (!user) {
      showToast('Please log in as a Job Seeker to apply', 'error');
      return;
    }
    if (user.role !== 'seeker') {
      showToast('Only Job Seekers can apply for positions', 'error');
      return;
    }
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      setApplying(true);
      const res = await api.post(`/applications/${selectedJob._id}`, {
        coverLetter,
        resumeUrl: user.profile?.resumeUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resumeName: user.profile?.resumeName || `${user.name}_Resume.pdf`,
      });

      if (res.data.success) {
        showToast('Application submitted successfully! 🚀', 'success');
        setApplyModalOpen(false);
        setCoverLetter('');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setApplying(false);
    }
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-brand-500 shadow-2xs"
        >
          <option value="All Categories">All Categories</option>
          {categories.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} ({c.count})
            </option>
          ))}
        </select>
      </div>

      {/* Job Type */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Job Type</label>
        <div className="space-y-1.5">
          {['All', 'Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'].map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-brand-600">
              <input
                type="radio"
                name="jobType"
                checked={jobType === type}
                onChange={() => { setJobType(type); setPage(1); }}
                className="text-brand-600 focus:ring-brand-500"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Workplace Type */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Workplace Type</label>
        <div className="space-y-1.5">
          {['All', 'Remote', 'Hybrid', 'On-site'].map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-brand-600">
              <input
                type="radio"
                name="workplaceType"
                checked={workplaceType === type}
                onChange={() => { setWorkplaceType(type); setPage(1); }}
                className="text-brand-600 focus:ring-brand-500"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Experience Level</label>
        <div className="space-y-1.5">
          {['All', 'Fresher', '1-3 Years', '3-5 Years', '5+ Years'].map((exp) => (
            <label key={exp} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-brand-600">
              <input
                type="radio"
                name="experienceLevel"
                checked={experienceLevel === exp}
                onChange={() => { setExperienceLevel(exp); setPage(1); }}
                className="text-brand-600 focus:ring-brand-500"
              />
              <span>{exp}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Min Salary Filter */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Min Salary (₹ INR / yr)</label>
        <div className="relative">
          <span className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 font-bold text-xs">₹</span>
          <input
            type="number"
            placeholder="e.g. 500000"
            value={minSalary}
            onChange={(e) => { setMinSalary(e.target.value); setPage(1); }}
            className="w-full text-sm pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-brand-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={handleClearFilters}
        className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset All Filters
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Search bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 w-full">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by role, skill, or keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 w-full">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Location or 'Remote'..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition-all"
          >
            Filter
          </button>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter Options
          </button>
        </form>
      </div>

      {/* Main Grid: Sidebar Filters + Jobs Results */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden md:block col-span-1 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs h-fit sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <Filter className="w-4 h-4 text-brand-600" />
              Filter Jobs
            </h3>
            {(category !== 'All Categories' || jobType !== 'All' || workplaceType !== 'All' || experienceLevel !== 'All' || minSalary) && (
              <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                Active
              </span>
            )}
          </div>
          <FilterSidebar />
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex md:hidden justify-end">
            <div className="bg-white w-4/5 max-w-sm h-full p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        )}

        {/* Jobs Feed */}
        <div className="col-span-1 md:col-span-3 space-y-5">
          {/* Controls Bar: Count and Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-xs">
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Showing <span className="text-slate-900 font-bold">{jobs.length}</span> of{' '}
              <span className="text-brand-600 font-bold">{totalJobs}</span> available positions
            </p>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-400 font-medium">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="salary_high">Highest Salary</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Job Cards List */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-slate-100 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No jobs match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters or resetting keywords to explore other opportunities.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-xs hover:bg-brand-700"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onApplyClick={handleOpenApplyModal}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-700 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Apply Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply to ${selectedJob?.title || 'Job'}`}
      >
        {selectedJob && (
          <form onSubmit={handleApplicationSubmit} className="space-y-4">
            <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">{selectedJob.title}</div>
                <div className="text-[11px] text-slate-500">{selectedJob.company?.name} • {selectedJob.location}</div>
              </div>
              <span className="text-xs font-bold text-brand-700 px-2 py-0.5 bg-brand-100 rounded-md">
                {selectedJob.jobType}
              </span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Candidate Resume
              </label>
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 truncate">
                  <Briefcase className="w-4 h-4 text-brand-600 flex-shrink-0" />
                  <span className="truncate">{user?.profile?.resumeName || 'Default Profile Resume.pdf'}</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Ready
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Cover Note / Pitch (Optional)
              </label>
              <textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Briefly describe why your skills are a great match for this position..."
                className="w-full text-xs bg-white border border-slate-200 rounded-xl p-3 focus:outline-brand-500 shadow-2xs"
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
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Jobs;
