import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/utils/catch-async';
import { AuthService } from './auth.service';
import sendResponse from '../../../shared/utils/send-response';
import {
    IAuthUser,
    IChangePasswordResponse,
    IForgotPasswordResponse,
    ILoginResponse,
    IRefreshTokenResponse,
} from './auth.interface';
import { configureAuthCookie } from '../../../shared/utils/auth.utils';
import { apiResponseMessage } from '../../../shared/constants/api-response-message';

/**
 * Controller function to handle user registration
 *
 * @param req - Express request object containing user registration data in the body
 * @param res - Express response object
 *
 * @description
 * This function:
 * 1. Extracts user data from the request body
 * 2. Calls the AuthService to register the user
 * 3. Sends a response with the newly created user data
 */
const registerUser = catchAsync(async (req: Request, res: Response) => {
    const userData = req.body;
    const result = await AuthService.registerUser(userData);

    sendResponse<IAuthUser>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: apiResponseMessage.AUTH.REGISTER_SUCCESS,
        data: result,
    });
});

/**
 * Controller function to handle user login
 *
 * @param req - Express request object containing login credentials in the body
 * @param res - Express response object
 *
 * @description
 * This function:
 * 1. Extracts login data from the request body
 * 2. Calls the AuthService to authenticate the user
 * 3. Sets a refresh token cookie if provided
 * 4. Sends a response with the access token and user data
 */
const loginUser = catchAsync(async (req: Request, res: Response) => {
    const loginData = req.body;

    const result = await AuthService.loginUser(loginData);
    const { refreshToken, ...tokenData } = result;

    // Set refresh token as an HTTP-only cookie if available
    if (refreshToken) {
        configureAuthCookie(res, 'refreshToken', refreshToken);
    }

    sendResponse<ILoginResponse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: apiResponseMessage.AUTH.LOGIN_SUCCESS,
        data: tokenData,
    });
});

/**
 * Controller function to handle token refresh
 *
 * @param req - Express request object containing the refresh token in cookies
 * @param res - Express response object
 *
 * @description
 * This function:
 * 1. Extracts the refresh token from the request cookies
 * 2. Calls the AuthService to generate a new access token
 * 3. Sets the new refresh token as a cookie
 * 4. Sends a response with the new access token
 */
const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result = await AuthService.refreshToken(refreshToken);

    // Set the new refresh token as an HTTP-only cookie
    configureAuthCookie(res, 'refreshToken', refreshToken);

    sendResponse<IRefreshTokenResponse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: apiResponseMessage.AUTH.REFRESH_TOKEN_SUCCESS,
        data: result,
    });
});

/**
 * Change user password
 * @param req - Express request object
 * @param res - Express response object
 */
const changePassword = catchAsync(async (req: Request, res: Response) => {
    const userId = req?.user?.userId;
    const { oldPassword, newPassword } = req.body;

    const result = await AuthService.changePassword(
        userId,
        oldPassword,
        newPassword,
    );

    sendResponse<IChangePasswordResponse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: apiResponseMessage.AUTH.PASSWORD_CHANGE_SUCCESS,
        data: result,
    });
});

/**
 * Initiate forgot password process
 * @param req - Express request object
 * @param res - Express response object
 */
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;

    const result = await AuthService.forgotPassword(email);

    sendResponse<IForgotPasswordResponse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: apiResponseMessage.AUTH.FORGOT_PASSWORD_EMAIL_SENT,
        data: result,
    });
});

/**
 * Reset password using reset token
 * @param req - Express request object
 * @param res - Express response object
 */
const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    const result = await AuthService.resetPassword(token, newPassword);

    sendResponse<IChangePasswordResponse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: apiResponseMessage.AUTH.PASSWORD_RESET_SUCCESS,
        data: result,
    });
});

export const AuthController = {
    registerUser,
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
