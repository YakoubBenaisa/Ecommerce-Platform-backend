import { injectable, inject } from "tsyringe";
import { TProductCreate, TProductUpdate } from "../types/types";
import IProductService from "./Interfaces/IProductService";
import IProductRepository from "../repositories/interfaces/IProductRepository";
import {
  ConflictError,
  NotFoundError,
  InternalServerError,
} from "../types/errors";
import ImageUtils from "../utils/images.utils";
import { Prisma } from "@prisma/client";
import { handlePrismaError } from "../utils/handlePrismaErrors";
import ProductsCacheRepository from "../repositories/product.cache";

@injectable()
export default class ProductService implements IProductService {
  constructor(
    @inject("IProductRepository") private productRepository: IProductRepository,
    @inject("imageUtils") private imagesHandler: ImageUtils,
    @inject("ProductsCacheRepository")
    private productsCacheRepository: ProductsCacheRepository
  ) {}

  async create(data: TProductCreate) {
    try {
      const product = await this.productRepository.create(data);
      // Invalidate the products cache for this store

      // @ts-ignore
      await this.productsCacheRepository.invalidateProductsCache(data.store_id);
      return product;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error, { resource: "Product" });
      }
      throw new InternalServerError("Failed to create product");
    }
  }

  async update(data: TProductUpdate) {
    try {
      const product = await this.productRepository.update(data);
      // Invalidate cache if the product belongs to a store
      if (product.store_id) {
        await this.productsCacheRepository.invalidateProductsCache(
          product.store_id
        );
      }
      return product;
    } catch (error) {
      // If a Prisma error occurs, use the helper.
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "Product" });

      throw new InternalServerError("Failed to update product");
    }
  }

  async delete(id: string) {
    try {
      const product = await this.productRepository.delete(id);
      await this.imagesHandler.deleteImage(product.images);
      // Invalidate the cache for the store that held this product
      await this.productsCacheRepository.invalidateProductsCache(
        product.store_id
      );
      return product;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "Product" });

      throw new InternalServerError("Failed to delete product");
    }
  }

  async findById(id: string) {
    try {
      return this.productRepository.findById(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "Product", id });

      throw new InternalServerError("Failed to find product");
    }
  }

  async findByStoreId(store_id: string) {
    try {
      return await this.productsCacheRepository.getProductsByStoreId(store_id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error, { resource: "Product", id: store_id });
      }
      throw new InternalServerError("Failed to retrieve store products");
    }
  }

  async findByCategoryId(category_id: string) {
    try {
      const products = await this.productRepository.findByCategoryId(
        category_id
      );
      if (!products || products.length === 0) {
        throw new NotFoundError(` products`);
      }
      return products;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "Product", id: category_id });

      throw new InternalServerError("Failed to retrieve category products");
    }
  }

  async findByIds(productIds: string[]) {
    try {
      const products = await this.productRepository.findByIds(productIds);

      // Check if all requested products were found
      if (products.length !== productIds.length) {
        // Determine which IDs are missing
        const foundIds = products.map((product: any) => product.id);
        const missingIds = productIds.filter((id) => !foundIds.includes(id));
        throw new NotFoundError(
          `Products with IDs ${missingIds.join(", ")} not found`
        );
      }

      return products;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error, { resource: "Product" });
      }

      throw new InternalServerError("Failed to find product");
    }
  }

  async CheckInventory(inventoryData: { id: string; quantity: number }[]) {
    try {
      console.log("inventoryData", inventoryData);
      const productIds = inventoryData.map((item) => item.id);
      // Use the findByIds method to ensure all products exist and retrieve their details.
      const products = await this.findByIds(productIds);

      for (const item of inventoryData) {
        // Since findByIds already ensures each product exists,
        // this check is technically redundant, but is kept for clarity.
        const product = products.find((p) => p.id === item.id);
        if (!product) {
          throw new NotFoundError(`Product with id ${item.id} not found`);
        }

        const requestedCount = item.quantity;
        console.log("product.quantity", product.inventory_count);
        console.log("requestedCount", requestedCount);
        console.log(
          "product.quantity < requestedCount",
          product.inventory_count < requestedCount
        );
        if (product.inventory_count < requestedCount) {
          throw new ConflictError(
            `Insufficient inventory for product ${product.name}`
          );
        }
      }

      return products;
    } catch (error) {
      console.log("STOOOCK", error);
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error, { resource: "Product" });
      }
      throw new InternalServerError("Failed to check inventory");
    }
  }

  async updateInventory(
    items: {
      product_id: string;
      quantity: number;
      updateType: "increase" | "decrease";
    }[]
  ) {
    try {
      for (const item of items) {
        await this.productRepository.updateInventory(
          item.product_id,
          item.quantity,
          item.updateType
        );
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error, { resource: "Product" });
      }
      throw new InternalServerError("Failed to update inventory");
    }
  }
}
