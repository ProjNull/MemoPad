import { Component, Input, model, OnInit, output, Output } from '@angular/core';
import { ApiService } from '../../api.service';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-folder-view-item',
  standalone: false,
  templateUrl: './folder-view-item.component.html',
  styleUrl: './folder-view-item.component.css'
})
export class FolderViewItemComponent implements OnInit {

  @Input("folder-id") folderID = -0;
  @Input("open") openByDefault = false;

  @Input("is-root") isRoot = false;

  fullReload = output<void>();

  deleted = false;
  show = model(false);

  notesIDs:number[] = [];

  constructor(private api:ApiService, private g:GlobalService) {};

  folderName:string | null = null;
  childIds:number[] = []
  ngOnInit(): void {
    this.loadFolder();
    if (this.openByDefault || this.g.getFolderState(this.folderID)) {
      this.show.set(true);
    }

    this.show.subscribe((val)=>{
      this.g.setFolderState(this.folderID, val);
    })
  }

  doFullReload() {
    this.loadFolder();
    this.fullReload.emit();
  }

  loadFolder() {
    this.folderName = null;
    
    this.api.getFolder(this.folderID).subscribe((resp) => {
      this.folderName = resp.name;
      this.folderID = resp.id;
      this.childIds = resp.subFolderIds;
      this.notesIDs = resp.noteIds;
    })
  }

  newFolder(name: string | null = null) {
    if (name == null ){
      var name = prompt("Folder name:")
    }
    this.g.setFolderState(this.folderID, true);
    this.show.set(true);
    if (name && name != "") {
      this.api.newFolder(this.folderID, name).subscribe((newFolder)=> {
        this.g.pushToast("success", "Created: " + name);
        this.loadFolder();
      })
    }
  }
  newNote(name: string | null = null) {
    if (name == null ){
      var name = prompt("Note name:")
    }
    this.g.setFolderState(this.folderID, true);
    this.show.set(true);
    if (name && name != "") {
      this.api.newNote(this.folderID, name).subscribe((newFolder)=> {
        this.g.pushToast("success", "Created: " + name);
        this.loadFolder();
      })
    }
  }

  renameFolder(text:string | null = null) {

    
    if (text == null) {
      text = prompt("Rename Note:", this.folderName ?? "");
    }
    if (text && text != "") {
      this.api.renameFolder(this.folderID, text).subscribe(()=> {
        this.g.pushToast("success", "Renamed: " + text);
        this.loadFolder();
      })
    }
  }

  deleteFolder(skipAsk: boolean = false) {
    var inpt = true;
    if (!skipAsk) {
      inpt =  confirm("Delete Folder?");
    }
    if (inpt) {
      this.g.pushToast("info", "Deleting: " + name);
      this.api.deleteFolder(this.folderID).subscribe(()=> {
        this.g.pushToast("success", "Deleted: " + name);
        this.fullReload.emit();
        this.deleted = true;
      })
    }
  }
}
