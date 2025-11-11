import { Component, ElementRef, Input, model, OnInit, output, Output, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-folder-view-item',
  standalone: false,
  templateUrl: './folder-view-item.component.html',
  styleUrl: './folder-view-item.component.css'
})
export class FolderViewItemComponent implements OnInit {

  @ViewChild('dropDown') dropDown!:ElementRef<HTMLElement>; 
  @ViewChild('folderElement') folderElement!:ElementRef<HTMLElement>; 

  

  @Input("folder-id") folderID = -0;
  @Input("open") openByDefault = false;

  @Input("is-root") isRoot = false;

  fullReload = output<void>();

  deleted = false;
  show = model(false);

  notesIDs:number[] = [];

  constructor(private api:ApiService, public g:GlobalService) {};

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
    
    this.api.getFolder(this.isRoot ? -1 : this.folderID).subscribe((resp) => {
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
        this.g.pushToast('success', 'Renamed "'+ this.folderName +'" to  "' + text + '"');
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
      this.api.deleteFolder(this.folderID).subscribe(()=> {
        this.g.pushToast("success", "Deleted: " + this.folderName);
        this.fullReload.emit();
        this.deleted = true;
      })
    }
  }

  toggleFolder() {
    if (!this.isRoot) {
      this.show.set(!this.show())
    } else {
      this.show.set(true);
    }
  }

  focus(event:MouseEvent) {
    event.preventDefault();
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur();
    }
    setTimeout(() => this.dropDown.nativeElement.focus(), 1);
  }


  dragOverHandler(event:DragEvent) {
    if (event.target) {
      var target = (event.target as HTMLElement);
      this.folderElement.nativeElement.classList.add("dropping")

    }
    event.preventDefault();
  }

  dragLeaveHandler(event:DragEvent) {
    if (event.target) {
      var target = (event.target as HTMLElement);
      this.folderElement.nativeElement.classList.remove("dropping")
    }
  }

  dragDropHandler(event:DragEvent) {
    if (event.dataTransfer) {
      var dataRaw = event.dataTransfer.getData("memopad/move");
      console.log(dataRaw);
      if (dataRaw) {
        var data = JSON.parse(dataRaw);
        if (data && data.type && data.val) {
          console.log(data);
          if (!this.g.validateFERequest(data.val)) {
            console.warn("Wrong Validation number");
            return;
          }
          if (data.type == "note") {
            if (data.folderID != this.folderID) {
              this.g.pushToast("info","Moving Note")
              this.api.moveNote(data.id,this.folderID).subscribe(()=> {
                this.g.setFolderState(this.folderID, true);
                this.doFullReload();
                this.g.pushToast("success", "Done");
              });
            }
            
          } else if (data.type == "folder") {
            if (data.id != this.folderID) {
              this.g.pushToast("info","Moving Folder")
              this.api.moveFolder(data.id,this.folderID).subscribe(()=> {
                this.g.setFolderState(this.folderID, true);
                this.doFullReload();
                this.g.pushToast("success", "Done");
              });
            }

          } else {
            this.g.pushToast("warning","Wrong Move Type")
          }
        }
      }
    }
    this.folderElement.nativeElement.classList.remove("dropping")
    
  }

  dragStartHandler(event:DragEventInit) {
    
    var data = {
      type: "folder",
      id: this.folderID,
      val: this.g.getFEValNumber()
    }

    event.dataTransfer!.setData("memopad/move",JSON.stringify(data));
    
  }
  
}
