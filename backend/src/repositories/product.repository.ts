import { injectable, inject } from "tsyringe";
import IProductRepository from "./interfaces/IProductRepository";
import db from "../config/db";
import { PrismaClient, Product } from "@prisma/client";
import { TProductCreate, TProductUpdate } from "../types/types";
import { NotFoundError } from "../types/errors";

@injectable()
export default class ProductRepository implements IProductRepository {
  private prisma: PrismaClient;

  constructor(@inject("db") private prismaService: db) {
    this.prisma = prismaService.getClient();
  }

  async create(data: TProductCreate) {
    try {
      const product = await this.prisma.product.create({
        data: data,
      });
      return product;
    } catch (error) {
      throw new Error(`Failed to create product`);
    }
  }

  async update(data: TProductUpdate) {
    try {
      const product = await this.prisma.product.update({
        where: { id: data.id },
        data: data,
      });
      return product;
    } catch (error) {
      throw new Error(`Failed to update product`);
    }
  }

  async delete(id: string) {
    try {
      const product = await this.prisma.product.delete({
        where: { id },
      });
      return product;
    } catch (error) {
      throw new Error(`Failed to delete product`);
    }
  }

  async findById(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: { category: true },
      });
      if (!product) {
        throw new NotFoundError("Product", id);
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to find product`);
    }
  }

  async findByStoreId(store_id: string) {
    try {
      const products = await this.prisma.product.findMany({
        where: { store_id },
        include: { category: true },
      });
      return products;
    } catch (error) {
      throw new Error(`Failed to find products`);
    }
  }

  async findByCategoryId(category_id: string) {
    try {
      const products = await this.prisma.product.findMany({
        where: { category_id },
        include: { category: true },
      });
      return products;
    } catch (error) {
      throw new Error(`Failed to find products`);
    }
  }

  async findByIdsToCheckInventory(ids: string[]) {
    try {
        const products = await this.prisma.product.findMany({
            where: {
                id: { in: ids }, 
            },
            select: {
                id: true,
                
                inventory_count: true, 
            },
        });

        return products;
    } catch (error) {
        throw new Error("Failed to find products");
    }
}

}
