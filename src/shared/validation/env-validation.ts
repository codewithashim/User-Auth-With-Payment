import { z } from 'zod';

export const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'staging'])
        .default('development'),
    PORT: z.string().regex(/^\d+$/, 'PORT must be a number').default('9000'),
    MONGO_URI: z.string().url('Invalid MongoDB URI'),
    DOMAIN: z.string().url('Invalid domain URL'),
    JWT_SECRET: z
        .string()
        .min(8, 'JWT_SECRET must be at least 8 characters long'),
    JWT_REFRESH_SECRET: z
        .string()
        .min(8, 'JWT_REFRESH_SECRET must be at least 8 characters long'),
    JWT_EXPIRATION_TIME: z.string().default('30d'),
    JWT_REFRESH_EXPIRATION_TIME: z.string().default('7d'),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_REGION: z.string().optional(),
    AWS_BUCKET_NAME: z.string().optional(),
    ALLOW_DOMAINS: z.string().optional(),
    BCRYPT_SALT_ROUND: z.string().optional(),
    EMAIL_HOST: z.string().optional(),
    EMAIL_PORT: z.string().optional(),
    EMAIL_USER: z.string().optional(),
    EMAIL_PASSWORD: z.string().optional(),
    EMAIL_FROM: z.string().optional(),
    EMAIL_SECURE: z.string().optional(),
});
