import { Component } from '@angular/core';
import { GlobalService } from '../../../global.service';
import { ApiService } from '../../../api.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(public global:GlobalService, private api:ApiService) {}


  registerForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
      email: new FormControl(''),
    });
  

  register() {
    const vars = this.registerForm.value;
    if (vars.username && vars.password && vars.email) {
      this.global.pushToast("info", "Registering in.");
      this.api.register(vars.username,vars.password, vars.email)
    } else {
      this.global.pushToast("warning","Wrong Input");
    }
  }
}
