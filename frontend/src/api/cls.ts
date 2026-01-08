import axios, { Axios, type AxiosResponse } from 'axios'

export type Changelog = {
  id: number,
  title: string,
  projectID: number,
  description: string
}

type ChangelogIsLatest = {
  isLatest: boolean,
  latest: Changelog
}

const api = axios.create({
  baseURL: import.meta.env.VITE_CLS_ADDRESS ?? ""
})

const projectID = import.meta.env.VITE_CLS_PROJECT

export default {



    isLatest: async ():Promise<Changelog | false> => {

        const changelog = localStorage.getItem("cls_changelog");

        if (changelog) {
            const resCheck = await api.get<ChangelogIsLatest>("project/"+projectID + "/check?id="+changelog);
            
            if (resCheck.data.isLatest) {
                return false
            } else {
                localStorage.setItem("cls_changelog", resCheck.data.latest.id.toString());
                return resCheck.data.latest
            }
        } else {
            const resCheck = await api.get<Changelog>("project/"+projectID + "/latest");


            localStorage.setItem("cls_changelog", resCheck.data.id.toString());

            return resCheck.data

        }
    },


}
