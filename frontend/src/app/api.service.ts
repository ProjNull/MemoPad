import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { ErrorResponse, FolderFilesResponse, FolderResponse, InfoResponse, LoginResponse, NoteResponse, RegistrationResponse } from './api';
import { GlobalService } from './global.service';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token:string | null = null;
  constructor(private http:HttpClient, private g:GlobalService) { }

  mainLoading = false;

  handleError(response:any):Observable<any> {
    console.dir(response);
    console.error(response.statusText + " ("+ response.message + ")")
    this.g.pushToast("error", "(" +response.status + ") " + response.statusText);

    const err = new Error("Error ("+ response.status +"): " + response.message);
    return throwError(() => err);
  }

  Url(...path:string[]) {
    var apiBase = environment.apiBase;
    apiBase = apiBase.endsWith("/")? apiBase : apiBase + "/";
    return apiBase + path.join("/");
  }

  tryRecoverToken() {
    var possibleToken = localStorage.getItem("token");
    if (possibleToken) {
      this.g.pushToast("info", "Logging in.");
      this.mainLoading = true;
      this.token = possibleToken;
      this.userInfo().subscribe({
        next: () => {
          this.mainLoading = false;
          this.g.pushToast("success", "Welcome back!");
        },
        error: (response) => {
          this.mainLoading = false;
          this.token = null;
        }
      })
    }
  }

  userInfo() {

    let request = this.http.get<InfoResponse>(this.Url("auth","info"),{
      headers: {
        "Authorization": "Bearer " + this.token
      }
    })

    request.subscribe({
      error: (response) => {
        this.handleError(response);
        this.mainLoading =false;
      }
    })

    return request;
  }

  login(user:string,pass:string) {
    this.mainLoading = true;
    if (user.length > 0 && pass.length > 0) {
      let request = this.http.post<LoginResponse>(this.Url("auth","login"),{
        username: user,
        password: pass
      })

      request = request.pipe(catchError((val) => this.handleError(val)))
      request.subscribe((response) => {
          this.mainLoading =false;
          this.token = response.token;
          localStorage.setItem("token",this.token);
          this.g.pushToast("success", "Login Succsess");
          this.g.go("/");
      })

      return request;
    }
    return null;
  }

  register(user:string,pass:string,email:string) {
    this.mainLoading = true;
    if (user.length > 0 && pass.length > 0) {
      let request = this.http.post<RegistrationResponse>(this.Url("auth","register"),{
        username: user,
        password: pass,
        email: email,
      })

      request = request.pipe(catchError((val) => this.handleError(val)))
      request.subscribe((response) => {
          this.mainLoading =false;

          this.token = response.token;
          localStorage.setItem("token",this.token);
          this.g.pushToast("success", "Registration Succsess");
          this.g.go("/");
      })

      return request;
    }
    return null;
  }

  getFolder(id:number) {
    
    var url = this.Url("folders/");

    if (id >= 0) {
      url = this.Url("folders", id.toString());
    }

    let request = this.http.get<FolderResponse>(url,{
      headers: {
        "Authorization": "Bearer " + this.token
      }
    })

    request = request.pipe(catchError((val) => this.handleError(val)))


    return request;
  }

  getNote(id:number) {
    

    if (id <= 0) {
      return null;
    }

    var url = this.Url("notes", id.toString());

    let request = this.http.get<NoteResponse>(url,{
      headers: {
        "Authorization": "Bearer " + this.token
      }
    })

    request = request.pipe(catchError((val) => this.handleError(val)))


    return request;
  }

  getFolderFiles(id:number) {
    
    var url = this.Url("folders", "files");

    if (id >= 0) {
      url = this.Url("folders", id.toString(), "files");
    }

    let request = this.http.get<FolderFilesResponse>(url,{
      headers: {
        "Authorization": "Bearer " + this.token
      }
    })

    request = request.pipe(catchError((val) => this.handleError(val)))


    return request;

  }


  logout() {
    this.token = null;
    localStorage.clear();
  }

  newFolder(parentId:number, name:string) {
    this.g.pushToast("info", "Creating: " + name);
    let request = this.http.post<FolderResponse>(this.Url("folders",parentId.toString(), "create"),{name},{
      headers: {
        "Authorization": "Bearer " + this.token
      }
    })

    request = request.pipe(catchError((val) => this.handleError(val)))


    return request;
  }

  newNote(parentId:number, name:string) {
    this.g.pushToast("info", "Creating: " + name);
    let request = this.http.post<FolderResponse>(this.Url("notes", "create"),{
        folderId: parentId,
        name
      },{
      headers: {
        "Authorization": "Bearer " + this.token
      }
    })

    request = request.pipe(catchError((val) => this.handleError(val)))


    return request;
  }

  renameFolder(parentId:number, name:string) {
    this.g.pushToast("info", "Renaming: " + name);
    let request = this.http.post<FolderResponse>(this.Url("folders",parentId.toString(), "rename"),{name},{
      headers: {
        "Authorization": "Bearer " + this.token
      }
    })

    request = request.pipe(catchError((val) => this.handleError(val)))

    return request;
  }

  deleteFolder(id:number) {
    let request = this.http.delete<FolderResponse>(this.Url("folders",id.toString(), "delete"),{
      headers: {
        "Authorization": "Bearer " + this.token
      }
    })

    request = request.pipe(catchError((val) => this.handleError(val)))

    return request;
  }
  


}
