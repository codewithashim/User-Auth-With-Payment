import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { apiResponseMessage } from '../../../shared/constants/api-response-message';
import catchAsync from '../../../shared/utils/catch-async';
import sendResponse from '../../../shared/utils/send-response';

/**
 * @desc    Check the health status of the server
 * @route   GET /api/v1/health
 * @access  Public
 */

export const healthCheck = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: apiResponseMessage.HEALTH.SERVER_RUNNING,
        data: {
            status: 'success',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
        },
    });
});
