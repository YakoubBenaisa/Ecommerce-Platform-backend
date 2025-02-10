import { Customer } from "@prisma/client";
import {
  TCustomerCreate,
  TCustomerUpdate,
  TCustomerWithOrders,
  TFindInput,
  TPagination
} from "../../types/types";

export default interface ICustomerRepository {
  create(data: TCustomerCreate): Promise<Customer>;
  update(data: TCustomerUpdate): Promise<Customer>;
  findById(id: string): Promise<TCustomerWithOrders | null>;

  findByStore(data:TFindInput
  ): Promise<{
    customers: Customer[];
    pagination: TPagination
  }>;
}
