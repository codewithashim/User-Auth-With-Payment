import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

/**
 * Middleware to validate incoming requests against a provided Zod schema.
 *
 * @param schema - The Zod schema to validate the request against. Can be an instance of `AnyZodObject` or `ZodEffects<AnyZodObject>`.
 * @returns An asynchronous function that validates the request and calls the next middleware if validation passes, or passes the error to the next middleware if validation fails.
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { validateRequest } from './validation-middleware';
 *
 * const schema = z.object({
 *   body: z.object({
 *     name: z.string(),
 *     age: z.number().int(),
 *   }),
 *   query: z.object({
 *     search: z.string().optional(),
 *   }),
 *   params: z.object({
 *     id: z.string().uuid(),
 *   }),
 *   cookies: z.object({
 *     session: z.string(),
 *   }),
 * });
 *
 * app.post('/endpoint', validateRequest(schema), (req, res) => {
 *   res.send('Request is valid');
 * });
 * ```
 */

const validateRequest =
    (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                cookies: req.cookies,
            });
            return next();
        } catch (error) {
            next(error);
        }
    };

export default validateRequest;
