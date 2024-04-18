import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobOffer } from './models/job-offer.model';

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {
  private apiUrl = 'http://localhost:3000/api/job-offers';
  private scrapeUrl = 'http://localhost:3000/api/scrape';

  constructor(private http: HttpClient) { }

  getJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(this.apiUrl);
  }

  getJobOffer(id: string): Observable<JobOffer> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<JobOffer>(url);
  }

  createJobOffer(jobOffer: JobOffer): Observable<JobOffer> {
    return this.http.post<JobOffer>(this.apiUrl, jobOffer);
  }

  updateJobOffer(jobOffer: JobOffer): Observable<JobOffer> {
    const url = `${this.apiUrl}/${jobOffer._id}`;
    return this.http.put<JobOffer>(url, jobOffer);
  }

  deleteJobOffer(id: string): Observable<JobOffer> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<JobOffer>(url);
  }

  scrapeJobOffer(url: string): Observable<JobOffer> {
    return this.http.post<JobOffer>(this.scrapeUrl, { url });
  }
}