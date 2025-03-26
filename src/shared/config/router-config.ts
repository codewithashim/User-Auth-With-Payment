import { Application } from 'express';
import routes from '../../app/routes';

/**
 * Configures the application routes.
 *
 * This function sets up the base route for the API and attaches the defined routes to it.
 *
 * @param app - The Express application instance.
 */

export const configureRoutes = (app: Application): void => {
    app.use('/api/v1', routes);
};
