import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    default: ''
  },
  experience: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  interviewType: {
    type: String,
    required: true
  },
  questions: [{
    question: String,
    userAnswer: String,
    aiFeedback: String,
    score: Number,
    category: String
  }],
  overallScore: {
    type: Number,
    default: 0
  },
  communicationScore: {
    type: Number,
    default: 0
  },
  confidenceScore: {
    type: Number,
    default: 0
  },
  technicalScore: {
    type: Number,
    default: 0
  },
  problemSolvingScore: {
    type: Number,
    default: 0
  },
  grammarScore: {
    type: Number,
    default: 0
  },
  vocabularyScore: {
    type: Number,
    default: 0
  },
  timeManagementScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Saved'],
    default: 'Completed'
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  },
  suggestions: [String],
  strengths: [String],
  weaknesses: [String],
  improvementPlan: String,
  certificateId: {
    type: String,
    default: ''
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Interview', interviewSchema);