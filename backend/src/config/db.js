import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Try to connect to MongoDB
    if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb://localhost:27017/ai-mock-interview') {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log('Running in demo mode (no MongoDB)');
    }
  } catch (error) {
    console.log('Running in demo mode (MongoDB not available)');
  }
};

export default connectDB;