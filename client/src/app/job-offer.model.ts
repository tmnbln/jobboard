export interface JobOffer {
    _id: string;
    company: string;
    title: string;
    location: string;
    description: string;
    requirements: string[];
    benefits: string[];
    salary: number;
    contactEmail: string;
    status: 'applied' | 'interviewing' | 'offered' | 'rejected';
    dateApplied: Date;
  }