import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { apiResponseMessage } from '../../../shared/constants/api-response-message';
import { IPayment } from './payments.interface';
import catchAsync from '../../../shared/utils/catch-async';
import sendResponse from '../../../shared/utils/send-response';
import { PaymentService } from './payments.service';

/**
 * Creates a PayPal checkout session
 * @route POST /payments/checkout
 * @access Private (JWT required)
 */
const createCheckout = catchAsync(async (req: Request, res: Response) => {
    const { amount, currency } = req.body;
    const userId = req.user!.userId;
    const result = await PaymentService.createCheckoutSession(
        userId,
        amount,
        currency,
    );
    sendResponse<{ url: string; payment: IPayment }>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: apiResponseMessage.PAYMENTS.CHECKOUT_SUCCESS,
        data: result,
    });
});

/**
 * Handles PayPal webhook events
 * @route POST /payments/webhook
 * @access Public (PayPal signature verification required)
 */
const handleWebhook = catchAsync(async (req: Request, res: Response) => {
    const { event_type, resource } = req.body;

    const result = await PaymentService.updatePaymentStatus(
        resource.id,
        event_type,
    );

    sendResponse<IPayment>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: apiResponseMessage.PAYMENTS.WEBHOOK_PROCESSED,
        data: result,
    });
});

/**
 * Fetches a payment by ID
 * @route GET /payments/:id
 * @access Private (JWT required)
 */
const getPaymentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PaymentService.getPaymentById(id);

    sendResponse<IPayment>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: apiResponseMessage.PAYMENTS.FETCH_SINGLE_SUCCESS,
        data: result,
    });
});

/**
 * Fetches all payments (e.g., for admin or user-specific filtering)
 * @route GET /payments
 * @access Private (JWT required)
 */
const getAllPayments = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.getAllPayments(req.query, req.user!.id);

    sendResponse<IPayment[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: apiResponseMessage.PAYMENTS.FETCH_SUCCESS,
        meta: result.meta,
        data: result.data,
    });
});

export const PaymentController = {
    createCheckout,
    handleWebhook,
    getPaymentById,
    getAllPayments,
};
