declare namespace API {


    //MARK: Responses
    namespace Responses {
        type UserToken = {
            token: string
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
    }


    //MARK: Request
    namespace Request {
        type UserLogin = {
            username: string,
            password: string,
        }

        type RegisterLogin = {
            username: string,
            password: string,
        }
    }

    //MARK: Misc
    namespace Misc {

    }
}