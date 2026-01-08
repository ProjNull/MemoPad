import axios, { Axios, type AxiosResponse } from 'axios'

import { useAuthStore } from '@/stores/auth'


const api = axios.create({
  baseURL: "/api"
})

api.interceptors.request.use((config) => {
  const auth = useAuthStore()

  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }

  return config
})



export default {
    axiosClient: api,


    login: (data: API.Request.UserLogin) => {
      return api.post<API.Responses.UserToken>("auth/login", data);
    },

    register: (data: API.Request.RegisterLogin) => {
      return api.post<API.Responses.UserToken>("auth/register", data);
    },

    getUserInfo: () => {
      return api.get<API.Responses.UserInfo>("auth/info");
    },

    getRootFolder: (): Promise<API.Responses.FolderInfo> => {
      return api.get("folders/");
    },

    getFolder: (folderId: number): Promise<API.Responses.FolderInfo> => {
      return api.get("folders/");
    },
    getSubFolders: (parentFolderId: number): Promise<API.Responses.SubFolders> => {
      return api.get(`folders/${parentFolderId}/folders`);
    },
    getSubNotes: (parentFolderId: number): Promise<API.Responses.FolderInfo> => {
      return api.get(`folders/${parentFolderId}/notes`);
    }

}
