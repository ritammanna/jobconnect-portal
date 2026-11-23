import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  ArrowRight,
  Sparkles,
  Users,
  Building,
  CheckCircle2,
  TrendingUp,
  Code,
  Palette,
  Layers,
  BarChart3,
  DollarSign,
  Headphones,
} from 'lucide-react';
import api from '../services/api';
import JobCard from '../components/common/JobCard';

const Home = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [catsRes, jobsRes] = await Promise.all([
          api.get('/jobs/categories'),
          api.get('/jobs/featured'),
        ]);

        if (catsRes.data.success) setCategories(catsRes.data.categories);
        if (jobsRes.data.success) setFeaturedJobs(jobsRes.data.jobs);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    if (category && category !== 'All Categories') params.append('category', category);
    navigate(`/jobs?${params.toString()}`);
  };

  const getCategoryIcon = (name) => {
    switch (name) {
      case 'Development & IT':
        return <Code className="w-6 h-6 text-indigo-600" />;
      case 'Design & Creative':
        return <Palette className="w-6 h-6 text-purple-600" />;
      case 'Product Management':
        return <Layers className="w-6 h-6 text-blue-600" />;
      case 'Sales & Marketing':
        return <TrendingUp className="w-6 h-6 text-rose-600" />;
      case 'Data & Analytics':
        return <BarChart3 className="w-6 h-6 text-amber-600" />;
      case 'Customer Support':
        return <Headphones className="w-6 h-6 text-emerald-600" />;
      default:
        return <Briefcase className="w-6 h-6 text-brand-600" />;
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-brand-50/70 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Find Your Dream Career or <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Hire World-Class Talent
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover thousands of high-paying jobs in tech, design, marketing, and leadership. Apply with one click and track real-time interview updates.
          </p>

          {/* Interactive Search Bar */}
          <div className="mt-10 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/80 flex flex-col md:flex-row items-stretch gap-2.5"
            >
              {/* Job Title / Keyword */}
              <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-50/70 md:bg-transparent rounded-xl border md:border-none border-slate-100">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or skills..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="hidden md:block w-[1px] bg-slate-200 my-2"></div>

              {/* Location */}
              <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-50/70 md:bg-transparent rounded-xl border md:border-none border-slate-100">
                <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Location or 'Remote'..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="hidden md:block w-[1px] bg-slate-200 my-2"></div>

              {/* Category Dropdown */}
              <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-50/70 md:bg-transparent rounded-xl border md:border-none border-slate-100">
                <Briefcase className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl sm:rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all hover:scale-102 flex items-center justify-center gap-2"
              >
                <span>Search Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Keywords */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Popular:</span>
              {['React', 'MERN Stack', 'Remote', 'Node.js', 'UI/UX Designer', 'Fresher'].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setKeyword(tag);
                      navigate(`/jobs?keyword=${encodeURIComponent(tag)}`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-500 hover:text-brand-600 transition-colors shadow-2xs"
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">1,500+</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Live Jobs Available</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-600">450+</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Verified Companies</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">12,000+</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Active Job Seekers</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">98%</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Interview Match Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Explore by Category</h2>
            <p className="text-sm text-slate-500 mt-1">Browse open opportunities across popular technology domains</p>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            Browse All Jobs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
              className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-50 transition-all">
                {getCategoryIcon(cat.name)}
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-4 group-hover:text-brand-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {cat.count} {cat.count === 1 ? 'Open position' : 'Open positions'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Top Opportunities</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">Featured Job Openings</h2>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            View all {featuredJobs.length > 0 ? `${featuredJobs.length}+` : ''} jobs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
                  </div>
                </div>
                <div className="h-3 bg-slate-200 rounded-md w-full"></div>
                <div className="h-8 bg-slate-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onApplyClick={(j) => navigate(`/jobs/${j._id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Workflow</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-1">How JobConnect Works</h2>
            <p className="text-slate-400 text-sm mt-2">A seamless 3-step pipeline designed for high performance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white font-black text-xl flex items-center justify-center mb-4 shadow-lg shadow-brand-500/30">
                1
              </div>
              <h3 className="text-lg font-bold">Build Your Profile</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Register as a Job Seeker or Recruiter. Upload your resume or setup company credentials in under 2 minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                2
              </div>
              <h3 className="text-lg font-bold">Apply or Post Jobs</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Filter verified jobs with dynamic salary filters, or publish jobs with customized technical requirements.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
                3
              </div>
              <h3 className="text-lg font-bold">Interview & Hire</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Track status directly from Applied to Shortlisted and Interview Scheduled with real-time feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Recruiter CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-50/80 border border-brand-200/80 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Hiring Made Effortless</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Are you an Employer or Hiring Manager?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Reach thousands of qualified MERN developers, designers, and engineers. Post your job openings and manage candidate resumes with built-in interview workflows.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              to="/register?role=recruiter"
              className="w-full sm:w-auto text-center px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all hover:scale-102"
            >
              Post a Job for Free
            </Link>
            <Link
              to="/login?role=recruiter"
              className="w-full sm:w-auto text-center px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm transition-all"
            >
              Recruiter Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
