import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import {
    ILoginUser,
    ILoginResponse,
    IRefreshTokenResponse,
    IAuthUser,
    IChangePasswordResponse,
    IForgotPasswordResponse,
} from './auth.interface';
import { v4 as uuidv4 } from 'uuid';
import ApiError from '../../../shared/errors/api-error';
import { envConfig } from '../../../shared/config/env-config';
import { User } from '../users/users.models';
import { jwtHelper } from '../../../shared/helpers/jwt-helper';
import { apiResponseMessage } from '../../../shared/constants/api-response-message';
import { emailService } from '../../../shared/services/email/email.service';

/**
 * Register a new user
 * @param payload - User registration data
 * @returns The newly created user object
 * @throws ApiError if a user with the same email already exists
 */
const registerUser = async (payload: IAuthUser): Promise<IAuthUser> => {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
        throw new ApiError(
            httpStatus.CONFLICT,
            apiResponseMessage.USERS.EMAIL_EXISTS,
        );
    }

    // Create a new user
    const user = await User.create(payload);
    return user;
};

/**
 * Authenticate a user and generate access and refresh tokens
 * @param payload - User login credentials
 * @returns Object containing access token and refresh token
 * @throws ApiError if user is not found or credentials are invalid
 */
const loginUser = async (payload: ILoginUser): Promise<ILoginResponse> => {
    const { email, password } = payload;
    const user = new User();

    // Check if the user exists
    const isUserExist = await user.isUserExist(email);

    // Throw error if user is not found
    if (!isUserExist) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            apiResponseMessage.USERS.NOT_FOUND,
        );
    }

    // Verify password
    if (
        isUserExist.password &&
        !user.isPasswordMatched(password, isUserExist.password)
    ) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            apiResponseMessage.AUTH.INVALID_CREDENTIALS,
        );
    }

    // Prepare token payload
    const tokenPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        name: isUserExist.name,
        role: isUserExist.role,
    };

    // Generate access token
    const accessToken = jwtHelper.createToken(
        tokenPayload,
        envConfig.jwt.secret as Secret,
        '7d',
    );

    // Generate refresh token
    const refreshToken = jwtHelper.createToken(
        tokenPayload,
        envConfig.jwt.refreshSecret as Secret,
        '7d',
    );

    return {
        accessToken,
        refreshToken,
    };
};

/**
 * Refresh the access token using a valid refresh token
 * @param token - The refresh token
 * @returns Object containing the new access token
 * @throws ApiError if the refresh token is invalid or the user is not found
 */
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
    let verifiedToken;

    // Verify the refresh token
    try {
        verifiedToken = jwtHelper.verifyToken(
            token,
            envConfig.jwt.refreshSecret as Secret,
        );
    } catch (error) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            apiResponseMessage.AUTH.REFRESH_TOKEN_INVALID,
        );
    }

    const { email } = verifiedToken;
    const user = new User();

    // Check if the user still exists
    const isUserExist = await user.isUserExist(email);
    if (!isUserExist) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            apiResponseMessage.USERS.NOT_FOUND,
        );
    }

    // Generate new access token
    const newAccessToken = jwtHelper.createToken(
        {
            userId: user._id,
            role: user.role,
            email: user.email,
            name: user.name,
        },
        envConfig.jwt.secret as Secret,
        '7d',
    );

    return { accessToken: newAccessToken };
};

/**
 * Change user password
 * @param userId - User ID
 * @param oldPassword - Current password
 * @param newPassword - New password
 * @returns Object indicating success
 */
const changePassword = async (
    userId: any,
    oldPassword: string,
    newPassword: string,
): Promise<IChangePasswordResponse> => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            apiResponseMessage.USERS.NOT_FOUND,
        );
    }

    const isPasswordValid = await user.isPasswordMatched(
        oldPassword,
        user.password,
    );
    if (!isPasswordValid) {
        throw new ApiError(
            httpStatus.UNAUTHORIZED,
            apiResponseMessage.AUTH.INVALID_OLD_PASSWORD,
        );
    }

    user.password = newPassword;
    await user.save();

    return { success: true };
};

/**
 * Initiate forgot password process
 * @param email - User's email address
 * @returns Object indicating email sent status
 */

const forgotPassword = async (
    email: string,
): Promise<IForgotPasswordResponse> => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            apiResponseMessage.USERS.NOT_FOUND,
        );
    }

    const resetToken = uuidv4();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now
    await user.save();

    const resetUrl = `${envConfig.domain}/reset-password?token=${resetToken}`;

    try {
        await emailService.sendPasswordResetEmail(user.email, resetUrl);
        return { emailSent: true };
    } catch (error) {
        // If email sending fails, revert the changes
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            apiResponseMessage.ERROR.INTERNAL_SERVER_ERROR,
        );
    }
};

/**
 * Reset password using reset token
 * @param token - Reset password token
 * @param newPassword - New password
 * @returns Object indicating success
 */

const resetPassword = async (
    token: string,
    newPassword: string,
): Promise<IChangePasswordResponse> => {
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            apiResponseMessage.AUTH.INVALID_RESET_TOKEN,
        );
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { success: true };
};

export const AuthService = {
    registerUser,
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
};
