import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    default: ''
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    default: ''
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  tags: [String],
  isPremium: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Question', questionSchema);