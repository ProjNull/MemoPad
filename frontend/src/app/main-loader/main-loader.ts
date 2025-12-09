import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-loader',
  standalone: false,
  templateUrl: './main-loader.html',
  styleUrl: './main-loader.css',
})
export class MainLoader {
  @Input('is-loading') isLoading!:boolean;
}
