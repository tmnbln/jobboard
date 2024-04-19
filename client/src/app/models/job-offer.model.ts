export interface JobOffer {
  _id: string;
  company: string;
  title: string;
  location: string;
  description: string;
  salary?: number;
  url: string;
  notes?: string;
  status: string;
  dateApplied: Date;
}