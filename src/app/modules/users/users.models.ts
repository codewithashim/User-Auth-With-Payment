import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from './users.interface';
import { ENUM_USER_ROLE } from '../../../shared/enums/users-enum';
import { envConfig } from '../../../shared/config/env-config';

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: Object.values(ENUM_USER_ROLE),
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        resetPasswordToken: {
            type: String,
            select: false,
        },
        resetPasswordExpires: {
            type: Date,
            select: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret.password;
                delete ret.resetPasswordToken;
                delete ret.resetPasswordExpires;
                return ret;
            },
        },
    },
);

UserSchema.methods.isUserExist = async function (
    email: string,
): Promise<Partial<IUser> | null> {
    const user = await User.findOne(
        { email },
        {
            _id: 1,
            name: 1,
            email: 1,
            phone: 1,
            role: 1,
            password: 1,
            resetPasswordToken: 1,
            resetPasswordExpires: 1,
        },
    );

    return user;
};

UserSchema.methods.isPasswordMatched = async function (
    givenPassword: string,
    savedPassword: string,
): Promise<boolean> {
    const isPasswordMatched = await bcrypt.compare(
        givenPassword,
        savedPassword,
    );
    return isPasswordMatched;
};

UserSchema.pre('save', async function (next) {
    const user = this;
    user.password = await bcrypt.hash(
        user.password,
        Number(envConfig.jwt.bcryptSaltRound),
    );
    next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
