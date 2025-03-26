import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import ApiError from '../errors/api-error';
import { apiResponseMessage } from '../constants/api-response-message';
import { CustomJwtPayload } from '../types/custom-jwt-payload';
import { jwtHelper } from '../helpers/jwt-helper';
import { envConfig } from '../config/env-config';

/**
 * Middleware to handle authentication and role-based authorization.
 *
 * @param {...string} requiredRoles - The roles that are allowed to access the route.
 * @returns {Function} Middleware function to handle authentication and authorization.
 *
 * @throws {ApiError} If no authorization token is provided.
 * @throws {ApiError} If the token is invalid or expired.
 * @throws {ApiError} If the user does not have the required role.
 *
 * @example
 * router.get('/admin', authMiddleware(ENUM_USER_ROLE.ADMIN), adminController.dashboard);
 */

const authGuard =
    (...requiredRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Get authorization token
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                throw new ApiError(
                    httpStatus.UNAUTHORIZED,
                    apiResponseMessage.AUTH.TOKEN_MISSING,
                );
            }

            // Verify token
            let verifiedUser: CustomJwtPayload;

            try {
                verifiedUser = jwtHelper.verifyToken(
                    token,
                    envConfig.jwt.secret as Secret,
                ) as CustomJwtPayload;
            } catch (error) {
                throw new ApiError(
                    httpStatus.UNAUTHORIZED,
                    apiResponseMessage.AUTH.TOKEN_INVALID,
                );
            }

            // Attach user to request
            req.user = verifiedUser;

            // Check role-based authorization
            if (
                requiredRoles.length &&
                !requiredRoles.includes(verifiedUser.role)
            ) {
                throw new ApiError(
                    httpStatus.FORBIDDEN,
                    apiResponseMessage.AUTH.ACCESS_DENIED,
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };



export default authGuard;
