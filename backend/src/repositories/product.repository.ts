import { Prisma, Product, Category, PrismaClient } from "@prisma/client";
import { NotFoundError } from "../types/errors";
import {
  TProductCreate,
  TProductUpdate,
  TProductWithCategory,
} from "../types/types";
import IProductRepository from "./interfaces/IProductRepository";
import { injectable, inject } from "tsyringe";
import db from "../config/db";

@injectable()
export default class ProductRepository implements IProductRepository {
  private prisma: PrismaClient;

  constructor(@inject("db") private prismaService: db) {
    this.prisma = prismaService.getClient();
  }
  async create(data: TProductCreate) {
    return this.prisma.product.create({
      data,
    });
  }

  async update(data: TProductUpdate) {
    const { id, ...updateData } = data;

    return await this.prisma.product.update({
      where: { id },
      data: updateData as Prisma.ProductUpdateInput,
    });
  }

  async delete(id: string) {
    return await this.prisma.product.delete({
      where: { id },
    });
  }

  async findById(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id },
      include: { category: true },
    });

    if (!product) throw new NotFoundError("Product", id);
    return product;
  }

  async findByStoreId(store_id: string) {
    return this.prisma.product.findMany({
      where: { store_id },
      include: { category: true },
      orderBy: { created_at: "desc" },
    });
  }

  async findByCategoryId(category_id: string) {
    return this.prisma.product.findMany({
      where: { category_id },
      include: { category: true },
      orderBy: { created_at: "desc" },
    });
  }

  async findByIdsToCheckInventory(
    ids: string[],
  ): Promise<Pick<Product, "id" | "name" | "price" | "inventory_count">[]> {
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
