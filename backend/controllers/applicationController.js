const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');
const Profile = require('../models/Profile');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Seeker)
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeUrl, resumeName } = req.body;

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'Published') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    // Check if user already applied
    const existingApp = await Application.findOne({ job: jobId, seeker: req.user._id });
    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already applied for this position' });
    }

    // Determine resume
    let finalResumeUrl = resumeUrl;
    let finalResumeName = resumeName || 'Resume.pdf';

    if (!finalResumeUrl) {
      const profile = await Profile.findOne({ user: req.user._id });
      if (profile && profile.resumeUrl) {
        finalResumeUrl = profile.resumeUrl;
        finalResumeName = profile.resumeName || 'Profile_Resume.pdf';
      }
    }

    if (!finalResumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide or upload a resume before applying',
      });
    }

    const application = await Application.create({
      job: jobId,
      seeker: req.user._id,
      recruiter: job.recruiter,
      company: job.company._id,
      resumeUrl: finalResumeUrl,
      resumeName: finalResumeName,
      coverLetter: coverLetter || '',
      status: 'Applied',
    });

    // Increment applicantsCount on job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });

    // Send notification to Recruiter
    await Notification.create({
      recipient: job.recruiter,
      sender: req.user._id,
      title: 'New Candidate Applied',
      message: `${req.user.name} applied for "${job.title}"`,
      type: 'NEW_APPLICANT',
      link: `/recruiter/dashboard?tab=applicants&jobId=${job._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application,
    });
  } catch (error) {
    console.error('applyJob error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get seeker applications
// @route   GET /api/applications/my-applications
// @access  Private (Seeker)
exports.getSeekerApplications = async (req, res) => {
  try {
    const applications = await Application.find({ seeker: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location' },
      })
      .sort({ appliedAt: -1 });

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recruiter applications for their posted jobs
// @route   GET /api/applications/recruiter/applicants
// @access  Private (Recruiter)
exports.getRecruiterApplications = async (req, res) => {
  try {
    const { jobId, status } = req.query;
    const query = { recruiter: req.user._id };

    if (jobId) query.job = jobId;
    if (status && status !== 'All') query.status = status;

    const applications = await Application.find(query)
      .populate('job', 'title category location jobType')
      .populate('seeker', 'name email avatar')
      .sort({ appliedAt: -1 });

    // Enhance with seeker profile info
    const seekerIds = applications.map((app) => app.seeker._id);
    const profiles = await Profile.find({ user: { $in: seekerIds } });
    const profileMap = {};
    profiles.forEach((p) => {
      profileMap[p.user.toString()] = p;
    });

    const enrichedApplications = applications.map((app) => {
      const appObj = app.toObject();
      appObj.seekerProfile = profileMap[app.seeker._id.toString()] || null;
      return appObj;
    });

    res.json({ success: true, count: enrichedApplications.length, applications: enrichedApplications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status (Shortlist, Reject, Under Review, Accept)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter/Admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('job', 'title')
      .populate('recruiter');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.recruiter._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this application' });
    }

    application.status = status;
    if (feedback) application.feedback = feedback;
    application.updatedAt = Date.now();
    await application.save();

    // Create Notification for the Seeker
    await Notification.create({
      recipient: application.seeker,
      sender: req.user._id,
      title: `Application Status Updated: ${status}`,
      message: `Your application for "${application.job.title}" has been updated to "${status}".`,
      type: 'APPLICATION_STATUS',
      link: '/seeker/dashboard?tab=applied',
    });

    res.json({ success: true, message: `Application status changed to ${status}`, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Schedule interview
// @route   PUT /api/applications/:id/schedule-interview
// @access  Private (Recruiter)
exports.scheduleInterview = async (req, res) => {
  try {
    const { date, time, meetingLink, instructions } = req.body;
    const application = await Application.findById(req.params.id).populate('job', 'title');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = 'Interview Scheduled';
    application.interviewDetails = {
      date: new Date(date),
      time,
      meetingLink,
      instructions,
    };
    application.updatedAt = Date.now();
    await application.save();

    // Notify seeker
    await Notification.create({
      recipient: application.seeker,
      sender: req.user._id,
      title: 'Interview Scheduled! 📅',
      message: `An interview has been scheduled for "${application.job.title}" on ${time || date}. Check details in your dashboard.`,
      type: 'INTERVIEW',
      link: '/seeker/dashboard?tab=applied',
    });

    res.json({ success: true, message: 'Interview scheduled successfully!', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Withdraw application
// @route   PUT /api/applications/:id/withdraw
// @access  Private (Seeker)
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, seeker: req.user._id });
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = 'Withdrawn';
    application.updatedAt = Date.now();
    await application.save();

    res.json({ success: true, message: 'Application withdrawn successfully', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
