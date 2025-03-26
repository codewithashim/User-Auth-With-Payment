import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

/**
 * Creates a Winston logger instance configured for logging error messages.
 *
 * The logger is set to the 'error' level and uses a combination of timestamp
 * and JSON formatting for the log messages. It outputs logs to both the console
 * and a file located at 'logs/error.log'.
 *
 * @constant {winston.Logger} errorLogger - The configured Winston logger instance.
 */

const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log' }),
    ],
});

export { logger, errorLogger };
