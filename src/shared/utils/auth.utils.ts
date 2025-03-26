import { Response } from 'express';
import { envConfig } from '../config/env-config';

export const configureAuthCookie = (
    res: Response,
    name: string,
    value: string,
): void => {
    res.cookie(name, value, {
        secure: envConfig.env === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};
