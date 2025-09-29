import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../../api.service';
import { GlobalService } from '../../../global.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(public global:GlobalService, public api:ApiService) {}

  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  login() {
    const vars = this.loginForm.value;
    if (vars.username && vars.password) {
      this.global.pushToast("info", "Loggin in.");
      this.api.login(vars.username,vars.password);
    } else {
      this.global.pushToast("warning","Wrong Input");
    }
  }
}
