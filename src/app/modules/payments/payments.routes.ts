import express from 'express';
import { PaymentController } from './payments.controller';
import { ENUM_USER_ROLE } from '../../../shared/enums/users-enum';
import { paymentValidation } from './payments.validation';
import authGuard from '../../../shared/middleware/auth-middleware';
import validateRequest from '../../../shared/middleware/validation-middleware';

const router = express.Router();

/**
 * @route POST /payments/checkout
 * @description Create a PayPal checkout session
 * @access Private (User only)
 */
router.post(
    '/checkout',
    authGuard(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),  
    validateRequest(paymentValidation.checkout),  
    PaymentController.createCheckout,
);

/**
 * @route POST /payments/webhook
 * @description Handle PayPal webhook events
 * @access Public (PayPal signature verification should be added in production)
 */
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    PaymentController.handleWebhook,
);

/**
 * @route GET /payments
 * @description Get all payments
 * @access Private (Admin only)
 */
router.get(
    '/',
    authGuard(ENUM_USER_ROLE.ADMIN),
    PaymentController.getAllPayments,
);

/**
 * @route GET /payments/:id
 * @description Get a payment by ID
 * @access Private (Admin or User)
 */
router.get(
    '/:id',
    authGuard(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
    PaymentController.getPaymentById,
);

export const PaymentRoutes = router;
