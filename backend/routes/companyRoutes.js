const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyById,
  getMyCompany,
  updateCompany,
} = require('../controllers/companyController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.get('/', getCompanies);
router.get('/me', protect, authorize('recruiter', 'admin'), getMyCompany);
router.put('/me', protect, authorize('recruiter', 'admin'), updateCompany);
router.get('/:id', getCompanyById);

module.exports = router;
