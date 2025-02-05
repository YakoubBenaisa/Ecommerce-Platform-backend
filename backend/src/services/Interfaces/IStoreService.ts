import { Store } from "@prisma/client";
import {
  TStoreUpdate,
  TStoreWithProducts,
  TStoreCreate,
} from "../../types/types";

export default interface IStoreService {
  createStore(storeData: TStoreCreate): Promise<Store>;
  updateStore(storeData: TStoreUpdate): Promise<Store | null>;
  getStoreByIdWithProducts(id: string): Promise<TStoreWithProducts | null>;
}
