import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { IGenericErrorMessage } from '../types/error-type';
import handleValidationError from './validation-error';
import handleZodError from './zod-error';
import handleCastError from './cast-error';
import ApiError from './api-error';
import { envConfig } from '../config/env-config';
import { logger, errorLogger } from '../utils/logger'; // Adjust the import path accordingly

// Utility to create structured error responses
const createErrorResponse = (
    statusCode: number,
    message: string,
    errorMessages: IGenericErrorMessage[],
    error?: Error,
) => ({
    success: false,
    message,
    errorMessages,
    stack: envConfig.env !== 'production' && error ? error.stack : undefined,
});

// Utility to log errors with context (request and error details)
const logError = (error: any, req: Request) => {
    const logPayload = {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: req.body,
        query: req.query,
        params: req.params,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
    };

    if (envConfig.env === 'development') {
        logger.info('🐱‍🏍 globalErrorHandler (Development) ~~', logPayload);
    } else {
        errorLogger.error(
            '🐱‍🏍 globalErrorHandler (Production) ~~',
            logPayload,
        );
    }
};

const globalErrorHandler: ErrorRequestHandler = async (
    error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const isDev = envConfig.env === 'development';

    // Log the error with detailed context
    logError(error, req);

    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorMessages: IGenericErrorMessage[] = [];

    // Handle specific error types
    try {
        if (error?.name === 'ValidationError') {
            const simplifiedError = handleValidationError(error);
            statusCode = simplifiedError.statusCode;
            message = simplifiedError.message;
            errorMessages = simplifiedError.errorMessages;
        } else if (error instanceof ZodError) {
            const simplifiedError = handleZodError(error);
            statusCode = simplifiedError.statusCode;
            message = simplifiedError.message;
            errorMessages = simplifiedError.errorMessages;
        } else if (error?.name === 'CastError') {
            const simplifiedError = handleCastError(error);
            statusCode = simplifiedError.statusCode;
            message = simplifiedError.message;
            errorMessages = simplifiedError.errorMessages;
        } else if (error instanceof ApiError) {
            statusCode = error?.statusCode || 500;
            message = error.message;
            errorMessages = error?.message
                ? [{ path: '', message: error.message }]
                : [];
        } else if (error instanceof Error) {
            message = error.message;
            errorMessages = error?.message
                ? [{ path: '', message: error.message }]
                : [];
        }
    } catch (e) {
        // Catch unexpected errors during error handling and send a generic response
        statusCode = 500;
        message = 'An unexpected error occurred while processing your request!';
        errorMessages = [{ path: '', message: message }];
        logError(e, req); // Log this unexpected error
    }

    // Send the structured error response
    res.status(statusCode).json(
        createErrorResponse(statusCode, message, errorMessages, error),
    );
};

export default globalErrorHandler;
