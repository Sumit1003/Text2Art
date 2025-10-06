import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
    try {
        console.log('MongoDB URI:', process.env.MONGODB_URI);

        const conn = await mongoose.connect(process.env.MONGODB_URI);


    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

export default connectDB;