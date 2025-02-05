import db from "../config/db";
import { inject, injectable } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import { TMetaIntegrationCreate, TMetaIntegrationUpdate } from "../types/types";

@injectable()
export default class MetaRepository {
  private prisma: PrismaClient;

  constructor(@inject("db") private prismaService: db) {
    this.prisma = prismaService.getClient();
  }

  async create(data: TMetaIntegrationCreate) {
    return this.prisma.metaIntegration.create({ data });
  }

  async update(data: TMetaIntegrationUpdate) {
    return this.prisma.metaIntegration.update({
      where: { store_id: data.store_id },
      data,
    });
  }

  async delete(storeId: string) {
    return this.prisma.metaIntegration.delete({ where: { store_id: storeId } });
  }
}
