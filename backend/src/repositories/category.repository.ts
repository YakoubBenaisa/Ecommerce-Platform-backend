
import { injectable, inject } from "tsyringe";
import  ICategoryRepository  from "./interfaces/ICategoryRepository";
import { TCategoryCreate } from "../types/types";
import { PrismaClient, Prisma } from "@prisma/client";
import db from "../config/db";

@injectable()
export default class CategoryRepository implements ICategoryRepository {
  private prisma: PrismaClient;

  constructor(@inject("db") private prismaService: db) {
    this.prisma = prismaService.getClient();
  }

  async create(data: TCategoryCreate){
    return this.prisma.category.create({
      data,
    });
  }

  async listByStore(storeId: string) {
    return this.prisma.category.findMany({
      where: { store_id: storeId },
    });
  }

  async delete(categoryId: string){
    return this.prisma.category.delete({
      where: { id: categoryId },
    });
  }
}
