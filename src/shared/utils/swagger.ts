import { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swagger-config';
import { logger } from './logger';

/**
 * Sets up Swagger documentation for the given Express application.
 *
 * This function configures the Express application to serve Swagger UI at the `/docs` endpoint
 * and the Swagger specification in JSON format at the `/docs.json` endpoint.
 *
 * @param {Application} app - The Express application instance.
 * @param {number} port - The port number on which the application is running.
 *
 * @example
 * const express = require('express');
 * const app = express();
 * const port = 8000;
 * swaggerDocs(app, port);
 *
 * @remarks
 * Ensure that `swaggerUi` and `swaggerSpec` are properly configured and imported before using this function.
 * The `logger` should also be configured to log the information about the documentation URL.
 */

const swaggerDocs = (app: Application, port: string) => {
    // Swagger page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get('/docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    logger.info(`Docs available at http://localhost:${port}/docs`);
};

export default swaggerDocs;
