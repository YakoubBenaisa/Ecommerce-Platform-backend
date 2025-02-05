import { ChargiliAccount } from "@prisma/client";
import { TChargiliAccountCreate } from "../../types/types";

export default interface IChargiliAccountService {
  setupPayment(data: TChargiliAccountCreate): Promise<ChargiliAccount>;
  deletePaymentSetup(storeId: string): Promise<ChargiliAccount>;
  updatePaymentSetup(data: TChargiliAccountCreate): Promise<ChargiliAccount>;
}
