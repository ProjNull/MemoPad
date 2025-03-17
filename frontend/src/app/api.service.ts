import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ErrorResponse, FolderResponse, InfoResponse, LoginResponse, RegistrationResponse } from './api';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token:string | null = null;
  constructor(private http:HttpClient, private g:GlobalService) { }

  mainLoading = false;

  handleError(response:HttpErrorResponse) {
    console.error(response.statusText + " ("+ response.message + ")")
    this.g.pushToast("error",response.statusText);
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

      request.subscribe({
        next: (response) => {
          this.mainLoading =false;
          this.token = response.token;
          localStorage.setItem("token",this.token);
        },
        error: (response) => {
          this.handleError(response);
          this.mainLoading =false;
        }
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

      request.subscribe({
        next: (response) => {
          this.mainLoading =false;

          this.token = response.token;
          localStorage.setItem("token",this.token);
        },
        error: (response) => {
          this.handleError(response);
          this.mainLoading =false;
        }
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

    return request;

  }


  newFolder(parentId:number, name:string) {
    this.g.pushToast("info", "Creating: " + name);
    let request = this.http.post<FolderResponse>(this.Url("folders",parentId.toString(), "create"),{name},{
      headers: {
        "Authorization": "Bearer " + this.token
      }
    })

    return request;
  }
  


}
