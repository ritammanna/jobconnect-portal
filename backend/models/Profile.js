const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  fieldOfStudy: String,
  startYear: String,
  endYear: String,
});

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  description: String,
});

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  headline: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher', 'Junior (1-2 yrs)', 'Mid-level (3-5 yrs)', 'Senior (5+ yrs)'],
    default: 'Fresher',
  },
  expectedSalary: {
    type: String,
    default: '',
  },
  preferredLocation: {
    type: String,
    default: 'Remote',
  },
  resumeUrl: {
    type: String,
    default: '',
  },
  resumeName: {
    type: String,
    default: '',
  },
  github: {
    type: String,
    default: '',
  },
  linkedin: {
    type: String,
    default: '',
  },
  portfolio: {
    type: String,
    default: '',
  },
  education: [educationSchema],
  experience: [experienceSchema],
  profileCompletion: {
    type: Number,
    default: 30,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Profile', profileSchema);
