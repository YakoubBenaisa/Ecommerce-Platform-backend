import { Decimal } from '@prisma/client/runtime/library';

export default interface IPaymentStrategy {
  processPayment(amount: Decimal,secret_key: string): Promise<{
    success: boolean;
   
    gateway_response: any;
  }>;
}