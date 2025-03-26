import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

/**
 * Generates a JSON Web Token (JWT) using the provided payload, secret, and expiration time.
 *
 * @param payload - The data to be encoded in the token. It should be an object with string keys and values of any type.
 * @param secret - The secret key used to sign the token. It should be a string or a buffer.
 * @param expireTime - The expiration time for the token. It can be a string or number representing the time span.
 * @returns The generated JWT as a string.
 */

const createToken = (
    payload: Record<string, unknown>,
    secret: Secret,
    expireTime: SignOptions['expiresIn'],
): string => {
    const options: SignOptions = {
        expiresIn: expireTime,
    };

    return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
    return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelper = {
    createToken,
    verifyToken,
};