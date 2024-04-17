import express from 'express';
const {
    getJobOffers,
    createJobOffer,
    updateJobOffer,
    deleteJobOffer
} = require('../controllers/jobOfferController');

const router = express.Router();

router.route('/job-offers').get(getJobOffers).post(createJobOffer);
router.route('/job-offers/:id').patch(updateJobOffer).delete(deleteJobOffer);

export default router;