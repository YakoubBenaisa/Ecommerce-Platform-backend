import { injectable, inject } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import ICustomerRepository from "./interfaces/ICustomerRepository";
import {
  TCustomerCreate,
  TCustomerUpdate,
  TCustomerWithOrders,
} from "../types/types";

@injectable()
export default class CustomerRepository implements ICustomerRepository {
  private prisma: PrismaClient;

  constructor(@inject("db") private prismaService: any) {
    this.prisma = prismaService.getClient();
  }

  async create(data: TCustomerCreate) {
    return this.prisma.customer.create({
      data,
    });
  }

  async update(data: TCustomerUpdate) {
    return this.prisma.customer.update({
      where: { id: data.id },
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: true,
      },
    });
  }

  async findByStore(storeId: string) {
    return this.prisma.customer.findMany({
      where: { store_id: storeId },
    });
  }
}
