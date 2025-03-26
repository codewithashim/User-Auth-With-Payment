import { Response } from 'express';

type IApiResponse<T> = {
    statusCode: number;
    success: boolean;
    message?: string | null;
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
    data?: T | null;
};

/**
 * Sends a standardized API response.
 *
 * @template T - The type of the data being sent in the response.
 * @param {Response} res - The Express response object.
 * @param {IApiResponse<T>} data - The response data to be sent.
 * @param {number} data.statusCode - The HTTP status code of the response.
 * @param {boolean} data.success - Indicates whether the request was successful.
 * @param {string} [data.message] - An optional message providing additional information about the response.
 * @param {object} [data.meta] - Optional metadata related to the response.
 * @param {T} [data.data] - The actual data being sent in the response.
 * @returns {void}
 */

const sendResponse = <T>(res: Response, data: IApiResponse<T>): void => {
    const responseData: IApiResponse<T> = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message || null,
        meta: data.meta || null || undefined,
        data: data.data || null,
    };

    res.status(data.statusCode).json(responseData);
};

export default sendResponse;
