import { Customer } from "@prisma/client";
import {
  TCustomerCreate,
  TCustomerUpdate,
  TCustomerWithOrders,
} from "../../types/types";

export default interface ICustomerService {
  createCustomer(data: TCustomerCreate): Promise<Customer>;
  updateCustomer(data: TCustomerUpdate): Promise<Customer>;
  getCustomerWithOrders(
    customerId: string,
  ): Promise<TCustomerWithOrders | null>;
  getStoreCustomers(storeId: string): Promise<Customer[]>;
}
