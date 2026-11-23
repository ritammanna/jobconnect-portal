import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">JobConnect</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A professional job website connecting talented candidates with top employers worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Job Seekers</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Explore All Jobs</Link></li>
              <li><Link to="/jobs?category=Development+%26+IT" className="hover:text-white transition-colors">Tech & IT Jobs</Link></li>
              <li><Link to="/jobs?workplaceType=Remote" className="hover:text-white transition-colors">Remote Opportunities</Link></li>
              <li><Link to="/seeker/dashboard" className="hover:text-white transition-colors">Candidate Dashboard</Link></li>
            </ul>
          </div>

          {/* Recruiters */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Employers</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/recruiter/dashboard?tab=post-job" className="hover:text-white transition-colors">Post a New Job</Link></li>
              <li><Link to="/companies" className="hover:text-white transition-colors">Browse Companies</Link></li>
              <li><Link to="/recruiter/dashboard?tab=applicants" className="hover:text-white transition-colors">Manage Applicants</Link></li>
              <li><Link to="/login?role=recruiter" className="hover:text-white transition-colors">Employer Portal</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Stack & Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-brand-400 font-medium">MongoDB Atlas Database</span></li>
              <li><span className="text-brand-400 font-medium">Express.js REST APIs</span></li>
              <li><span className="text-brand-400 font-medium">React & Tailwind CSS</span></li>
              <li><span className="text-brand-400 font-medium">Node.js Runtime</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>©{new Date().getFullYear()} Professional Job Website. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Engineered with passion for professional web development</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
