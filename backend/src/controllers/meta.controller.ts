import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import IMetaService from "../services/Interfaces/IMetaService";
import ResponseUtils from "../utils/response.utils";
import {
  RequestWithUser,
  TMetaIntegrationCreate,
  TMetaIntegrationUpdate,
} from "../types/types";

@injectable()
export default class MetaController {
  constructor(
    @inject("IMetaService") private metaService: IMetaService,
    @inject("responseUtils") private responseUtils: ResponseUtils,
  ) {}

  async create(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const data: TMetaIntegrationCreate = {
        ...req.body,
        store_id: req.user.storeId,
      };
      console.log(data);

      const result = await this.metaService.createMetaIntegration(data);
      this.responseUtils.sendSuccessNoDataResponse(
        res,
        "Meta Integration setup successful",
        201,
      );
    } catch (error: any) {
      next(error);
    }
  }

  async update(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const data: TMetaIntegrationUpdate = {
        ...req.body,
        store_id: req.user.storeId,
      };

      const result = await this.metaService.updateMetaIntegration(data);
      this.responseUtils.sendSuccessNoDataResponse(
        res,
        "Meta Integration updated successful",
      );
    } catch (error: any) {
      next(error);
    }
  }

  async delete(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const storeId = req.user.storeId;

      const result = await this.metaService.deleteMetaIntegration(storeId);
      this.responseUtils.sendSuccessNoDataResponse(
        res,
        "Meta Integration deleted successful",
      );
    } catch (error: any) {
      next(error);
    }
  }
}
