import JobOffer from '../models/jobOffer';
import {Request, Response} from 'express';

exports.getJobOffers = async (req: Request, res: Response) => {
  try {
    const jobOffers = await JobOffer.find();
    res.json(jobOffers);
  } catch (err: any) {
    console.error(err);
    res.status(500).send('🦆 Internal server error.');
  }
};

exports.createJobOffer = async (req: Request, res: Response) => {
  try {
    const newJobOffer = new JobOffer(req.body);
    await newJobOffer.save();
    res.status(201).json(newJobOffer);
  } catch (err: any) {
    res.status(500).send('🦆 An error occurred while creating the job offer.');
  }
};

exports.updateJobOffer = async (req: Request, res: Response) => {
  try {
    const jobOffer = await JobOffer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(jobOffer);
  } catch (err: any) {
    res.status(500).send('🦆 An error occurred while updating the job offer.');
  }
};

exports.deleteJobOffer = async (req: Request, res: Response) => {
  try {
    await JobOffer.findByIdAndDelete(req.params.id);
    res.json({ message: '🗑️Job offer deleted.' });
  } catch (err: any) {
    res.status(500).json({ error: '🦆 An error occurred while deleting the job offer.' });
  }
};
