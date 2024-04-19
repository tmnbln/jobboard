import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import jobOfferRoutes from './routes/jobOfferRoutes';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

connectDB();

app.use('/api', jobOfferRoutes);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
    console.log(`🏃‍♂️ Server running on port ${port}.`);
});