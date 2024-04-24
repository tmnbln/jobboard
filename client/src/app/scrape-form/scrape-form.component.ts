import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { JobOfferService } from '../job-offer.service';
import { JobOffer } from '../models/job-offer.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-scrape-form',
  templateUrl: './scrape-form.component.html',
  styleUrls: ['./scrape-form.component.css'],
  standalone: true,
  imports: [MaterialModule]
})
export class ScrapeFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private jobOfferService: JobOfferService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { jobOffer: JobOffer, fromScrape: boolean },
    private dialogRef: MatDialogRef<ScrapeFormComponent>
  ) {
    this.form = this.fb.group({
      company: '',
      title: '',
      location: '',
      description: '',
      salary: '',
      url: '',
      notes: ''
    });
  }

  ngOnInit() {
    if (this.data.jobOffer) {
      this.form.patchValue(this.data.jobOffer);
    }
  }

  read() {
    this.isLoading = true;
    const url = this.form.get('url')?.value;
    console.log('✨ Sending URL to server:', url);
    this.jobOfferService.readJobOffer(url).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data: JobOffer) => {
        this.isLoading = false;
        this.form.patchValue(data);
        console.log('✨ Received data:', data);
      },
      error: (error) => {
        this.isLoading = false;
        this.handleError('🦆 Failed to fetch data', error);
      }
    });
  }

  save() {
    const jobOffer: JobOffer = { ...this.form.value };
    this.jobOfferService.createJobOffer(jobOffer).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.showSuccessMessage('✨ Job offer saved successfully.');
        this.dialogRef.close(true);
      },
      error: (error) => this.handleError('🦆 Failed to save job offer', error)
    });
  }

  update() {
    const updatedOffer = { ...this.data.jobOffer, ...this.form.value };
    this.jobOfferService.updateJobOffer(updatedOffer).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.showSuccessMessage('✨ Job offer updated successfully.');
        this.dialogRef.close(true);
      },
      error: (error) => this.handleError('🦆 Failed to update job offer', error)
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(`✨ ${message}`, 'Close', { duration: 3000 });
  }

  private handleError(message: string, error: any): void {
    console.error(`🦆 ${message}:`, error);
    this.snackBar.open(`🦆 ${message}`, 'Close', { duration: 3000 });
  }
}