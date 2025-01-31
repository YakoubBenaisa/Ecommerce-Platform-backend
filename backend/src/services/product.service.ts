import { injectable, inject } from "tsyringe";
import { TProductCreate, TProductUpdate } from "../types/types";
import IProductService from "./Interfaces/IProductService";
import IProductRepository from "../repositories/interfaces/IProductRepository";

@injectable()
export default class ProductService implements IProductService {
  constructor(
    @inject("IProductRepository") private productRepository: IProductRepository
  ) {console.log("Productser")}

  async create(data: TProductCreate) {
    try {
      const product = await this.productRepository.create(data);
      console.log(product);
      return product;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create product. Please try again.");
    }
  }

  async update(data: TProductUpdate) {
    try {
      const product = await this.productRepository.findById(data.id);
      if (!product) throw new Error(`Product with ID ${data.id} not found.`);

      return await this.productRepository.update(data);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to update product. Please try again.");
    }
  }

  async delete(id: string) {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) throw new Error(`Product with ID ${id} not found.`);

      return await this.productRepository.delete(id);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to delete product. Please try again.");
    }
  }

  async findById(id: string) {
    try {
      const product = await this.productRepository.findById(id);
      if (!product) throw new Error(`Product with ID ${id} not found.`);

      return product;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to find product. Please try again.");
    }
  }

  async findByStoreId(store_id: string) {
    try {
      const products = await this.productRepository.findByStoreId(store_id);
      if (!products || products.length === 0)
        return null;

      return products;
    } catch (error) {
      console.log(error);
      throw new Error(
        "Failed to find products for this store. Please try again."
      );
    }
  }

  async findByCategoryId(category_id: string) {
    try {
      const products = await this.productRepository.findByCategoryId(
        category_id
      );
      if (!products || products.length === 0)
        throw new Error(`No products found for category ID ${category_id}.`);

      return products;
    } catch (error) {
      throw new Error(
        "Failed to find products for this category. Please try again."
      );
    }
  }

  async CheckInventory(
    inventoryData: { id: string; inventory_count: string }[]
  ) {
    try {
      const productIds = inventoryData.map((item) => item.id);

      const products = await this.productRepository.findByIdsToCheckInventory(
        productIds
      );

      return inventoryData.every((item) => {
        const product = products.find((p) => p.id === item.id);
        if (!product)
          throw new Error(`Product with ID ${item.id} not found.`);

        const requestedCount = parseInt(item.inventory_count);
        if (product.inventory_count <= requestedCount)
          throw new Error(
            `Insufficient inventory for product ${product.name}.`
          );
        return product.inventory_count >= requestedCount;
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
