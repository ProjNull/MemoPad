import { Component } from '@angular/core';
import { GlobalService } from '../../../global.service';
import { ApiService } from '../../../api.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(public global:GlobalService, private api:ApiService) {}

  register() {
    this.global.pushToast("info", "Registering in.");
    this.api.register("jan","test", "honzik@janpalma.cz")?.subscribe(()=> {
      this.global.pushToast("success", "Registration Succsess");
      this.global.go("/");
    });
  }
}
