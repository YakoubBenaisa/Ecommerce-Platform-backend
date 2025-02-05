import { injectable, inject } from "tsyringe";
import IMetaService from "./Interfaces/IMetaService";
import IMetaRepository from "../repositories/interfaces/IMetaRepository";
import IStoreService from "./store.service";
import { Prisma } from "@prisma/client";
import handlePrismaError from "../utils/handlePrismaErrors";
import {
  InternalServerError,
  ConflictError,
  NotFoundError,
} from "../types/errors";
import { TMetaIntegrationCreate, TMetaIntegrationUpdate } from "../types/types";

@injectable()
export default class MetaService implements IMetaService {
  constructor(
    @inject("IMetaRepository") private metaRepo: IMetaRepository,
    @inject("IStoreService") private storeService: IStoreService,
  ) {}

  async createMetaIntegration(data: TMetaIntegrationCreate) {
    try {
      const result = await this.metaRepo.create(data);
      await this.storeService.updateStore({
        id: data.store_id,
        meta_integration_status: true,
      });
      return result;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "MetaIntegration" });

      throw new InternalServerError("Failed to create meta integration");
    }
  }

  async deleteMetaIntegration(storeId: string) {
    try {
      const result = await this.metaRepo.delete(storeId);
      await this.storeService.updateStore({
        id: storeId,
        meta_integration_status: false,
      });
      return result;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "MetaIntegration" });

      throw new InternalServerError("Failed to delete meta integration");
    }
  }

  async updateMetaIntegration(data: TMetaIntegrationUpdate) {
    try {
      return this.metaRepo.update(data);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "MetaIntegration" });

      throw new InternalServerError("Failed to update meta integration");
    }
  }
}
