const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
  },
  tagline: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  website: {
    type: String,
    default: '',
  },
  industry: {
    type: String,
    default: 'Information Technology',
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    default: '11-50',
  },
  location: {
    type: String,
    default: 'Remote',
  },
  logo: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Company', companySchema);
