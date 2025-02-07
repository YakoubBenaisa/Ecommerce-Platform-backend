import { Customer } from "@prisma/client";
import {
  TCustomerCreate,
  TCustomerUpdate,
  TCustomerWithOrders,
} from "../../types/types";

export default interface ICustomerRepository {
  create(data: TCustomerCreate): Promise<Customer>;
  update(data: TCustomerUpdate): Promise<Customer>;
  findById(id: string): Promise<TCustomerWithOrders | null>;
findByStore(storeId: string): Promise<Customer[]>;
}
