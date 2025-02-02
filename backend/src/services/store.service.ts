import { injectable, inject } from "tsyringe";
import IStoreService from "./Interfaces/IStoreService";
import IStoreRepository from "../repositories/interfaces/IStoreRepository";
import { TStoreCreate, TStoreUpdate } from "../types/types";
import { 
  NotFoundError, 
  ConflictError, 
  InternalServerError,
  BadRequestError
} from "../types/errors";

@injectable()
export default class StoreService implements IStoreService {
  constructor(
    @inject("IStoreRepository") private storeRepository: IStoreRepository
  ) {}

  async createStore(storeData: TStoreCreate) {
    try {
      

      // Check for existing store (repository should implement this)
      const existingStore = await this.storeRepository.getStoreByName(storeData.name);
      if (existingStore) 
        throw new ConflictError(`Store with name ${storeData.name} already exists`);
      

      return await this.storeRepository.create(storeData);
    } catch (error) {
      if (error instanceof ConflictError) 
        throw error; 
      
      throw new InternalServerError("Failed to create store");
    }
  }

  async updateStore(storeData: TStoreUpdate) {
    try {
    
     

      const store = await this.storeRepository.update(storeData);
      if(!store) 
        throw new NotFoundError("Store");
      return store;
    } catch (error) {
      if (error instanceof NotFoundError ) {
        throw error;
      }
      throw new InternalServerError("Failed to update store");
    }
  }

  async getStoreByIdWithProducts(id: string) {
    try {
   

      const store = await this.storeRepository.getStoreByIdWithProducts(id);
      if (!store) 
        throw new NotFoundError("Store");
      
      return store;
    } catch (error) {
      if (error instanceof NotFoundError ) 
        throw error;
      
      throw new InternalServerError("Failed to retrieve store");
    }
  }
}