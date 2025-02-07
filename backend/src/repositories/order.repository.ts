import { PrismaClient, Order, OrderItem } from "@prisma/client";
import {
  TOrderCreate,
  TOrderUpdate,
  TOrderWithProductsAndCustomer,
  TOrderItemsCreate,
} from "../types/types";
import IOrderRepository from "./interfaces/IOrederRepository";
import { injectable, inject } from "tsyringe";
import db from "../config/db"

@injectable()
export default class OrderRepository implements IOrderRepository {
  private prisma: PrismaClient;

  constructor(@inject("db") private prismaService: db) {
    this.prisma = prismaService.getClient();
  }

  async create(data: TOrderCreate, items: TOrderItemsCreate[])
  {
    return this.prisma.order.create({
      data: {
        ...data,
        order_items: {
          create: items,
        },
      },
      include: {
        order_items: true,
      },
    });
  }

  

  async update(data: TOrderUpdate) {
    return this.prisma.order.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }

  async getStoreOrders(storeId: string) {
    return this.prisma.order.findMany({
      where: { store_id:storeId },
      include: {
        order_items: true,
        customer: true,
      },
    });
  }

 

  async getOrderById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        order_items: true,
        customer: true,
      },
    });
  }
} 