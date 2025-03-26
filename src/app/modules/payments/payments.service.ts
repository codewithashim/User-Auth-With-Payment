import httpStatus from 'http-status';
import { apiResponseMessage } from '../../../shared/constants/api-response-message';
import { SortOrder } from 'mongoose';
import { IPayment } from './payments.interface';
import paginationPick from '../../../shared/utils/pagination-pick';
import { paginationFields } from '../../../shared/constants/common-constants';
import { paginationHelpers } from '../../../shared/helpers/pagination-helper';
import { Payment } from './payments.model';
import ApiError from '../../../shared/errors/api-error';
import { core, orders } from '@paypal/checkout-server-sdk';
import { envConfig } from '../../../shared/config/env-config';
import {
    generateIdempotencyKey,
    mapPaymentStatus,
} from '../../../shared/utils/payment.utils';
import { logger } from '../../../shared/utils/logger';

// PayPal environment configuration
const paypalEnv =
    envConfig.payment.paypal.paypalEnv === 'live'
        ? new core.LiveEnvironment(
              envConfig.payment.paypal.paypalClientId as string,
              envConfig.payment.paypal.paypalClientSecret as string,
          )
        : new core.SandboxEnvironment(
              envConfig.payment.paypal.paypalClientId as string,
              envConfig.payment.paypal.paypalClientSecret as string,
          );

// PayPal HTTP client
const paypalClient = new core.PayPalHttpClient(paypalEnv);

/**
 * Creates a PayPal checkout session
 * @param userId User initiating the payment
 * @param amount Amount in cents
 * @param currency Currency code (default: 'usd')
 * @returns Checkout URL and payment record
 * @throws ApiError if session creation fails
 */
const createCheckoutSession = async (
    userId: string,
    amount: number,
    currency: string = 'usd',
): Promise<{ url: string; payment: IPayment }> => {
    const idempotencyKey = generateIdempotencyKey();

    try {
        // Configure PayPal order request
        const request = new orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: currency,
                        value: (amount / 100).toFixed(2), // Convert cents to dollars
                    },
                },
            ],
            application_context: {
                return_url: `${envConfig.domain}/success`,
                cancel_url: `${envConfig.domain}/cancel`,
                user_action: 'PAY_NOW',
            },
        });

        // Execute PayPal request
        const response = await paypalClient.execute(request);
        const order = response.result;
        const approvalLink = order.links.find(
            (link: any) => link.rel === 'approve',
        )?.href;

        // Validate approval link
        if (!approvalLink) {
            throw new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'PayPal approval link not found',
            );
        }

        // Create payment record
        const payment = await Payment.create({
            userId,
            amount,
            currency,
            gateway: 'paypal',
            paymentId: order.id,
            status: 'pending',
            idempotencyKey,
        });

        logger.info('Checkout session created successfully', {
            paymentId: payment._id,
            userId,
        });
        return { url: approvalLink, payment };
    } catch (error) {
        logger.error('Failed to create checkout session', error);
        throw error instanceof ApiError
            ? error
            : new ApiError(
                  httpStatus.INTERNAL_SERVER_ERROR,
                  'Payment initiation failed',
              );
    }
};

/**
 * Updates payment status based on PayPal webhook event
 * @param paymentId PayPal Order ID
 * @param eventType PayPal webhook event type
 * @returns Updated payment record
 * @throws ApiError if payment not found or update fails
 */

const updatePaymentStatus = async (
    paymentId: string,
    eventType: string,
): Promise<IPayment | null> => {
    try {
        const payment = await Payment.findOne({ paymentId });
        if (!payment) {
            logger.error('Payment not found for status update', {
                paymentId,
            });
            throw new ApiError(
                httpStatus.NOT_FOUND,
                apiResponseMessage.PAYMENTS.NOT_FOUND,
            );
        }

        if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
            const request = new orders.OrdersGetRequest(paymentId);
            const response = await paypalClient.execute(request);
            const order = response.result;

            payment.status = mapPaymentStatus(order.status, 'paypal');
            await payment.save();

            logger.info('Payment status updated', {
                paymentId,
                status: payment.status,
            });
        }
        return payment;
    } catch (error) {
        logger.error('Failed to update payment status', error);
        throw error instanceof ApiError
            ? error
            : new ApiError(
                  httpStatus.INTERNAL_SERVER_ERROR,
                  'Payment status update failed',
              );
    }
};

/**
 * Retrieves a payment by ID
 * @param id MongoDB payment ID
 * @returns Payment record
 * @throws ApiError if payment not found
 */

const getPaymentById = async (id: string): Promise<IPayment | null> => {
    try {
        const payment = await Payment.findById(id);
        if (!payment) {
            throw new ApiError(
                httpStatus.NOT_FOUND,
                apiResponseMessage.PAYMENTS.NOT_FOUND,
            );
        }
        return payment;
    } catch (error) {
        logger.error('Failed to fetch payment by ID', error);
        throw error instanceof ApiError
            ? error
            : new ApiError(
                  httpStatus.NOT_FOUND,
                  apiResponseMessage.PAYMENTS.NOT_FOUND,
              );
    }
};

/**
 * Retrieves all payments with filtering and pagination
 * @param requestQuery Query parameters for filtering and pagination
 * @param userId User ID for filtering (optional, e.g., for non-admin users)
 * @returns Paginated payment records
 */

const getAllPayments = async (
    requestQuery: Record<string, unknown>,
    userId?: string,
): Promise<{ meta: any; data: IPayment[] }> => {
    try {
        const filters = paginationPick(requestQuery, [
            'searchTerm',
            'status',
            'gateway',
        ]);
        const paginationOptions = paginationPick(
            requestQuery,
            paginationFields,
        );

        const { searchTerm, ...filtersData } = filters;
        const { page, limit, skip, sortBy, sortOrder } =
            paginationHelpers.calculatePagination(paginationOptions);

        const andConditions = [];

        // Add userId filter if provided (e.g., for non-admin users)
        if (userId) {
            andConditions.push({ userId });
        }

        // Search across fields (e.g., paymentId)
        if (searchTerm) {
            andConditions.push({
                $or: ['paymentId'].map((field) => ({
                    [field]: {
                        $regex: searchTerm,
                        $options: 'i',
                    },
                })),
            });
        }

        // Additional filters (status, gateway)
        if (Object.keys(filtersData).length) {
            andConditions.push({
                $and: Object.entries(filtersData).map(([field, value]) => ({
                    [field]: value,
                })),
            });
        }

        const sortConditions: { [key: string]: SortOrder } = {};
        if (sortBy && sortOrder) {
            sortConditions[sortBy] = sortOrder;
        }

        const whereConditions =
            andConditions.length > 0 ? { $and: andConditions } : {};

        const result = await Payment.find(whereConditions)
            .sort(sortConditions)
            .skip(skip)
            .limit(limit);

        const total = await Payment.countDocuments(whereConditions);

        logger.info('Payments fetched successfully', { userId, total });
        return {
            meta: {
                page,
                limit,
                total,
            },
            data: result,
        };
    } catch (error) {
        logger.error('Failed to fetch all payments', error);
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to fetch payments',
        );
    }
};

export const PaymentService = {
    updatePaymentStatus,
    createCheckoutSession,
    getPaymentById,
    getAllPayments,
};
