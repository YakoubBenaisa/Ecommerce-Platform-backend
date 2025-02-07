import { injectable } from 'tsyringe';
import  IPaymentStrategy  from '../Interfaces/IPaymentStrategy';
import { InternalServerError } from '../../types/errors';
import { Decimal } from '@prisma/client/runtime/library';

@injectable()
export default class  CashOnDeliveryPay implements IPaymentStrategy {
  async processPayment(amount: Decimal,api_key: string) {
    try {
    
      return {
        success: true,
      
        gateway_response: {
          provider: 'Cash On Delivery',
          amount: amount,
          currency: 'dzd',
          processed_at: new Date()
        }
      };
    } catch (error) {
      throw new InternalServerError('Failed to process Cash On Delivery payment');
    }
  }
}
