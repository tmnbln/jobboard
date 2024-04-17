import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/jobOffers', { });
        console.log('✨ MongoDB Connected.');
    } catch (err: any) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;
