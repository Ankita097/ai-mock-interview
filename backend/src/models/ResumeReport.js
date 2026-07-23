import mongoose from 'mongoose';

const resumeReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  atsScore: {
    type: Number,
    default: 0
  },
  skills: [String],
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String]
  }],
  missingSkills: [String],
  suggestions: [String],
  keywordOptimization: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ResumeReport', resumeReportSchema);