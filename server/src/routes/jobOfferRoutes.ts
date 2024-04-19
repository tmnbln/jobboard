import express from 'express';
import JobOffer from '../models/jobOffer';
import { scrapeJobOffer } from '../controllers/puppeteer';

const {
    getJobOffers,
    createJobOffer,
    updateJobOffer,
    deleteJobOffer
} = require('../controllers/jobOfferController');

const router = express.Router();

router.post('/scrape', async (req, res) => {
    const url = req.body.url;

    try {
        const jobData = await scrapeJobOffer(url);
        const newJobOffer = new JobOffer(jobData);
        await newJobOffer.save();
        res.json(newJobOffer);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            message: '🦆 Internal server error.'
        });
    }
});

router.post('/read', async (req, res) => {
    const url = req.body.url;

    try {
        const jobData = await scrapeJobOffer(url);
        const newJobOffer = new JobOffer(jobData);
        res.json(newJobOffer);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            message: '🦆 Internal server error.'
        });
    }
});

router.route('/job-offers').get(getJobOffers).post(createJobOffer);
router.route('/job-offers/:id').patch(updateJobOffer).delete(deleteJobOffer);

export default router;