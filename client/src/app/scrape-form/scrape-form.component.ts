import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JobOfferService } from '../job-offer.service';
import { JobOffer } from '../models/job-offer.model';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-scrape-form',
  templateUrl: './scrape-form.component.html',
  styleUrls: ['./scrape-form.component.css']
})
export class ScrapeFormComponent {
  url: string = '';
  jobOffer!: JobOffer;
  form: FormGroup;
  urlControl = new FormControl('');

  constructor(private http: HttpClient, private jobOfferService: JobOfferService, private snackBar: MatSnackBar) {
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
    console.log("✨ Sending URL to server:", this.url);
    this.jobOfferService.readJobOffer(this.url).subscribe((data: any) => {
      this.form.patchValue({
        company: data.company,
        title: data.title,
        location: data.location,
        description: data.description,
        salary: data.salary,
        url: data.url,
        notes: ''
      });
      console.log("✨ Received data:", data);
    }, error => {
      console.error("🦆 Failed to fetch data:", error);
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
    });
  }
}