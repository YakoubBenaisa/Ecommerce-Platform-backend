import { TOrderCreate, TOrderItems, TOrderItemsCreate, TOrderUpdate, TOrderWithProductsAndCustomer } from "../../types/types";
import { Order, OrderStatus } from "@prisma/client";

export default interface IOrderService {
  createOrder(data: TOrderCreate,orderItems:TOrderItems ): Promise<Order>;
  updateOrder(data: TOrderUpdate): Promise<Order>;
  deleteOrder(id: string): Promise<Order>;
  getStoreOrders(storeId: string): Promise<TOrderWithProductsAndCustomer[]>;
  getOrderById(id: string): Promise<TOrderWithProductsAndCustomer | null>;
   updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
} 