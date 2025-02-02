import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import IProductService from "../services/Interfaces/IProductService";
import { TProductCreate, TProductUpdate, RequestWithUser } from "../types/types";
import ResponseUtils from "../utils/response.utils";
import {z} from "zod"
import { createProductSchema } from "../validations/product.validation";


@injectable()
export default class ProductController {
    constructor(
        @inject("IProductService") private productService: IProductService,
        @inject("responseUtils") private responseUtils: ResponseUtils
    ) {}

    async create(req: RequestWithUser, res: Response, next: NextFunction): Promise<any> {
        try {
             
            
            req.body = createProductSchema.parse(req.body);

            const productData: TProductCreate = { ...req.body, store_id: req.user.storeId };
           
            
            const newProduct = await this.productService.create(productData);
            return this.responseUtils.sendSuccessResponse(res, newProduct, 201);
        } catch (error: any) {
          
            next(error);
        }
    }

    async update(req: RequestWithUser, res: Response, next: NextFunction): Promise<any>{
        try {
            const productData: TProductUpdate = { ...req.body, id: req.params.id, store_id: req.user.storeId };
            console.log(productData);
            const updatedProduct = await this.productService.update(productData);
            return this.responseUtils.sendSuccessResponse(res, updatedProduct);
        } catch (error: any) {
          
             next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<any>{
        try {
            const productId = req.params.id;
            console.log(productId);
            await this.productService.delete(productId);
            return this.responseUtils.sendSuccessNoDataResponse(res, "Product deleted successfully");
        } catch (error: any) {
          
             next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<any>{
        try {
            const productId = req.params.id;
            const product = await this.productService.findById(productId);
            return this.responseUtils.sendSuccessResponse(res, product);
        } catch (error: any) {
          
             next(error);
        }
    }

    async getByStoreId(req: Request, res: Response, next: NextFunction): Promise<any>{
        try {
            const storeId = req.params.storeId;
            const products = await this.productService.findByStoreId(storeId);
            return this.responseUtils.sendSuccessResponse(res, products);
        } catch (error: any) {
             next(error);
        }
    }

    

   
} 