import { Customer } from "@prisma/client";
import {
  TCustomerCreate,
  TCustomerUpdate,
  TCustomerWithOrders,
  TFindInput,
  TPagination,
} from "../../types/types";

export default interface ICustomerService {
  createCustomer(data: TCustomerCreate): Promise<Customer>;
  updateCustomer(data: TCustomerUpdate): Promise<Customer>;
  getCustomerWithOrders(
    customerId: string,
  ): Promise<TCustomerWithOrders | null>;
  getStoreCustomers(data:TFindInput
  ): Promise<{
    customers: Customer[];
    pagination: TPagination
  }>;
}
