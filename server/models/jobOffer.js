const mongoose = require('mongoose');

const JobOfferSchema = new mongoose.Schema({
    company: { type: String, required: true },
    title: { type: String, required: true },
    location: String,
    description: String,
    requirements: [String],
    benefits: [String],
    salary: String,
    url: String,
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Applied' }
});

module.exports = mongoose.model('JobOffer', JobOfferSchema);