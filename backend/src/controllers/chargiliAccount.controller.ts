// controllers/payment-setup.controller.ts
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import  IChargiliAccountService  from '../services/Interfaces/IChargiliAccountService';
import ResponseUtils from '../utils/response.utils';
import { RequestWithUser ,TChargiliAccountCreate} from '../types/types';

@injectable()
export default class ChargiliAccountController {
  constructor(
    @inject('IChargiliAccountService') private chargiliAccountService: IChargiliAccountService,
    @inject('responseUtils') private responseUtils: ResponseUtils
  ) {}

  async setupPayment(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const data: TChargiliAccountCreate = { ...req.body, store_id: req.user.storeId };
      console.log(data);
      const result = await this.chargiliAccountService.setupPayment(data);
      this.responseUtils.sendSuccessNoDataResponse(res, "Payment setup successful", 201);
    } catch (error) {
      next(error);
    }
  }

  async deletePaymentSetup(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      await this.chargiliAccountService.deletePaymentSetup(req.user.storeId);
      this.responseUtils.sendSuccessNoDataResponse(res, "Payment setup deleted successfully", 204);
    } catch (error) {
      next(error);
    }
  }

  async updatePaymentSetup(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
        const data = { ...req.body, store_id: req.user.storeId };
       await this.chargiliAccountService.updatePaymentSetup(data);
      this.responseUtils.sendSuccessNoDataResponse(res, "Payment setup updated successfully");
    } catch (error) {
      next(error);
    }
  }
}