import { Component, Inject } from '@angular/core';
import { JobOfferService } from '../job-offer.service';
import { JobOffer } from '../models/job-offer.model';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-scrape-form',
  templateUrl: './scrape-form.component.html',
  styleUrls: ['./scrape-form.component.css'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatProgressSpinnerModule, MatIconModule, ReactiveFormsModule, MatInputModule]
})
export class ScrapeFormComponent {
  url: string = '';
  jobOffer!: JobOffer;
  urlControl = new FormControl('');
  isLoading: boolean = false;
  fromScrape: boolean = true;
  destroy$ = new Subject();
  form!: FormGroup;

  constructor(
    private jobOfferService: JobOfferService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { jobOffer: JobOffer, fromScrape: boolean },
    private dialogRef: MatDialogRef<ScrapeFormComponent>
  ) {
    this.fromScrape = data.fromScrape;
  }

  ngOnInit() {
    this.form = new FormGroup({
      company: new FormControl(''),
      title: new FormControl(''),
      location: new FormControl(''),
      description: new FormControl(''),
      salary: new FormControl(''),
      url: new FormControl(''),
      notes: new FormControl('')
    });

    if (this.data.jobOffer) {
      this.form.patchValue({
        company: this.data.jobOffer.company,
        title: this.data.jobOffer.title,
        location: this.data.jobOffer.location,
        description: this.data.jobOffer.description,
        salary: this.data.jobOffer.salary,
        url: this.data.jobOffer.url,
        notes: this.data.jobOffer.notes
      });
    }
  }

  read() {
    this.isLoading = true;
    this.url = this.form.get('url')?.value;
    console.log('✨ Sending URL to server:', this.url);
    this.jobOfferService.readJobOffer(this.url).subscribe((data: any) => {
      this.isLoading = false;
      this.form.patchValue({
        company: data.company,
        title: data.title,
        location: data.location,
        description: data.description,
        salary: data.salary,
        url: data.url,
        notes: ''
      });
      takeUntil(this.destroy$);
      console.log('✨ Received data:', data);
    }, error => {
      this.isLoading = false;
      takeUntil(this.destroy$);
      console.error('🦆 Failed to fetch data:', error);
    });
  }

  save() {
    this.jobOffer = {
      ...this.jobOffer,
      company: this.form.value.company,
      title: this.form.value.title,
      location: this.form.value.location,
      description: this.form.value.description,
      salary: this.form.value.salary,
      url: this.form.value.url,
      notes: this.form.value.notes
    };

    this.jobOfferService.createJobOffer(this.jobOffer).subscribe(() => {
      this.snackBar.open('✨ Job offer saved successfully.', 'Close', {
        duration: 3000
      });
      takeUntil(this.destroy$);
    });
  }

  update() {
    const updatedOffer = { ...this.data.jobOffer, ...this.form.value };
    this.jobOfferService.updateJobOffer(updatedOffer).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.snackBar.open('✨ Job offer updated successfully.', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Failed to update job offer', err);
        this.snackBar.open('Error updating job offer.', 'Close', { duration: 3000 });
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
