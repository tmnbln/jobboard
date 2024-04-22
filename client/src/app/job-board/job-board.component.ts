import { JobOffer } from './../models/job-offer.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Board } from '../models/board.model';
import { Column } from '../models/column.model';
import { JobOfferService } from '../job-offer.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { ScrapeFormComponent } from '../scrape-form/scrape-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-job-board',
  templateUrl: './job-board.component.html',
  styleUrl: './job-board.component.css'
})

export class JobBoardComponent implements OnInit {
  jobOffer!: JobOffer;
  destroy$ = new Subject();

  constructor(
    private jobOfferService: JobOfferService,
    private matDialog: MatDialog,
    private snackBar: MatSnackBar) { }

  board: Board = new Board('JobBoard', [
    new Column('Applied', []),
    new Column('In Progress', []),
    new Column('Done', [])
  ]);

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

        this.jobOfferService.updateJobOffer(jobOffer);
      }
    }
  }

  deleteJobOffer(id: string): void {
    this.jobOfferService.deleteJobOffer(id).pipe(
      tap(() => { console.log('success'); }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

openDeleteDialog(jobOffer: JobOffer): void {
    const dialogRef = this.matDialog.open(DialogBoxComponent, {
      data: {
        title: 'Delete Offer?',
        message: 'Are you sure you want to delete this offer:',
        optionalText: jobOffer.title,
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
    const dialogRef = this.matDialog.open(ScrapeFormComponent, {
      data: {
        showHeader: true,
        title: 'Scrape Offers',
        message: 'Enter URL to Scrape offer.'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchJobOffers();
      }
    });
  }

openViewDialog(): void {
const dialogRef = this.matDialog.open(ScrapeFormComponent, {
data: { jobOffer: this.jobOffer, showHeader: false }
});

dialogRef.afterClosed().subscribe(result => {
console.log('The dialog was closed');
});
}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
