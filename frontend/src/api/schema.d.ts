

declare namespace API {
    type UserToken = {
        token: string
    }

    type UserLogin = {
        username: string,
        password: string,
    }

    type RegisterLogin = {
        username: string,
        password: string,
    }


    type FolderInfo = {
        id: number,
        name: string,
        parentId: number,
        ownerId: number,
        subFolderIds: number[],
        noteIds: number[]
    }

    type SubFolders = FolderInfo[];

    type UserInfo = {
        id: number,
        username: string,
        email: string
    }

    type NoteInfo = {
        id: number,
        title: string,
        content: string,
        folderId: number,
        ownerId: number
    }

    type SubNotes = NoteInfo[];

}