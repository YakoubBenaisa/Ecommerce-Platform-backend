import { injectable, inject } from "tsyringe";
import { PrismaClient } from "@prisma/client";
import ICustomerRepository from "./interfaces/ICustomerRepository";
import {
  TCustomerCreate,
  TCustomerUpdate,
  TCustomerWithOrders,
  TFindInput,
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

  async findByStore(data: TFindInput) {
    
    const where: any = { store_id: data.storeId };
  
    // 🔍 Case-insensitive search (name & email)
    if (data.search) {
      where.OR = [
        { name: { contains: data.search } },
        { email: { contains: data.search } },
      ];
    }
  
    // 🔽 Fetch customers with pagination, search & sorting
    const customers = await this.prisma.customer.findMany({
      where,
      skip: data.skip,
      take: data.limit,
      orderBy: {
        [data.sortBy ?? "createdAt"]: data.order ?? "desc", // Default sorting
      },
    });
  
    // 📊 Get total count of matching customers
    const total = await this.prisma.customer.count({ where });
  
    // 📄 Return paginated response
    return {
      customers,
      pagination: {
        totalCount: total,
        totalPages: Math.ceil(total / data.limit),
        currentPage: data.page,
        perPage: data.limit,
      },
    };
  }
  
  
}
