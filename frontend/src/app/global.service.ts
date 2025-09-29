import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


type ToastType = "info" | "warning" | "success" | "error";
type Toast = {
  id:number,
  type: ToastType
  msg: string,
  shown: boolean
}


@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private router:Router) { }

  private openFolders:number[] = [];

  public toasts:Array<Toast> = [];

  private selectedNoteID:number|null = null;

  createDialog(content:HTMLElement, callback:()=>void) {
    const dialog = document.createElement("dialog");

    const modal = document.createElement("dialog");

    document.body.append(dialog)
    dialog.showModal();
    dialog.addEventListener("close",()=> {
      callback();
      dialog.remove();
    })
  }

  doRename(deftext:string, callback:()=>void) {
    const renameForm = document.createElement("input");
    renameForm.type = "text";
    renameForm.value = deftext;
  }

  setFolderState(id:number,open:boolean) {
    if (open) {
      if (this.openFolders.indexOf(id) == -1) {
        this.openFolders.push(id);
      }
    } else {
      this.openFolders = this.openFolders.filter((f)=> f != id);
    }
    console.log(this.openFolders)
  }

  getFolderState(id:number) {
    return this.openFolders.indexOf(id) != -1;
  }

  pushToast(type:ToastType, msg:string) {
    var toastID = this.toasts.length + 1
    this.toasts.push({
      id: toastID,
      type,msg,
      shown:false
    });

    setTimeout(() => {
      this.toasts = this.toasts.filter((toast)=> {
        return toast.id != toastID
      })
    },2000)
  }

  setOpenNote(noteID: number) {
    this.selectedNoteID = noteID;
  }

  getOpenNote() {
    return this.selectedNoteID;
  }

  go(path:string) {
    this.router.navigateByUrl(path);
  }
}
