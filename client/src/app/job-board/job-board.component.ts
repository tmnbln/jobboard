import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { JobOffer } from '../models/job-offer.model';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from '../models/board.model';
import { JobOfferService } from '../job-offer.service';
import { Subject, takeUntil } from 'rxjs';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { ScrapeFormComponent } from '../scrape-form/scrape-form.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';

@Component({
  selector: 'app-job-board',
  templateUrl: './job-board.component.html',
  styleUrls: ['./job-board.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, DragDropModule, MaterialModule, TimeAgoPipe]
})
export class JobBoardComponent implements OnInit, OnDestroy {
  board: Board = {
    name: 'JobBoard',
    columns: [
      { name: 'Applied', jobOffer: [] },
      { name: 'In Progress', jobOffer: [] },
      { name: 'Done', jobOffer: [] }
    ]
  };

  private destroy$ = new Subject<void>();

  constructor (
    private jobOfferService: JobOfferService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit (): void {
    this.fetchJobOffers();

    this.jobOfferService.getJobOfferAddedEvent().pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.fetchJobOffers());
  }

  fetchJobOffers (): void {
    this.jobOfferService.getJobOffers().subscribe(jobOffers => {
      this.board.columns.forEach(column => {
        column.jobOffer = jobOffers.filter(job => job.status === column.name);
      });
    });
  }

  drop (event: CdkDragDrop<JobOffer[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const jobOffer = event.container.data[event.currentIndex];
      const newStatus = this.board.columns.find(column => column.jobOffer === event.container.data)?.name;

      if (jobOffer && newStatus) {
        jobOffer.status = newStatus;
        this.jobOfferService.updateJobOffer(jobOffer).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          error: (error) => this.handleError('🦆 Failed to update job offer status', error)
        });
      }
    }
  }

  openDeleteDialog (jobOffer: JobOffer): void {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data: {
        title: 'Delete Offer?',
        message: 'Are you sure you want to delete this offer:',
        optionalText: jobOffer.title,
        confirmText: 'Delete',
        type: 'confirm'
      }
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (result) {
        this.jobOfferService.deleteJobOffer(jobOffer._id).subscribe({
          next: () => {
            this.showSuccessMessage('✨ Job offer deleted successfully.');
          },
          error: (error) => {
            this.handleError('🦆 Failed to delete job offer.', error);
          }
        });
      }
    });
  }

  openScrapeDialog (): void {
    this.dialog.open(ScrapeFormComponent, {
      data: {
        fromScrape: true,
        title: 'Scrape Offers',
        message: 'Enter URL to Scrape offer.'
      }
    });
  }

  openViewDialog (jobOffer: JobOffer): void {
    this.dialog.open(ScrapeFormComponent, {
      data: {
        jobOffer: jobOffer,
        fromScrape: false,
        title: 'View Offer'
      }
    });
  }

  ngOnDestroy (): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showSuccessMessage (message: string): void {
    this.snackBar.open(`✨ ${message}`, 'Close', { duration: 3000 });
  }

  private handleError (message: string, error: any): void {
    console.error(`🦆 ${message}:`, error);
    this.snackBar.open(`🦆 ${message}`, 'Close', { duration: 3000 });
  }
}
