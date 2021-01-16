import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-note-dialog',
  templateUrl: './add-note-dialog.component.html',
  styleUrls: ['./add-note-dialog.component.scss']
})
export class AddNoteDialogComponent {

  newNoteFormGroup = new FormGroup({
      title: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
      password: new FormControl(null),
    }
  );

  encrypted = false;

  constructor(private dialogRef: MatDialogRef<AddNoteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { isPrivate: boolean }) {
  }

  onSubmit(): void {
    if (this.newNoteFormGroup.valid) {
      const data = {
        title: this.newNoteFormGroup.get('title').value,
        text: this.newNoteFormGroup.get('text').value,
        password: this.newNoteFormGroup.get('password').value,
      };
      this.dialogRef.close(data);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
