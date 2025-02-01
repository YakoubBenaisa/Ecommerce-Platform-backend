import { Prisma, Product, Category,PrismaClient } from "@prisma/client";
import { NotFoundError } from "../types/errors";
import { TProductCreate, TProductUpdate, TProductWithCategory } from "../types/types";
import IProductRepository from "./interfaces/IProductRepository";
import { injectable, inject } from "tsyringe";
import db from "../config/db";

@injectable()
export default class ProductRepository implements IProductRepository {
  private prisma: PrismaClient;

  constructor(@inject("db") private prismaService: db) {
    this.prisma = prismaService.getClient();
  }
  async create(data: TProductCreate): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async update(data: TProductUpdate): Promise<Product> {
   
      const { id, ...updateData } = data;
      
      return await this.prisma.product.update({
        where: { id },
        data: updateData as Prisma.ProductUpdateInput,
      });
   
  }

  async delete(id: string): Promise<Product> {
    try {
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError("Product", id);
      }
      throw error;
    }
  }

  async findById(id: string): Promise<TProductWithCategory> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) throw new NotFoundError("Product", id);
    return product;
  }

  async findByStoreId(store_id: string) {
    const products = await this.prisma.product.findMany({
      where: { store_id },
      include: { category: true },
      orderBy: { created_at: 'desc' },
    });
    if (!products || products.length === 0)
     return null;

    return products;
  }

  async findByCategoryId(category_id: string): Promise<TProductWithCategory[]> {
    return this.prisma.product.findMany({
      where: { category_id },
      include: { category: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByIdsToCheckInventory(ids: string[]): Promise<Pick<Product, "id" | "name" | "price" | "inventory_count">[]> {
    return this.prisma.product.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        price: true,
        inventory_count: true,
      },
    });
  }
}