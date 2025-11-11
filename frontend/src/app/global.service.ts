import { effect, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';


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

  // Makes sure that accidental drops/interactions from other windows/tabs are ignored
  private FEvalidationNumber = 0;
  public validateFERequest(num:Number) {
    return num == this.FEvalidationNumber;
  }
  public getFEValNumber() {
    return this.FEvalidationNumber;
  }


  constructor(private router:Router) {
    this.FEvalidationNumber = Math.random();
    toObservable(this.devMode).subscribe((newState) => {
      console.log("Devmode: " + newState);

      if (newState) {
        localStorage.setItem("devmode","yes");
      } else {
        localStorage.setItem("devmode","no")
      }
    });
    const reloadToastRaw = sessionStorage.getItem("onReloadToast");
    if (reloadToastRaw) {
      try {
        const data = JSON.parse(reloadToastRaw) as Toast;

        this.pushToast(data.type, data.msg);

      } catch (e) {
        console.log("Error while displaing Reload Toast")
      }
      sessionStorage.removeItem("onReloadToast")
    }

    if (localStorage.getItem("devmode") == "yes") {
      this.devMode.set(true);
    }
  }

  
  copyToClipboard(text:string |undefined) {
    if (text) {
      if (navigator.clipboard) {
          // Use the Clipboard API
          navigator.clipboard.writeText(text).then(() => {
              this.pushToast("success","Succesfully copied!")
          }).catch(err => {
              this.pushToast("error","Failed to copy!")
            
              console.error('Failed to copy text to clipboard: ', err);
          });
      } else {
          this.pushToast("warning","Feature unsuporeted")
      }
    }
  }

  blurCurrentElement() {
    if (document.activeElement) {
      (document.activeElement as HTMLElement).blur()
    }
  }

  public devMode = signal(false);


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

  private itr = 0;

  pushToast(type:ToastType, msg:string) {
    var toastID = ++this.itr;
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

  pushOnReloadToast(type:ToastType, msg:string) {

    const data = JSON.stringify({
      id: ++this.itr,
      type,msg,
      shown:false
    });
    sessionStorage.setItem("onReloadToast", data);
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
