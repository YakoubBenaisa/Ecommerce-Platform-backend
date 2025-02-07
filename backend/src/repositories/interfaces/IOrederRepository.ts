import { TOrderCreate, TOrderItemsCreate, TOrderUpdate, TOrderWithProductsAndCustomer ,TOrderWithItems } from "../../types/types";
import { Order, OrderItem } from "@prisma/client";

export default interface IOrderRepository {
          create(data: TOrderCreate,items: TOrderItemsCreate[]):Promise<TOrderWithItems>;
          update(data: TOrderUpdate): Promise<Order >;
          delete(id: string): Promise<Order >;
          getStoreOrders(storeId: string): Promise<TOrderWithProductsAndCustomer[]>;
        //  createOrderItems(data: TOrderItemsCreate): Promise<OrderItem>;
          getOrderById(id: string): Promise<TOrderWithProductsAndCustomer | null>;
}