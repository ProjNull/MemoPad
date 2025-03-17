import { Component } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private api:ApiService)  {};

  logout() {
    if (confirm("Really log out?")) {
      this.api.logout();
      location.reload();
    }
  }
}
