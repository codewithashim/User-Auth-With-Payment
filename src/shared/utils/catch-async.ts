import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * A higher-order function that wraps an asynchronous request handler function
 * and catches any errors that occur during its execution, passing them to the
 * next middleware in the chain.
 *
 * @param fn - The asynchronous request handler function to be wrapped.
 * @returns A new request handler function that executes the provided function
 *          and catches any errors, passing them to the next middleware.
 *
 * @example
 * ```typescript
 * const myAsyncHandler = catchAsync(async (req, res, next) => {
 *     const data = await someAsyncOperation();
 *     res.json(data);
 * });
 * ```
 */


const catchAsync =
    (fn: RequestHandler) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };

export default catchAsync;
