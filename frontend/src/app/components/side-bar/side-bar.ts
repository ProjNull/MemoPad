import { Component } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  standalone: false,
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {
  public isOpen = false;
  open() {
    this.isOpen = true;
  }
  close() {
    this.isOpen = false;
  }
}
