import axios, { Axios, type AxiosResponse } from 'axios'

import { useAuthStore } from '@/stores/auth'


var apiBase = import.meta.env.VITE_API_URL ?? "$BASE/api/"


apiBase = apiBase.replace("$BASE",import.meta.env.BASE_URL);

const client = axios.create({
  baseURL: apiBase
})

client.interceptors.request.use((config) => {
  const auth = useAuthStore()

  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }

  return config
})


/**
 * # NULL Memopad API Client
 */
export default {

  /**
   * Main AXIOS Client (use this for custom calls to the API)
  */
  c: client,


  //MARK: Auth
  /**
   * # Auth API
   * 
   * Everything needed for auth.
   */
  auth: {
    /**
     * Log in with Username and password.
     * 
     * **NOTE**: Does not auto save the token! You must manualy save it to auth state.
     * 
     * ```js
     * const auth = useAuthState()
     * auth.setToken(token)
     * ```
     * 
     * @param data Credentials
     * @returns User Token
     */
    login: (data: API.UserLogin) => {
      return client.post<API.UserToken>("auth/login", data);
    },

    /**
     * Register and account.
     * 
     * **NOTE**: Does not auto save the token you must manualy save it to auth state.
     * 
     * ```js
     * const auth = useAuthState()
     * auth.setToken(token)
     * ```
     * 
     * @param data Credentials
     * @returns User Token (No need to call`Api.auth.login()`)
     */
    register: (data: API.RegisterLogin) => {
      return client.post<API.UserToken>("auth/register", data);
    },

    /**
     * Get user information like email and username.
     * @returns User Info
     */
    getUserInfo: () => {
      return client.get<API.UserInfo>("auth/info");
    },

  },

  //MARK: Folders
  /**
   * # Folders API
   * 
   * All API Calls related to folders.
   */
  folders: {
    getRootFolder: () => {
      return client.get<API.FolderInfo>("folders/");
    },
    getFolder: (folderID: number) => {
      return client.get<API.FolderInfo>(`folders/${folderID}`);
    },
    getSubFolders: (folderID: number) => {
      return client.get<API.SubFolders>(`folders/${folderID}/folders`);
    },
    getSubNotes: (folderID: number) => {
      return client.get<API.SubNotes>(`folders/${folderID}/files`);
    },

    create: (folderID: number, name:string) => {
      return client.post<API.FolderInfo>(`folders/${folderID}/create`, {name});
    },

    /**
     * Renames Note.
     * @param folderID ID of the note to rename.
     * @returns AXIOS Response Handler (use `catch()` for error handling)
     */
    rename: (folderID: number,name:string) => {
      return client.post<API.FolderInfo>(`folders/${folderID}/rename`, {name});
    },

    /**
     * Deletes a note.
     * @param folderID ID of the note to delete.
     * @returns AXIOS Response Handler (use `catch()` for error handling)
     */
    delete: (folderID: number) => {
      return client.delete<{message:string}>(`folders/${folderID}/delete`);
    },
  },


  // MARK: Notes
  /**
   * # Notes API
   * 
   * All API Calls related to notes.
   */
  notes: {
    /**
     * Creates Note in specified folder.
     * @param folderID Folder ID where the note will be created.
     * @param name Note name
     * @returns AXIOS Response Handler (use `catch()` for error handling)
     */
    create: (folderID: number,name:string) => {
      return client.post<API.NoteInfo>(`notes/create`,{
        folderId: folderID,
        name,
        content: ""
      });
    },

    /**
     * Gets Note information like content and name.
     * @param noteID ID of the note to get.
     * @returns AXIOS Response Handler (use `catch()` for error handling)
     */
    get: (noteID: number) => {
      return client.get<API.NoteInfo>(`notes/${noteID}`);
    },

    /**
     * Edits Note content.
     * @param noteID ID of the note to edit.
     * @returns AXIOS Response Handler (use `catch()` for error handling)
     */
    edit: (noteID: number,content:string) => {
      return client.post<API.NoteInfo>(`notes/${noteID}/content`, {content});
    },

    /**
     * Renames Note.
     * @param noteID ID of the note to rename.
     * @returns AXIOS Response Handler (use `catch()` for error handling)
     */
    rename: (noteID: number,name:string) => {
      return client.post<API.NoteInfo>(`notes/${noteID}/rename`, {name});
    },

    /**
     * Renames Note.
     * @param noteID ID of the note to rename.
     * @param folderID ID of the folder to move the note to.
     * @returns AXIOS Response Handler (use `catch()` for error handling)
     */
    move: (noteID: number,folderID:number) => {
      return client.post(`notes/${noteID}/move`);
    },

    /**
     * Deletes a note.
     * @param noteID ID of the note to delete.
     * @returns AXIOS Response Handler (use `catch()` for error handling)
     */
    delete: (noteID: number) => {
      return client.delete<{message:string}>(`notes/${noteID}/delete`);
    },
  }
}
