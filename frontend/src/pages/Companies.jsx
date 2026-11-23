import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, CheckCircle, Search, ArrowRight, ExternalLink } from 'lucide-react';
import api from '../services/api';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/companies?keyword=${encodeURIComponent(keyword)}`);
      if (res.data.success) {
        setCompanies(res.data.companies);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Discover Top Hiring Companies
        </h1>
        <p className="text-sm text-slate-500">
          Explore verified companies actively hiring tech talent across the world
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="pt-2 flex items-center gap-2 max-w-md mx-auto">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies by name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse space-y-4">
              <div className="w-14 h-14 bg-slate-200 rounded-xl"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company._id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200/80 p-2 overflow-hidden flex items-center justify-center">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Building2 className="w-7 h-7 text-brand-600" />
                    )}
                  </div>
                  {company.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-bold text-slate-900">{company.name}</h3>
                  <p className="text-xs text-brand-600 font-semibold">{company.tagline || company.industry}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {company.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {company.location}
                  </span>
                  <span>•</span>
                  <span>{company.companySize} employees</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">
                  {company.openJobsCount || 0} Open {company.openJobsCount === 1 ? 'Job' : 'Jobs'}
                </span>
                <Link
                  to={`/jobs?keyword=${encodeURIComponent(company.name)}`}
                  className="text-xs font-bold text-slate-700 hover:text-brand-600 flex items-center gap-1"
                >
                  View Openings
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Companies;
