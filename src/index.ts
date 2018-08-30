import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Server from './Server';

dotenv.load();

const server: Server = new Server();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trainees-monitor';
mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true },
  error => {
    if (error) {
      console.log('Failed to connect to MongoDB');
    }
    console.log('Connected successfuly to MongoDB');
  }
);

export default server;
