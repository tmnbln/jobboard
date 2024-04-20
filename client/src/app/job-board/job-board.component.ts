import { JobOffer } from './../models/job-offer.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Board } from '../models/board.model';
import { Column } from '../models/column.model';
import { JobOfferService } from '../job-offer.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-job-board',
  templateUrl: './job-board.component.html',
  styleUrl: './job-board.component.css'
})

export class JobBoardComponent implements OnInit {
  jobOffer!: JobOffer;
  destroy$ = new Subject();

  constructor (
    private jobOfferService: JobOfferService,
    private matDialog: MatDialog) { }

  board: Board = new Board('JobBoard', [
    new Column('Applied', []),
    new Column('In Progress', []),
    new Column('Done', [])
  ]);

  ngOnInit (): void {
    this.fetchJobOffers();

    this.jobOfferService.getJobOfferAddedEvent()
      .pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.fetchJobOffers();
      });
  }

  fetchJobOffers (): void {
    this.jobOfferService.getJobOffers().subscribe(jobOffers => {
      this.board.columns.forEach(column => {
        column.jobOffer = jobOffers.filter(job => job.status === column.name);
      });
    });
  }

  drop (event: CdkDragDrop<JobOffer[]>) {
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

  deleteJobOffer (id: string): void {
    this.jobOfferService.deleteJobOffer(id).pipe(
      tap(() => { console.log('success'); }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  openDialog (id: string): void {
    this.matDialog.open(DialogBoxComponent, {
      data: { id: id }
    });
  }

  ngOnDestroy (): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
