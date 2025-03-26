import mongoose from 'mongoose';
import { logger } from '../utils/logger';

/**
 * Asynchronously connects to the MongoDB database using the provided URL.
 *
 * @param {string} databaseUrl - The URL of the MongoDB database to connect to.
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 *
 * @throws Will log an error message and exit the process with status code 1 if the connection fails.
 *
 * @example
 * ```typescript
 * const databaseUrl = 'mongodb://localhost:27017/mydatabase';
 * connectDB(databaseUrl)
 *   .then(() => {
 *     console.log('Database connection established');
 *   })
 *   .catch((error) => {
 *     console.error('Database connection failed', error);
 *   });
 * ```
 */

export const connectDB = async (databaseUrl: string): Promise<void> => {
    try {
        await mongoose.connect(databaseUrl);
        logger.info('🛢 Database connected successfully');
    } catch (error) {
        logger.error('❌ Failed to connect to the database', error);
        process.exit(1);
    }
};
