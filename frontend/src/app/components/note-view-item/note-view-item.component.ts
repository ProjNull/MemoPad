import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-note-view-item',
  standalone: false,
  templateUrl: './note-view-item.component.html',
  styleUrl: './note-view-item.component.css'
})
export class NoteViewItemComponent implements OnInit {
  @Input("note-id") noteID = -0;


  noteName: string | null = null;
  constructor(private api:ApiService, private g:GlobalService) {};

  ngOnInit(): void {
    this.api.getNote(this.noteID)?.subscribe((note)=> {
      this.noteName = note.title
    })
  }
  
}
