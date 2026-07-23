import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  certificateId: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true
  },
  company: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Certificate', certificateSchema);