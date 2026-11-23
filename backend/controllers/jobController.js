const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');

// @desc    Get all jobs with multi-filter & search
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      category,
      jobType,
      workplaceType,
      experienceLevel,
      minSalary,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { status: 'Published' };

    // Search keyword in title, description, skills
    if (keyword && keyword.trim()) {
      const regex = new RegExp(keyword.trim(), 'i');
      query.$or = [{ title: regex }, { description: regex }, { skills: regex }];
    }

    // Filter by location
    if (location && location.trim()) {
      query.location = new RegExp(location.trim(), 'i');
    }

    // Filter by category
    if (category && category !== 'All Categories') {
      query.category = category;
    }

    // Filter by job type
    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    // Filter by workplace type
    if (workplaceType && workplaceType !== 'All') {
      query.workplaceType = workplaceType;
    }

    // Filter by experience level
    if (experienceLevel && experienceLevel !== 'All') {
      query.experienceLevel = experienceLevel;
    }

    // Filter by minimum salary
    if (minSalary && !isNaN(minSalary)) {
      query.salaryMax = { $gte: Number(minSalary) };
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'salary_high') {
      sortOption = { salaryMax: -1 };
    } else if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate('company', 'name logo location isVerified website')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      jobs,
    });
  } catch (error) {
    console.error('getJobs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('recruiter', 'name email avatar');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Featured jobs
// @route   GET /api/jobs/featured
// @access  Public
exports.getFeaturedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'Published', isFeatured: true })
      .populate('company', 'name logo location isVerified')
      .limit(6);

    // If less than 6 featured, grab recent published
    if (jobs.length < 6) {
      const extraJobs = await Job.find({ status: 'Published', _id: { $nin: jobs.map((j) => j._id) } })
        .populate('company', 'name logo location isVerified')
        .sort({ createdAt: -1 })
        .limit(6 - jobs.length);
      jobs.push(...extraJobs);
    }

    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Job Categories with dynamic job count
// @route   GET /api/jobs/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const aggregation = await Job.aggregate([
      { $match: { status: 'Published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const defaultCategories = [
      { name: 'Development & IT', icon: 'Code', count: 0 },
      { name: 'Design & Creative', icon: 'Palette', count: 0 },
      { name: 'Sales & Marketing', icon: 'TrendingUp', count: 0 },
      { name: 'Product Management', icon: 'Layers', count: 0 },
      { name: 'Customer Support', icon: 'Headphones', count: 0 },
      { name: 'Data & Analytics', icon: 'BarChart3', count: 0 },
      { name: 'Finance & Accounting', icon: 'DollarSign', count: 0 },
      { name: 'Human Resources', icon: 'Users', count: 0 },
    ];

    const countMap = {};
    aggregation.forEach((item) => {
      countMap[item._id] = item.count;
    });

    const result = defaultCategories.map((cat) => ({
      ...cat,
      count: countMap[cat.name] || 0,
    }));

    res.json({ success: true, categories: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Recruiter/Admin)
exports.createJob = async (req, res) => {
  try {
    const company = await Company.findOne({ recruiter: req.user._id });
    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your Company Profile first before posting a job.',
      });
    }

    const jobData = {
      ...req.body,
      recruiter: req.user._id,
      company: company._id,
    };

    if (Array.isArray(req.body.skills)) {
      jobData.skills = req.body.skills;
    } else if (typeof req.body.skills === 'string') {
      jobData.skills = req.body.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (typeof req.body.requirements === 'string') {
      jobData.requirements = req.body.requirements.split('\n').map((s) => s.trim()).filter(Boolean);
    }
    if (typeof req.body.responsibilities === 'string') {
      jobData.responsibilities = req.body.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean);
    }

    const job = await Job.create(jobData);
    res.status(201).json({ success: true, message: 'Job posted successfully!', job });
  } catch (error) {
    console.error('createJob error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Owner Recruiter / Admin)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Ownership check
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    const updateData = { ...req.body };
    if (typeof req.body.skills === 'string') {
      updateData.skills = req.body.skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (typeof req.body.requirements === 'string') {
      updateData.requirements = req.body.requirements.split('\n').map((s) => s.trim()).filter(Boolean);
    }
    if (typeof req.body.responsibilities === 'string') {
      updateData.responsibilities = req.body.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean);
    }

    job = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, message: 'Job updated successfully!', job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Owner Recruiter / Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    // Remove related applications
    await Application.deleteMany({ job: req.params.id });

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get jobs posted by current recruiter
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter)
exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id })
      .populate('company', 'name logo')
      .sort({ createdAt: -1 });

    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
