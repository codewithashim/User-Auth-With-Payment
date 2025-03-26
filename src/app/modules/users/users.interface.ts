import { Model } from 'mongoose';
import { ENUM_USER_ROLE } from '../../../shared/enums/users-enum';

export type IUser = {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    role: ENUM_USER_ROLE;
    password: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
};

export type IUserMethods = {
    isUserExist(email: string): Promise<Partial<IUser> | null>;

    isPasswordMatched(
        givenPassword: string,
        savedPassword: string,
    ): Promise<boolean>;
};

export type ILoginUserResponse = {
    accessToken?: string;
    refreshToken?: string;
};

export type IRefreshTokenResponse = {
    accessToken: string;
};

export type ILoginUser = {
    email: string;
    password: string;
};

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;
