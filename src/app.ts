import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import httpStatus from 'http-status';
import { configureRoutes } from './shared/config/router-config';
import path from 'path';
import dotenv from 'dotenv';
import globalErrorHandler from './shared/errors/global-error';
import swaggerSpec from './shared/config/swagger-config';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';

const app: Application = express();

/* 
|--------------------------------------------------------------------------
| Middleware Configuration
|--------------------------------------------------------------------------
| 1. CORS: Enables Cross-Origin Resource Sharing for frontend communication.
| 2. JSON Parser: Parses incoming JSON payloads.
| 3. URL Encoded Parser: Parses URL-encoded data with extended support.
*/
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(globalErrorHandler);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rate limiting to prevent brute-force attacks
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // 100 requests per IP
    }),
);

/* 
|--------------------------------------------------------------------------
| Route Configuration
|--------------------------------------------------------------------------
| Registers all application routes using a centralized router configuration.
*/
configureRoutes(app);

/* 
|--------------------------------------------------------------------------
| 404 - Not Found Handler
|--------------------------------------------------------------------------
| Handles requests to unknown routes and returns a standardized response.
*/
app.use((req: Request, res: Response) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'Not Found',
        errorMessages: [
            {
                path: req.originalUrl,
                message: 'API Not Found',
            },
        ],
    });
});

/* 
|--------------------------------------------------------------------------
| Export Application Instance
|--------------------------------------------------------------------------
| Exports the configured Express application for use in the server file.
*/
export default app;
