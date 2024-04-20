import { Component, Inject } from '@angular/core';
import { JobOfferService } from '../job-offer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrl: './dialog-box.component.css'
})
export class DialogBoxComponent {
  constructor (
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    private jobOfferService: JobOfferService,
    private snackBar: MatSnackBar) { }

  deleteJobOffer (): void {
    this.jobOfferService.deleteJobOffer(this.data.id).subscribe({
      next: () => {
        console.log('✨ Job offer deleted successfully.');
        this.dialogRef.close();
      },
      error: (err) => {
        console.error('🦆 Failed to delete job offer.', err);
        this.dialogRef.close();
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.snackBar.open('✨ Offer deleted successfully', 'Close', {
        duration: 3000
      });
    });
  }
}
