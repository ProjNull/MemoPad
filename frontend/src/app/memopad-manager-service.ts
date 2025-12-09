import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemopadManagerService {
  
  constructor(public localDB:NgxIndexedDBService) {};


  addNote(name:string,content:string) {
    return this.localDB.add<LocalNoteCreate>("notes", {name,content})
  }

  updateNote(n:LocalNote) {
    return this.localDB.update<LocalNote>("notes", n);
  }

  getNotes() {
    return new Observable((sub) => {
      this.localDB.getAll<LocalNote>("notes").subscribe((data)=> {
        var notes: LocalNoteRef[] = data.map((org)=> {
          return {localId:org.localId, name: org.name}
        });
        sub.next(notes);
        sub.complete();
      })

    })
  }

  getFolder() {
    return new Observable((sub) => {
      this.localDB.getAll<LocalFolder>("folder").subscribe((data)=> {
        var folders: LocalFolderRef[] = data.map((org)=> {
          return {localId:org.localId, name: org.name}
        });
        sub.next(folders);
        sub.complete();
      })

    })
  }

  addFolder(name:string,content:string) {
    
  }
}
