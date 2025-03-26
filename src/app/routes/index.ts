import express from 'express';
import { UserRoutes } from '../modules/users/users.routes';
import { healthCheck } from '../modules/health/health.controller';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { paymentRoutes } from '../modules/payments/payments.routes';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/health',
        route: healthCheck,
    },
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/payments',
        route: paymentRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
