import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { JobOfferService } from '../job-offer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrl: './dialog-box.component.css'
})
export class DialogBoxComponent {
  @Output() confirmed = new EventEmitter<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      message: string;
      type?: 'confirm' | 'info';
    },
    public dialogRef: MatDialogRef<DialogBoxComponent>) { }

  onConfirm(): void {
    this.confirmed.emit();
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
