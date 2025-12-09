import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class SettingsDialog {
  dialogRef = inject<DialogRef<string>>(DialogRef<string>);
  data = inject(DIALOG_DATA);
}
