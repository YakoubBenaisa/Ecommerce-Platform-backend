import { container, inject, injectable } from "tsyringe";
import IStoreRepository from "./interfaces/IStoreRepository";
import { TStoreUpdate, TStoreWithProducts, TStoreCreate } from "../types/types";
import db from "../config/db";
import { PrismaClient, Store } from "@prisma/client";

@injectable()
export default class StoreRepository implements IStoreRepository {
  private prisma: PrismaClient;

  constructor(@inject("db") private prismaService: db) {
    this.prisma = prismaService.getClient();
  }

  async create(storeData: TStoreCreate) {
    // Check if the user already owns a store
    const existingStore = await this.prisma.store.findUnique({
        where: { owner_id: storeData.owner_id },
    });

    if (existingStore) {
        throw new Error("This user already owns a store.");
    }

    // Create new store if the user doesn't have one
    const store = await this.prisma.store.create({
        data: storeData,
    });

    return store;
}


  async update(storeData: TStoreUpdate) {
    const store = await this.prisma.store.update({
      where: { id: storeData.id },
      data: storeData,
    });
    return store;
  }

  async getStoreById(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        products: {
          include: {
            category: true,
          },
        },
      },
    });
    return store as TStoreWithProducts | null;
  }
}
