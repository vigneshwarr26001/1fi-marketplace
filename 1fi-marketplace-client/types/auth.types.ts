export type UserRole = 'user' | 'admin';

export interface IUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginData {
    accessToken: string;
    user: IUser;
}

export interface IMeData {
    user: IUser;
}

export interface ILogoutData {
    message: string;
}
