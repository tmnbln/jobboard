import { JobOffer } from './job-offer.model';

export interface Column {
  name: string,
  jobOffer: JobOffer[];
}
