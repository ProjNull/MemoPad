import { Component } from '@angular/core';
import { ApiService } from '../../../api.service';
import { GlobalService } from '../../../global.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(public global:GlobalService, private api:ApiService) {}

  login() {
    this.global.pushToast("info", "Loggin in.");
    this.api.login("jan","test")?.subscribe((response)=> {
      this.global.pushToast("success", "Login Succsess");
      this.api.token = response.token;
      this.global.go("/");
    });
  }
}
