import { Component, ElementRef, Input, OnInit, output, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-note-view-item',
  standalone: false,
  templateUrl: './note-view-item.component.html',
  styleUrl: './note-view-item.component.css'
})
export class NoteViewItemComponent implements OnInit {

  @ViewChild('dropDown') dropDown!:ElementRef<HTMLElement>; 

  @Input("note-id") noteID = -0;

  fullReload = output<void>();


  noteName: string | null = null;
  noteParrent: number | null = null;
  constructor(private api:ApiService, public g:GlobalService) {};

  ngOnInit(): void {
    this.loadNote();
  }

  private loadNote() {
    this.api.getNote(this.noteID)?.subscribe((note)=> {
      this.noteName = note.title
      this.noteParrent = note.folderId
    })
  }
  
  select() {
    this.api.fetchNote(this.noteID);
  }

  rename(text:string | null = null) {

    
    if (text == null) {
      text = prompt("Rename Note:", this.noteName ?? "");
    }
    if (text) {
      this.api.renameNote(this.noteID,text).subscribe(()=> {
        this.g.pushToast('success', 'Renamed "'+ this.noteName +'" to  "' + text + '"');
        this.loadNote();
      });
    }
  }

  delete(skipAsk: boolean = false) {
    var inpt = true;
    if (!skipAsk) {
      inpt =  confirm("Delete Note?");
    }

    if (inpt) {
      this.api.deleteNote(this.noteID).subscribe(()=> {
        this.fullReload.emit();
        this.g.pushToast("success", "Deleted: " + this.noteName);
      });
    }
  }

  focus(event:MouseEvent) {
    event.preventDefault();
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
    setTimeout(() => this.dropDown.nativeElement.focus(), 1);
  }


  dragStartHandler(event:DragEventInit) {
    
    var data = {
      type: "note",
      id: this.noteID,
      folderID: this.noteParrent,
      val: this.g.getFEValNumber()
    }

    event.dataTransfer!.setData("memopad/move",JSON.stringify(data));
    
  }
}
