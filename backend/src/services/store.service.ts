import { injectable, inject } from "tsyringe";
import IStoreService from "./Interfaces/IStoreService";
import IStoreRepository from "../repositories/interfaces/IStoreRepository";
import { TStoreWrite, TStoreUpdate } from "../types/types";

@injectable()
export default class StoreService implements IStoreService {
          constructor(
                    @inject("IStoreRepository") private storeRepository: IStoreRepository
          ) { }

          async createStore(storeData: TStoreWrite, ownerId: string) {
                    return this.storeRepository.create(storeData, ownerId);
          }

          async updateStore(id: string, storeData: TStoreUpdate) {
                    return this.storeRepository.update(id, storeData);
          }

          async getStoreById(id: string) {
                    return this.storeRepository.getStoreById(id);
          }
}