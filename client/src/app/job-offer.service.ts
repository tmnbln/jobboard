import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { JobOffer } from './models/job-offer.model';

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {
  private apiUrl = 'http://localhost:3000/api/job-offers';
  private scrapeUrl = 'http://localhost:3000/api/scrape';
  private readUrl = 'http://localhost:3000/api/read';

  private jobOfferChanged$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  getJobOfferAddedEvent(): Observable<void> {
    return this.jobOfferChanged$.asObservable();
  }

  getJobOffers(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(this.apiUrl);
  }

  getJobOffer(id: string): Observable<JobOffer> {

    const url = `${this.apiUrl}/${id}`;
    return this.http.get<JobOffer>(url);
  }

  createJobOffer(jobOffer: JobOffer): Observable<JobOffer> {
    return this.http.post<JobOffer>(this.apiUrl, jobOffer).pipe(
      tap(() => this.jobOfferChanged$.next())
    );;
  }

  updateJobOffer(jobOffer: JobOffer): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${jobOffer._id}`, jobOffer).pipe(
      tap(() => {
        this.jobOfferChanged$.next();
        console.log('✨ Update successful.');
      })
    );
  }

  deleteJobOffer(id: string): Observable<JobOffer> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<JobOffer>(url).pipe(
      tap(() => this.jobOfferChanged$.next())
    );;
  }

  scrapeJobOffer(url: string): Observable<JobOffer> {
    return this.http.post<JobOffer>(this.scrapeUrl, { url });
  }

  readJobOffer(url: string): Observable<JobOffer> {
    return this.http.post<JobOffer>(this.readUrl, { url });
  }
}
