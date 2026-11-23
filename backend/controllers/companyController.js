const Company = require('../models/Company');
const Job = require('../models/Job');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
exports.getCompanies = async (req, res) => {
  try {
    const { keyword } = req.query;
    const query = { isApproved: true };

    if (keyword) {
      query.name = new RegExp(keyword, 'i');
    }

    const companies = await Company.find(query).sort({ isVerified: -1, createdAt: -1 });

    // Aggregate job count per company
    const companyIds = companies.map((c) => c._id);
    const jobsCount = await Job.aggregate([
      { $match: { company: { $in: companyIds }, status: 'Published' } },
      { $group: { _id: '$company', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    jobsCount.forEach((j) => {
      countMap[j._id.toString()] = j.count;
    });

    const enriched = companies.map((c) => ({
      ...c.toObject(),
      openJobsCount: countMap[c._id.toString()] || 0,
    }));

    res.json({ success: true, count: enriched.length, companies: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const jobs = await Job.find({ company: company._id, status: 'Published' });

    res.json({ success: true, company, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current recruiter's company profile
// @route   GET /api/companies/me
// @access  Private (Recruiter)
exports.getMyCompany = async (req, res) => {
  try {
    let company = await Company.findOne({ recruiter: req.user._id });
    if (!company) {
      company = await Company.create({
        recruiter: req.user._id,
        name: `${req.user.name}'s Company`,
        tagline: 'Growing fast in technology',
      });
    }
    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update current recruiter's company profile
// @route   PUT /api/companies/me
// @access  Private (Recruiter)
exports.updateCompany = async (req, res) => {
  try {
    let company = await Company.findOne({ recruiter: req.user._id });
    if (!company) {
      company = new Company({ recruiter: req.user._id });
    }

    Object.assign(company, req.body);
    await company.save();

    res.json({ success: true, message: 'Company profile updated successfully', company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
