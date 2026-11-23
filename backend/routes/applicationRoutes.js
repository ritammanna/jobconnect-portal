const express = require('express');
const router = express.Router();
const {
  applyJob,
  getSeekerApplications,
  getRecruiterApplications,
  updateApplicationStatus,
  scheduleInterview,
  withdrawApplication,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Seeker routes
router.post('/:jobId', protect, authorize('seeker', 'admin'), applyJob);
router.get('/my-applications', protect, authorize('seeker', 'admin'), getSeekerApplications);
router.put('/:id/withdraw', protect, authorize('seeker', 'admin'), withdrawApplication);

// Recruiter routes
router.get('/recruiter/applicants', protect, authorize('recruiter', 'admin'), getRecruiterApplications);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.put('/:id/schedule-interview', protect, authorize('recruiter', 'admin'), scheduleInterview);

module.exports = router;
