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

  newFolder() {
    var name = prompt("Folder name:")
    this.g.setFolderState(this.folderID, true);
    this.show.set(true);
    if (name && name != "") {
      this.api.newFolder(this.folderID, name).subscribe((newFolder)=> {
        this.g.pushToast("success", "Created: " + name);
        this.loadFolder();
      })
    }
  }
  newNote() {
    this.loadFolder();
  }

  renameFolder() {
    var name = prompt("New name:", this.folderName ?? "Undefined");
    if (name && name != "") {
      this.api.renameFolder(this.folderID, name).subscribe(()=> {
        this.g.pushToast("success", "Renamed: " + name);
        this.loadFolder();
      })
    }
  }

  deleteFolder() {
    var name = confirm("Really Delete?");
    if (name) {
      this.g.pushToast("info", "Deleting: " + name);
      this.api.deleteFolder(this.folderID).subscribe(()=> {
        this.g.pushToast("success", "Deleted: " + name);
        this.fullReload.emit();
        this.deleted = true;
      })
    }
  }
}
