import { injectable, inject } from "tsyringe";
import IOrderRepository from "../repositories/interfaces/IOrederRepository";
import IOrderService from "./Interfaces/IOrderService";
import {
  TOrderCreate,
  TOrderItems,
  TOrderItemsCreate,
  TOrderUpdate,
} from "../types/types";
import { Order, Prisma, OrderStatus } from "@prisma/client";
import handlePrismaError from "../utils/handlePrismaErrors";
import { InternalServerError, NotFoundError } from "../types/errors";
import IProductRepository from "../repositories/interfaces/IProductRepository";
import IProductService from "./Interfaces/IProductService";
@injectable()
export default class OrderService implements IOrderService {
  constructor(
    @inject("IOrderRepository") private orderRepository: IOrderRepository,
    @inject("IProductService") private productService: IProductService
  ) {}

  async createOrder(data: TOrderCreate, orderItems: TOrderItems) {
    try {
      
    
     
    
  
  
     
      return this.orderRepository.create(data, orderItems);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      console.log("ERRROR", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "Order" });
  
      throw new InternalServerError("Failed to create order");
    }
  }
  

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const order = await this.orderRepository.getOrderById(orderId);
      if (!order) {
        throw new NotFoundError("Order not found", orderId);
      }
  
      if (status === OrderStatus.cancelled) {
        // When an order is cancelled, increase the inventory for each item.
        const itemsToUpdate = order.order_items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          updateType: "increase" as const,
        }));
        await this.productService.updateInventory(itemsToUpdate);
      } 
  
      return await this.orderRepository.update({ id: orderId, status });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error, { resource: "Order", id: orderId });
      }
      throw new InternalServerError("Failed to update order status");
    }
  }
  

  async updateOrder(data: TOrderUpdate) {
    try {
      return await this.orderRepository.update(data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "Order" });
      throw new InternalServerError("Failed to update order");
    }
  }

  async deleteOrder(id: string) {
    try {
      return await this.orderRepository.delete(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "Order", id });
      throw new InternalServerError("Failed to delete order");
    }
  }

  async getStoreOrders(storeId: string) {
    try {
      return await this.orderRepository.getStoreOrders(storeId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "Order", id: storeId });
      throw new InternalServerError("Failed to retrieve store orders");
    }
  }

  async getOrderById(id: string) {
    try {
      return await this.orderRepository.getOrderById(id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "Order", id });
      throw new InternalServerError("Failed to retrieve order");
    }
  }
}
