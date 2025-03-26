import express from 'express';
import validateRequest from '../../../shared/middleware/validation-middleware';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
    '/register',
    validateRequest(AuthValidation.registerUserSchema),
    AuthController.registerUser,
);

router.post(
    '/login',
    validateRequest(AuthValidation.loginUserSchema),
    AuthController.loginUser,
);

router.post(
    '/refresh-token',
    validateRequest(AuthValidation.refreshTokenSchema),
    AuthController.refreshToken,
);

router.post(
    '/change-password',
    validateRequest(AuthValidation.changePasswordSchema),
    AuthController.changePassword,
);

router.post(
    '/forgot-password',
    validateRequest(AuthValidation.forgotPasswordSchema),
    AuthController.forgotPassword,
);

router.post(
    '/reset-password',
    validateRequest(AuthValidation.resetPasswordSchema),
    AuthController.resetPassword,
);

export const AuthRoutes = router;
