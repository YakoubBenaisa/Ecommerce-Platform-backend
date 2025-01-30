import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import IStoreService from "../services/Interfaces/IStoreService";
import { TStoreCreate, TStoreUpdate, RequestWithUser } from "../types/types";
import ResponseUtils from "../utils/response.utils";

@injectable()
export default class StoreController {
    constructor(
        @inject("IStoreService") private storeService: IStoreService,
        @inject("responseUtils") private responseUtils: ResponseUtils
    ) {}

    async createStore(req: RequestWithUser, res: Response) {
        try {
            const storeData: TStoreCreate = {...req.body, owner_id: req.user.userId};
            
            
            const newStore = await this.storeService.createStore(storeData);
            return this.responseUtils.sendSuccessResponse(res, newStore, 201);
        } catch (error:any) {
            return this.responseUtils.sendErrorResponse(res, error.message, 500);
        }
    }

    async updateStore(req: Request, res: Response) {
        try {
            
const storeData: TStoreUpdate = { ...req.body, id: req.params.id };

            const updatedStore = await this.storeService.updateStore( storeData);
            if (!updatedStore) {
                return this.responseUtils.sendNotFoundResponse(res, "Store not found");
            }
            return this.responseUtils.sendSuccessResponse(res, updatedStore);
        } catch (error:any) {
            return this.responseUtils.sendErrorResponse(res, error.message, 500);
        }
    }

    async getStoreById(req: Request, res: Response) {
        try {
            const storeId = req.params.id;
            const store = await this.storeService.getStoreById(storeId);
            if (!store) {
                return this.responseUtils.sendNotFoundResponse(res, "Store not found");
            }
            return this.responseUtils.sendSuccessResponse(res, store);
        } catch (error:any) {
            return this.responseUtils.sendErrorResponse(res, error.message, 500);
        }
    }
} 