import { z } from 'zod';
import { ENUM_USER_ROLE } from '../../../shared/enums/users-enum';

const userValidationMessages = {
    email: {
        required: 'Email is required',
        invalid: 'Invalid email format',
    },
    password: {
        required: 'Password is required',
        minLength: 'Password must be at least 6 characters long',
    },
    role: {
        required: 'Role is required',
        invalid: 'Invalid role',
    },
    name: {
        required: 'Name is required',
    },
    phone: {
        required: 'Phone number is required',
        invalid: 'Invalid phone number format',
    },
};

const registerUserSchema = z.object({
    body: z.object({
        email: z.string().email(userValidationMessages.email.invalid),
        password: z.string().min(6, userValidationMessages.password.minLength),
        role: z.nativeEnum(ENUM_USER_ROLE),
        name: z.string(),
        phone: z
            .string()
            .regex(/^\+?[0-9]\d{1,14}$/, userValidationMessages.phone.invalid),
    }),
});

const loginUserSchema = z.object({
    body: z.object({
        email: z.string().email(userValidationMessages.email.invalid),
        password: z.string(),
    }),
});

const refreshTokenSchema = z.object({
    cookies: z.object({
        refreshToken: z.string(),
    }),
});

const changePasswordSchema = z.object({
    body: z.object({
        oldPassword: z.string({
            required_error: 'Old password is required',
        }),
        newPassword: z
            .string({
                required_error: 'New password is required',
            })
            .min(6, 'Password must be at least 6 characters long'),
    }),
});

const forgotPasswordSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: 'Email is required',
            })
            .email('Invalid email format'),
    }),
});

const resetPasswordSchema = z.object({
    body: z.object({
        token: z.string({
            required_error: 'Reset token is required',
        }),
        newPassword: z
            .string({
                required_error: 'New password is required',
            })
            .min(6, 'Password must be at least 6 characters long'),
    }),
});

export const AuthValidation = {
    registerUserSchema,
    loginUserSchema,
    refreshTokenSchema,
    changePasswordSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
};
