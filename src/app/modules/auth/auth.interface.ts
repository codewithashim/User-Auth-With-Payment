import { ENUM_USER_ROLE } from '../../../shared/enums/users-enum';

export interface IAuthUser {
    name: string;
    email: string;
    password: string;
    role: ENUM_USER_ROLE;
    phone: string;
}

export interface ILoginUser {
    email: string;
    password: string;
}

export interface ILoginResponse {
    accessToken: string;
    refreshToken?: string;
}

export interface IRefreshTokenResponse {
    accessToken: string;
}

export interface IChangePasswordResponse {
    success: boolean;
}

export interface IForgotPasswordResponse {
    emailSent: boolean;
}
