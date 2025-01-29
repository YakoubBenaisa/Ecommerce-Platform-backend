import { Store } from "@prisma/client";
import {
          TStoreUpdate,
          TStoreWrite,
          TStoreWithProducts,
} from "../../types/types";

export default interface IStoreService {
          createStore(storeData: TStoreWrite, ownerId: string): Promise<Store>;
          updateStore(id: string, storeData: TStoreUpdate): Promise<Store | null>;
          getStoreById(id: string): Promise<TStoreWithProducts | null>;
}
