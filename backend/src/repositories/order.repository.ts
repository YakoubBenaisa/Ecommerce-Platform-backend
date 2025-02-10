import { PrismaClient, Order, OrderItem } from "@prisma/client";
import {
  TOrderCreate,
  TOrderUpdate,
  TOrderWithProductsAndCustomer,
  TOrderItemsCreate,
  TFindInput,
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

  async getStoreOrders(data: TFindInput) {
    
   
    const where: any = { store_id: data.storeId };
  
    // 🔍 Case-insensitive search (customer name & email)
    if (data.search) {
      where.OR = [
        { customer: { name: { contains: data.search } } },
        { customer: { email: { contains: data.search } } },
      ];
    }
  
    // 🔽 Fetch orders with pagination, search & sorting
    const orders = await this.prisma.order.findMany({
      where,
      skip : data.skip,
      take: data.limit,
      orderBy: {
        [data.sortBy]: data.order, // Default sorting
      },
      include: {
        order_items: true,
        customer: true,
      },
    });
  
    // 📊 Get total count of matching orders
    const total = await this.prisma.order.count({ where });
  
    return {
      orders,
      pagination: {
        totalCount: total,
        totalPages: Math.ceil(total / data.limit),
        currentPage: data.page,
        perPage: data.limit,
      },
    };
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