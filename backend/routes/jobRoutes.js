const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  getFeaturedJobs,
  getCategories,
  createJob,
  updateJob,
  deleteJob,
  getRecruiterJobs,
} = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/', getJobs);
router.get('/featured', getFeaturedJobs);
router.get('/categories', getCategories);
router.get('/recruiter/my-jobs', protect, authorize('recruiter', 'admin'), getRecruiterJobs);
router.get('/:id', getJobById);

router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
