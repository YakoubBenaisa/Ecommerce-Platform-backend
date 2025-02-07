import { ChargiliAccount, PrismaClient } from "@prisma/client";
import { TChargiliAccountCreate } from "../../types/types";

export default interface IChargiliAccountRepository {
  create(data: TChargiliAccountCreate): Promise<ChargiliAccount>;
  deleteByStoreId(storeId: string): Promise<ChargiliAccount>;
  updateByStoreId(data: TChargiliAccountCreate): Promise<ChargiliAccount>;
  getSecretKeyByStoreID(storeId: string): Promise<{
    SECRET_KEY: string;
  } | null>;
}
