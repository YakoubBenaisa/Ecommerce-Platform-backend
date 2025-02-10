import { TOrderCreate, TOrderItemsCreate, TOrderUpdate, TOrderWithProductsAndCustomer ,TOrderWithItems, TPagination, TGetStoreOrders, TFindInput } from "../../types/types";
import { Order, OrderItem } from "@prisma/client";

export default interface IOrderRepository {
          create(data: TOrderCreate,items: TOrderItemsCreate[]):Promise<TOrderWithItems>;
          update(data: TOrderUpdate): Promise<Order >;
          delete(id: string): Promise<Order >;
          getStoreOrders(data: TFindInput): Promise<TGetStoreOrders>;
        //  createOrderItems(data: TOrderItemsCreate): Promise<OrderItem>;
          getOrderById(id: string): Promise<TOrderWithProductsAndCustomer | null>;
}