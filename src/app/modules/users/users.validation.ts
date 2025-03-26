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

const updateUserZodSchema = z.object({
    body: z
        .object({
            name: z.string().optional(),
            email: z
                .string()
                .email(userValidationMessages.email.invalid)
                .optional(),
            role: z
                .enum(Object.values(ENUM_USER_ROLE) as [string, ...string[]], {
                    invalid_type_error: userValidationMessages.role.invalid,
                })
                .optional(),
            password: z
                .string()
                .min(6, userValidationMessages.password.minLength)
                .optional(),
            phone: z
                .string()
                .regex(
                    /^\+?[0-9]\d{1,14}$/,
                    userValidationMessages.phone.invalid,
                )
                .optional(),
        })
        .optional(),
});

export const userValidation = {
    updateUserZodSchema,
};
