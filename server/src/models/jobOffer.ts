import mongoose from 'mongoose';

const JobOfferSchema = new mongoose.Schema({
    company: { type: String, required: true },
    title: { type: String, required: true },
    location: String,
    description: String,
    salary: String,
    url: String,
    notes: String,
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Applied' }
});

export default mongoose.model('JobOffer', JobOfferSchema);