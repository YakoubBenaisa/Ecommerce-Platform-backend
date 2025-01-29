import { Store } from "@prisma/client";
import { TStoreUpdate, TStoreWithProducts, TStoreWrite } from "../../types/types";

export default interface IStoreRepository {

          create(storeData: TStoreWrite, ownerId: string): Promise<Store>;
          update(id: string, storeData: TStoreUpdate): Promise<Store | null>;
          getStoreById(id: string): Promise<TStoreWithProducts | null>;
}