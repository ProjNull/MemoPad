
export type LoginResponse = {
    token: string
}

export type InfoResponse = {
    id: number,
    username: string,
    email: string
}

export const ExpectedRegisterStatus = 201; // Idk why.
export type RegistrationResponse = LoginResponse;

export type ErrorResponse = {
    timestamp: number,
    status: number,
    error: string,
    path: string
}

export type FolderResponse = {
    id: number,
    name: string,
    parentId: number | null,
    ownerId: number,
    subFolderIds: number[]
}