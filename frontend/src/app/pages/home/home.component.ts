import { Component, effect, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../../api.service';
import { NoteResponse } from '../../api';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(public api:ApiService, public global:GlobalService)  {};

  note: NoteResponse | null = null;

  editMode = false;

  isChanged = false;

  autoSaveTimeout: number | undefined = undefined;

  logout() {
    if (confirm("Really log out?")) {
      this.api.logout();
      location.reload();
    }
  }

  ngOnInit(): void {
    
    this.api.getNoteObserver().subscribe((newNote) =>{
      this.note = newNote;
    })

  }

  toggleEditMode(event:Event) {
    const target = event.target as HTMLInputElement;
    if (target) {
      if (this.editMode && !target.checked) {
        this.save()
      }

      


      this.editMode = target.checked;
    }
  }

  save() {
    if (this.isChanged) {
      this.api.updateNoteContent(this.note)?.subscribe(()=> {
        this.global.pushToast("success","Saved")
        this.isChanged = false;
      });
    }
  }

  onEditBox(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    if (target) {
      if  (this.note && this.note.content) {
        this.isChanged = true;
        this.note.content = target.value;
      }
    }

    clearTimeout(this.autoSaveTimeout)
    this.autoSaveTimeout = setTimeout(()=> {
      this.save()
    }, 1000)
  }

  onEditBoxInput(e:KeyboardEvent) {
    if (e.key == 'Tab') {
      e.preventDefault();
    } else if (e.ctrlKey && e.key === 's') {
      // Prevent the Save dialog to open
      e.preventDefault();
      // Place your code here
      
    

      clearTimeout(this.autoSaveTimeout)
      this.save();
    } else {

      
    }
  }

}
