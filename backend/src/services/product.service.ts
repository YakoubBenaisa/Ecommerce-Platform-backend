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
      
      throw new InternalServerError("Failed to create product");
    }
  }

  async update(data: TProductUpdate) {
    try {
      const product = await this.findById(data.id);
      
     

      return await this.productRepository.update(data);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
     
      throw new InternalServerError("Failed to update product");
    }
  }

  async delete(id: string) {
    try {
      const product = await this.findById(id);


      await this.imagesHandler.deleteImage(product.images);
     
      return await this.productRepository.delete(id);

    } catch (error) {
      if (error instanceof NotFoundError) 
        throw error;
      
      throw new InternalServerError("Failed to delete product");
    }
  }

  async findById(id: string) {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) 
        throw new NotFoundError(`Product`);
      
      return product;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new InternalServerError("Failed to find product");
    }
  }

  async findByStoreId(store_id: string) {
    try {
      return this.productRepository.findByStoreId(store_id);
      
    } catch (error) {
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
      if (error instanceof NotFoundError) {
        throw error;
      }
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
      throw new InternalServerError("Failed to check inventory");
    }
  }

  
}