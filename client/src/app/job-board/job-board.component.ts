import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Board } from '../models/board.model';
import { Column } from '../models/column.model';
import { JobOfferService } from '../job-offer.service';

@Component({
  selector: 'app-job-board',
  templateUrl: './job-board.component.html',
  styleUrl: './job-board.component.css'
})
export class JobBoardComponent implements OnInit {

  constructor(private jobOfferService: JobOfferService) { }

  board: Board = new Board('JobBoard', [
    new Column('Applied', []),
    new Column('In Progress', []),
    new Column('Done', [])
  ]);

  ngOnInit(): void {
this.jobOfferService.getJobOffers().subscribe(jobOffers => {
this.board.columns[0].offers = jobOffers.map(jobOffer => `${jobOffer.title} ${jobOffer.company}`);
});
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
