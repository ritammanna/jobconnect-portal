const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllJobsAdmin,
  toggleJobFeatured,
  toggleCompanyVerify,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllJobsAdmin);
router.put('/jobs/:id/toggle-featured', toggleJobFeatured);
router.put('/companies/:id/verify', toggleCompanyVerify);

module.exports = router;
