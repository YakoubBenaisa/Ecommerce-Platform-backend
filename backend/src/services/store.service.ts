import { injectable, inject } from "tsyringe";
import IStoreService from "./Interfaces/IStoreService";
import IStoreRepository from "../repositories/interfaces/IStoreRepository";
import { TStoreCreate, TStoreUpdate } from "../types/types";

@injectable()
export default class StoreService implements IStoreService {
  constructor(
    @inject("IStoreRepository") private storeRepository: IStoreRepository
  ) {}

  async createStore(storeData: TStoreCreate) {
    return  this.storeRepository.create(storeData);
  }

  async updateStore(storeData: TStoreUpdate) {
    return  this.storeRepository.update( storeData);
  }

  async getStoreById(id: string) {
    return  this.storeRepository.getStoreById(id);
  }
}
