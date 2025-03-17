import { Component, Input, model, OnInit } from '@angular/core';
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

  show = model(false);


  constructor(private api:ApiService, private g:GlobalService) {};

  folderName:string | null = null;
  childIds:number[] = []
  ngOnInit(): void {
    this.loadFolder();
  }

  loadFolder() {
    this.folderName = null;
    this.api.getFolder(this.folderID).subscribe((resp) => {
      this.folderName = resp.name;
      this.folderID = resp.id;
      this.childIds = resp.subFolderIds;
    })
  }

  newFolder() {
    var name = prompt("Folder name:")
    if (name && name != "") {
      this.api.newFolder(this.folderID, name).subscribe(()=> {
        this.g.pushToast("success", "Created: " + name);
        this.loadFolder();
      })
    }
  }
  newNote() {

  }
}
