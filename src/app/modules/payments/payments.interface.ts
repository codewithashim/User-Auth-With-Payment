/**
 * Represents a payment record in the database
 */
export interface IPayment {
    _id?: string;
    userId: any;
    amount: number;
    currency: string;
    gateway: 'stripe' | 'paypal';
    paymentId: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    idempotencyKey: string;
    createdAt?: Date;
    updatedAt?: Date;
}
