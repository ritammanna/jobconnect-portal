const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadResume,
  saveJob,
  getSavedJobs,
  getNotifications,
  markNotificationRead,
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.post('/resume', protect, upload.single('resume'), uploadResume);
router.post('/save-job/:jobId', protect, saveJob);
router.get('/saved-jobs', protect, getSavedJobs);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);

module.exports = router;
