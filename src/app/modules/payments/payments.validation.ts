import { z } from 'zod';

export const paymentValidation = {
  checkout: z.object({
    body: z.object({
      amount: z.number().min(100, 'Amount must be at least 100 cents'),
      currency: z.string().default('usd')
    })
  })
};