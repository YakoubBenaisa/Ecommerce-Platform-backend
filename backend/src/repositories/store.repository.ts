import { container, inject, injectable } from "tsyringe";
import IStoreRepository from "./interfaces/IStoreRepository";
import { TStoreUpdate, TStoreWithProducts, TStoreWrite } from "../types/types";
import db from "../config/db";
import { PrismaClient, Store } from "@prisma/client";


@injectable()
export default class StoreRepository implements IStoreRepository {

    constructor(@inject("db") private prisma:PrismaClient){

    }

    async create(storeData: TStoreWrite, ownerId: string) {

        const store = await this.prisma.store.create({
            data: { ...storeData, owner_id: ownerId },
        });
        return store;
    }

    async update(id: string, storeData: TStoreUpdate) {
        const store = await this.prisma.store.update({
            where: { id },
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