const Profile = require('../models/Profile');
const SavedJob = require('../models/SavedJob');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Helper to compute profile completion
const calculateCompletion = (profile, user) => {
  let score = 20; // base for registration
  if (user && user.avatar) score += 10;
  if (profile.headline) score += 10;
  if (profile.bio) score += 10;
  if (profile.phone && profile.location) score += 10;
  if (profile.skills && profile.skills.length > 0) score += 15;
  if (profile.resumeUrl) score += 15;
  if (profile.experience && profile.experience.length > 0) score += 10;
  return Math.min(score, 100);
};

// @desc    Get seeker profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email avatar role');

    if (!profile) {
      profile = await Profile.create({
        user: req.user._id,
        skills: [],
      });
      profile = await profile.populate('user', 'name email avatar role');
    }

    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update seeker profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar, ...profileData } = req.body;

    // Update user info if name or avatar provided
    if (name || avatar) {
      await User.findByIdAndUpdate(req.user._id, {
        ...(name && { name }),
        ...(avatar && { avatar }),
      });
    }

    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new Profile({ user: req.user._id });
    }

    Object.assign(profile, profileData);
    profile.profileCompletion = calculateCompletion(profile, req.user);
    profile.updatedAt = Date.now();

    await profile.save();

    const updatedUser = await User.findById(req.user._id);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile,
      user: updatedUser,
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload Resume
// @route   POST /api/profile/resume
// @access  Private
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileName = req.file.originalname;

    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new Profile({ user: req.user._id });
    }

    profile.resumeUrl = fileUrl;
    profile.resumeName = fileName;
    profile.profileCompletion = calculateCompletion(profile, req.user);
    await profile.save();

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl: fileUrl,
      resumeName: fileName,
      profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save/Bookmark a job
// @route   POST /api/profile/save-job/:jobId
// @access  Private
exports.saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const existing = await SavedJob.findOne({ user: req.user._id, job: jobId });

    if (existing) {
      await SavedJob.deleteOne({ _id: existing._id });
      return res.json({ success: true, isSaved: false, message: 'Job removed from saved list' });
    }

    await SavedJob.create({ user: req.user._id, job: jobId });
    res.json({ success: true, isSaved: true, message: 'Job saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's saved jobs
// @route   GET /api/profile/saved-jobs
// @access  Private
exports.getSavedJobs = async (req, res) => {
  try {
    const saved = await SavedJob.find({ user: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location' },
      })
      .sort({ createdAt: -1 });

    const jobs = saved.map((s) => s.job).filter(Boolean);
    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user notifications
// @route   GET /api/profile/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

    res.json({ success: true, unreadCount, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/profile/notifications/:id/read
// @access  Private
exports.markNotificationRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true }
    );
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
