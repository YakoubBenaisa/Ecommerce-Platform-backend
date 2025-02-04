import { injectable, inject } from "tsyringe";
import { TProductCreate, TProductUpdate } from "../types/types";
import IProductService from "./Interfaces/IProductService";
import IProductRepository from "../repositories/interfaces/IProductRepository";
import { 
  ConflictError, 
  NotFoundError, 
  InternalServerError 
} from "../types/errors";
import ImageUtils from "../utils/images.utils";
import { Prisma } from '@prisma/client';
import { handlePrismaError } from "../utils/handlePrismaErrors";


@injectable()
export default class ProductService implements IProductService {
  constructor(
    @inject("IProductRepository") private productRepository: IProductRepository,
    @inject("imageUtils") private imagesHandler: ImageUtils
  ) {}

  async create(data: TProductCreate) {
    try {
      return await this.productRepository.create(data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error, { resource: 'Product' });
      }
      throw new InternalServerError("Failed to create product");
    }
  }

  async update(data: TProductUpdate) {
    try {
     
      
     

      return await this.productRepository.update(data);
    } catch (error) {
    
      // If a Prisma error occurs, use the helper.
      if (error instanceof Prisma.PrismaClientKnownRequestError) 
        handlePrismaError(error, { resource: 'Product' });
      
      throw new InternalServerError("Failed to update product");
    }
  }

  async delete(id: string) {
    try {
     

const product = await this.productRepository.delete(id);
      await this.imagesHandler.deleteImage(product.images);
     
      return product;

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) 
        handlePrismaError(error, { resource: 'Product' });
      
      
      throw new InternalServerError("Failed to delete product");
    }
  }

  async findById(id: string) {
    try {
      return this.productRepository.findById(id);
      
    }catch (error) {
      
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) 
      handlePrismaError(error, { resource: 'Product', id });
    
    throw new InternalServerError("Failed to find product");
  }
  }

  async findByStoreId(store_id: string) {
    try {
      return await this.productRepository.findByStoreId(store_id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error, { resource: 'Product', id: store_id });
      }
      throw new InternalServerError("Failed to retrieve store products");
    }
  }

  async findByCategoryId(category_id: string) {
    try {
      const products = await this.productRepository.findByCategoryId(category_id);
      if (!products || products.length === 0) {
        throw new NotFoundError(` products`);
      }
      return products;
    } catch (error) {
      if (error instanceof NotFoundError) 
        throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError) 
        handlePrismaError(error, { resource: 'Product', id: category_id });
      
      throw new InternalServerError("Failed to retrieve category products");
    }
  }

  async CheckInventory(inventoryData: { id: string; inventory_count: string }[]) {
    try {
      const productIds = inventoryData.map((item) => item.id);
      const products = await this.productRepository.findByIdsToCheckInventory(productIds);

      for (const item of inventoryData) {
        const product = products.find((p) => p.id === item.id);
        if (!product) 
          throw new NotFoundError(`Product`);
        

        const requestedCount = parseInt(item.inventory_count);
        if (product.inventory_count < requestedCount) 
          throw new ConflictError(`Insufficient inventory for product ${product.name}`);
        
      }

      return true;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error, { resource: 'Product' });
      }
      throw new InternalServerError("Failed to check inventory");
    }
  }


}