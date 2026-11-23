const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSeekers = await User.countDocuments({ role: 'seeker' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'Published' });
    const totalApplications = await Application.countDocuments();
    const interviewsScheduled = await Application.countDocuments({ status: 'Interview Scheduled' });
    const totalCompanies = await Company.countDocuments();

    // Recent 5 applications
    const recentApplications = await Application.find()
      .populate('job', 'title')
      .populate('seeker', 'name email avatar')
      .populate('company', 'name')
      .sort({ appliedAt: -1 })
      .limit(5);

    // Recent 5 users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalSeekers,
        totalRecruiters,
        totalCompanies,
        totalJobs,
        activeJobs,
        totalApplications,
        interviewsScheduled,
      },
      recentApplications,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (searchable & filterable)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, keyword } = req.query;
    const query = {};

    if (role && role !== 'All') query.role = role;
    if (keyword) {
      query.$or = [
        { name: new RegExp(keyword, 'i') },
        { email: new RegExp(keyword, 'i') },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle user active/blocked status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin user' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all jobs (for admin moderation)
// @route   GET /api/admin/jobs
// @access  Private (Admin)
exports.getAllJobsAdmin = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('company', 'name logo')
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle Job Featured
// @route   PUT /api/admin/jobs/:id/toggle-featured
// @access  Private (Admin)
exports.toggleJobFeatured = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    job.isFeatured = !job.isFeatured;
    await job.save();

    res.json({
      success: true,
      message: `Job ${job.isFeatured ? 'marked as Featured' : 'unfeatured'}`,
      job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle Company Verification
// @route   PUT /api/admin/companies/:id/verify
// @access  Private (Admin)
exports.toggleCompanyVerify = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    company.isVerified = !company.isVerified;
    await company.save();

    res.json({
      success: true,
      message: `Company verification ${company.isVerified ? 'approved' : 'revoked'}`,
      company,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
