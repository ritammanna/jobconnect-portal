const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  seeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  resumeUrl: {
    type: String,
    required: true,
  },
  resumeName: {
    type: String,
    default: 'Resume.pdf',
  },
  coverLetter: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Accepted', 'Withdrawn'],
    default: 'Applied',
  },
  interviewDetails: {
    date: Date,
    time: String,
    meetingLink: String,
    instructions: String,
  },
  feedback: {
    type: String,
    default: '',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate application from same user for same job
applicationSchema.index({ job: 1, seeker: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
