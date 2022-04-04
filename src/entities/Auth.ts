export interface IAuth {
    token: string,
    user: IAuthUser
}

export interface IAuthUser {
    id: number
    login: string
    name: string
    role: string[]
    email: string
    first_auth:boolean
    type: string
    code: string
}