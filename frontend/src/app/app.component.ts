import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from './api.service';
import { GlobalService } from './global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private router:Router, private api:ApiService, public g:GlobalService) {}

  ngOnInit(): void {
    this.api.tryRecoverToken();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if (this.api.token == null) {
          if (!url.startsWith("/auth")) {
            this.router.navigateByUrl("auth");
          }
        } else if (url.startsWith("/auth") && !url.startsWith("/auth/logout")) {
          this.router.navigateByUrl("/");
        }
        
      }
    })
  }
}
