import { v4 as uuidv4 } from 'uuid';
import { IPayment } from '../../app/modules/payments/payments.interface';

/**
 * Generates a unique idempotency key for payment transactions
 * @returns UUID string
 */
export const generateIdempotencyKey = (): string => {
  return uuidv4();
};

/**
 * Maps payment gateway status to internal status
 * @param gatewayStatus Status from Stripe or PayPal
 * @param gateway Gateway type
 * @returns Internal payment status
 */
export const mapPaymentStatus = (
  gatewayStatus: string,
  gateway: 'stripe' | 'paypal'
): IPayment['status'] => {
  if (gateway === 'stripe') {
    return gatewayStatus === 'paid' ? 'completed' : 'failed';
  } else if (gateway === 'paypal') {
    return gatewayStatus === 'COMPLETED' ? 'completed' : 'failed';
  }
  return 'pending';
};