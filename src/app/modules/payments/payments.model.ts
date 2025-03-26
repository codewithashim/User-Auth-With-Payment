import { Schema, model } from 'mongoose';
import { IPayment } from './payments.interface';

const paymentSchema = new Schema<IPayment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        amount: { type: Number, required: true },
        currency: { type: String, required: true, default: 'usd' },
        gateway: { type: String, enum: ['stripe', 'paypal'], required: true },
        paymentId: { type: String, required: true, unique: true },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        idempotencyKey: { type: String, required: true, unique: true },
    },
    { timestamps: true },
);

paymentSchema.index({ paymentId: 1, status: 1 });

export const Payment = model<IPayment>('Payment', paymentSchema);
