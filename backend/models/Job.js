const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Job category is required'],
    default: 'Development & IT',
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'],
    default: 'Full-time',
  },
  workplaceType: {
    type: String,
    enum: ['Remote', 'Hybrid', 'On-site'],
    default: 'Remote',
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    default: 'Remote',
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher', '1-3 Years', '3-5 Years', '5+ Years'],
    default: 'Fresher',
  },
  salaryMin: {
    type: Number,
    default: 0,
  },
  salaryMax: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
  },
  requirements: {
    type: [String],
    default: [],
  },
  responsibilities: {
    type: [String],
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['Published', 'Draft', 'Closed'],
    default: 'Published',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  applicantsCount: {
    type: Number,
    default: 0,
  },
  deadline: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index for search
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
