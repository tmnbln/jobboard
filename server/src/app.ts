import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jobOfferRoutes from './routes/jobOfferRoutes';
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/jobOffers').then(() => {
    console.log('✨ Connected to MongoDB.');
}).catch(err => {
    console.error('💔 Could not connect to MongoDB.', err);
});

app.use('/api', jobOfferRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🏃‍♂️ Server running on port ${port}.`);
});