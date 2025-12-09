import { Component, inject, OnInit, signal } from '@angular/core';
import { SettingsDialog } from './dialogs/settings/settings';

import {Dialog, DialogRef, DIALOG_DATA, DialogModule} from '@angular/cdk/dialog';
import { GlobalService } from './global-service';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');

    constructor(public g:GlobalService) {}
  

  dialog = inject(Dialog);

  isMainLoading = true;
  isSyncing = false;

  openSettings() {
    const dialogRef = this.dialog.open(SettingsDialog, {
      height: '90%',
      width: '90%',
      panelClass: 'dialog',
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isMainLoading = false;
    },5000);
  }


  sync() {
    this.isSyncing = true;

    setTimeout(() => {
      this.isSyncing = false;
    },2000);
  }  
}
