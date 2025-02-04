// src/controllers/category.controller.ts
import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import  ICategoryService  from "../services/Interfaces/ICategoryService";
import  ResponseUtils  from "../utils/response.utils";
import { RequestWithUser ,TCategoryCreate} from "../types/types";

@injectable()
export default class CategoryController {
  constructor(
    @inject("ICategoryService") private service: ICategoryService,
    @inject("responseUtils") private responseUtils: ResponseUtils
  ) {}

  
  async create(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const data:TCategoryCreate = {...req.body, store_id: req.user.storeId};
      
      // req.body has been validated by the validation middleware
      const category = await this.service.create(data);
       this.responseUtils.sendSuccessResponse(res, category, 201);
    } catch (error) {
      next(error);
    }
  }

  
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const storeId = req.params.storeId;
      const categories = await this.service.list(storeId);
       this.responseUtils.sendSuccessResponse(res, categories);
    } catch (error) {
      next(error);
    }
  }

  
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const  categoryId  = req.params.id;
      const result = await this.service.delete(categoryId);
       this.responseUtils.sendSuccessNoDataResponse(res, "Category deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
