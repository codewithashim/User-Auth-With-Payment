import dotenv from 'dotenv';
import path from 'path';
import { envSchema } from '../validation/env-validation';

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

const envFilePath = path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production'
        ? '.env.production'
        : '.env.development',
);

// Load environment variables from the appropriate file
dotenv.config({ path: envFilePath });

// Validate and parse environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error(
        '❌ Invalid environment variables:',
        parsedEnv.error.format(),
    );
    process.exit(1);
}

// Exporting the parsed and validated environment configuration
/**
 * Configuration object for environment variables.
 *
 * @property {string} env - The current environment (e.g., 'development', 'production').
 * @property {number} port - The port number on which the server will run.
 * @property {string} databaseUrl - The URL of the MongoDB database.
 * @property {string} domain - The domain name of the application.
 * @property {Object} jwt - Configuration for JSON Web Tokens (JWT).
 * @property {string} jwt.secret - The secret key for signing JWTs.
 * @property {string} jwt.refreshSecret - The secret key for signing refresh JWTs.
 * @property {string} jwt.expiresIn - The expiration time for JWTs.
 * @property {string} jwt.refreshExpiresIn - The expiration time for refresh JWTs.
 * @property {Object} aws - Configuration for AWS services.
 * @property {string} aws.accessKeyId - The AWS access key ID.
 * @property {string} aws.secretAccessKey - The AWS secret access key.
 * @property {string} aws.region - The AWS region.
 * @property {string} aws.bucketName - The name of the AWS S3 bucket.
 * @property {string[]} allowDomains - List of allowed domains for CORS.
 */


export const envConfig = {
    env: parsedEnv.data.NODE_ENV,
    port: parsedEnv.data.PORT,
    databaseUrl: parsedEnv.data.MONGO_URI,
    domain: parsedEnv.data.DOMAIN,
    jwt: {
        secret: parsedEnv.data.JWT_SECRET,
        refreshSecret: parsedEnv.data.JWT_REFRESH_SECRET,
        expiresIn: parsedEnv.data.JWT_EXPIRATION_TIME,
        refreshExpiresIn: parsedEnv.data.JWT_REFRESH_EXPIRATION_TIME,
        bcryptSaltRound: parsedEnv.data.BCRYPT_SALT_ROUND,
    },
    aws: {
        accessKeyId: parsedEnv.data.AWS_ACCESS_KEY_ID,
        secretAccessKey: parsedEnv.data.AWS_SECRET_ACCESS_KEY,
        region: parsedEnv.data.AWS_REGION,
        bucketName: parsedEnv.data.AWS_BUCKET_NAME,
    },
    email:{
        emailHost: parsedEnv.data.EMAIL_HOST,
        emailPort: parsedEnv.data.EMAIL_PORT,
        emailUser: parsedEnv.data.EMAIL_USER,
        emailPassword: parsedEnv.data.EMAIL_PASSWORD,
        emailFrom: parsedEnv.data.EMAIL_FROM,
        emailSecure: parsedEnv.data.EMAIL_SECURE,
    },
    allowDomains: parsedEnv.data.ALLOW_DOMAINS?.split(',') || [],
};