import { Store } from "@prisma/client";
import { TStoreUpdate, TStoreWithProducts, TStoreCreate } from "../../types/types";

export default interface IStoreRepository {

          create(storeData: TStoreCreate): Promise<Store>;
          update( storeData: TStoreUpdate): Promise<Store | null>;
          getStoreById(id: string): Promise<TStoreWithProducts | null>;
}