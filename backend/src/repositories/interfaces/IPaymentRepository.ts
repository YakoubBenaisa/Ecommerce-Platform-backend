
import { Payment } from "@prisma/client";
import { TPaymentCreate,TPaymentUpdate } from "../../types/types";

export default interface IPaymentRepository {
  create(data: TPaymentCreate): Promise<Payment>;
  updateByOrderId (data: TPaymentUpdate): Promise<Payment>;
}
