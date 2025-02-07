import { injectable, container } from 'tsyringe';
import { PaymentMethod } from '@prisma/client';
import IPaymentStrategy from '../Interfaces/IPaymentStrategy';
import { BadRequestError } from '../../types/errors';

@injectable()
export default class PaymentProcessorFactory {
  getProcessor(method: PaymentMethod): IPaymentStrategy {
    switch (method) {
      case 'baridi_mob':
        return container.resolve('ChargiliPay');
      case 'cash_on_delivery':
        return container.resolve('CashOnDeliveryPay');
      default:
        throw new BadRequestError(`Unsupported payment method: ${method}`);
    }
  }
}