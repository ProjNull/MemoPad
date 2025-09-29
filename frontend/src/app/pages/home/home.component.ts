import { Component, effect, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../../api.service';
import { NoteResponse } from '../../api';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(public api:ApiService)  {};

  note = signal<NoteResponse | null>(null);

  logout() {
    if (confirm("Really log out?")) {
      this.api.logout();
      location.reload();
    }
  }

  ngOnInit(): void {
    
    this.api.getNoteObserver().subscribe((newNote) =>{
      this.note.set(newNote);
    })

  }

}
