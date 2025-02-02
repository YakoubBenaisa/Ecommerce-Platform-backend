import { Store } from "@prisma/client";
import { TStoreUpdate, TStoreWithProducts, TStoreCreate } from "../../types/types";
import { NotFoundError } from "../../types/errors";

export default interface IStoreRepository {

          create(storeData: TStoreCreate): Promise<Store>;
          update( storeData: TStoreUpdate): Promise<Store | null>;
          getStoreByIdWithProducts(id: string): Promise<TStoreWithProducts | null>;
          getStoreByName(name: string): Promise<Store | null>;
}