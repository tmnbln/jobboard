import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

interface DialogData {
  title: string;
  message: string;
  optionalText?: string;
  type?: 'confirm' | 'info';
  cancelText?: string;
  confirmText?: string;
}

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css'],
  standalone: true,
  imports: [MatSnackBar]
})

export class DialogBoxComponent {
  constructor (
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<DialogBoxComponent>
  ) {
    this.data.cancelText = this.data.cancelText ?? 'Cancel';
    this.data.confirmText = this.data.confirmText ?? 'OK';
  }

  onConfirm (): void {
    this.dialogRef.close(true);
  }

  onCancel (): void {
    this.dialogRef.close(false);
  }
}
