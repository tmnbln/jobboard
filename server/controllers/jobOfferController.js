const JobOffer = require('../models/jobOffer');

exports.getJobOffers = async (req, res) => {
    try {
        const jobOffers = await JobOffer.find();
        res.json(jobOffers);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.createJobOffer = async (req, res) => {
    try {
        const newJobOffer = new JobOffer(req.body);
        await newJobOffer.save();
        res.status(201).json(newJobOffer);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.updateJobOffer = async (req, res) => {
    try {
        const jobOffer = await JobOffer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(jobOffer);
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.deleteJobOffer = async (req, res) => {
    try {
        await JobOffer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job offer deleted' });
    } catch (err) {
        res.status(500).send(err.message);
    }
};