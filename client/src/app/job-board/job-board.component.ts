import { JobOffer } from './../models/job-offer.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Board } from '../models/board.model';
import { JobOfferService } from '../job-offer.service';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { ScrapeFormComponent } from '../scrape-form/scrape-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-job-board',
  templateUrl: './job-board.component.html',
  styleUrl: './job-board.component.css',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule, CommonModule, MatDialogModule, DragDropModule]
})

export class JobBoardComponent implements OnInit {
  jobOffer!: JobOffer;
  destroy$ = new Subject();

  constructor(
    private jobOfferService: JobOfferService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar) { }

  board: Board = {
    name: 'JobBoard',
    columns: [
      {
        name: 'Applied',
        jobOffer: []
      },
      {
        name: 'In Progress',
        jobOffer: []
      },
      {
        name: 'Done',
        jobOffer: []
      }
    ]
  };

  ngOnInit(): void {
    this.fetchJobOffers();

    this.jobOfferService.getJobOfferAddedEvent()
      .pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.fetchJobOffers();
      });
  }

  fetchJobOffers(): void {
    this.jobOfferService.getJobOffers().subscribe(jobOffers => {
      this.board.columns.forEach(column => {
        column.jobOffer = jobOffers.filter(job => job.status === column.name);
      });
    });
  }

  drop(event: CdkDragDrop<JobOffer[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const jobOffer = event.container.data[event.currentIndex];
      const newStatus = this.board.columns.find(column => column.jobOffer === event.container.data)?.name;

      if (jobOffer && newStatus) {
        jobOffer.status = newStatus;
        this.jobOfferService.updateJobOffer(jobOffer).subscribe({});
      }
    }
  }

  openDeleteDialog(jobOffer: JobOffer): void {
    const dialogRef = this.matDialog.open(DialogBoxComponent, {
      data: {
        title: 'Delete Offer?',
        message: 'Are you sure you want to delete this offer:',
        optionalText: jobOffer.title,
        confirmText: 'Delete',
        type: 'confirm'
      }
    });

    dialogRef.componentInstance.confirmed.subscribe(() => {
      this.jobOfferService.deleteJobOffer(jobOffer._id).subscribe({
        next: () => {
          console.log('✨ Job offer deleted successfully.');
          dialogRef.close();
        },
        error: (err) => {
          console.error('🦆 Failed to delete job offer.', err);
          dialogRef.close();
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.snackBar.open('✨ Offer deleted successfully', 'Close', {
          duration: 3000
        });
      });
    });
  }

  openScrapeDialog(): void {
    this.matDialog.open(ScrapeFormComponent, {
      data: {
        fromScrape: true,
        title: 'Scrape Offers',
        message: 'Enter URL to Scrape offer.'
      },
    });
  }

  openViewDialog(jobOffer: JobOffer): void {
    this.matDialog.open(ScrapeFormComponent, {
      data: {
        jobOffer: jobOffer,
        fromScrape: false,
        title: 'View Offer'
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
