import { Component } from '@angular/core';
import { JobOfferService } from '../job-offer.service';
import { JobOffer } from '../models/job-offer.model';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scrape-form',
  templateUrl: './scrape-form.component.html',
  styleUrls: ['./scrape-form.component.css'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatProgressSpinnerModule, MatIconModule, ReactiveFormsModule, MatInputModule]
})
export class ScrapeFormComponent {
  url: string = '';
  jobOffer!: JobOffer;
  urlControl = new FormControl('');
  isLoading: boolean = false;
  destroy$ = new Subject();
  form!: FormGroup;

  constructor(
    private jobOfferService: JobOfferService,
    private snackBar: MatSnackBar,
  ) {}

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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
