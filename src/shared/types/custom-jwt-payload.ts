import { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { ENUM_USER_ROLE } from '../enums/users-enum';

export interface CustomJwtPayload extends JwtPayload {
    userId: string | ObjectId;
    email: string;
    role: ENUM_USER_ROLE;
    iat?: number;
    exp?: number;
}
