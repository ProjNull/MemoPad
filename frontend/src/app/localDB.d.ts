
type LocalNoteRef = {
    localId:number,
    name:string
}

type LocalNoteCreate = {
    name:string,
    content: string,
}


type LocalNote = {
    localId:number,
    remoteId:number,
    name:string,
    content: string,
}


type LocalFolderRef = {
    localId:number,
    name:string
}

type LocalFolderCreate = {
    name:string,
    content: string,
}


type LocalFolder = {
    localId:number,
    remoteId:number,
    name:string,
    content: string,
}