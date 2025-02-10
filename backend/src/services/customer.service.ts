import { injectable, inject } from "tsyringe";
import ICustomerRepository from "../repositories/interfaces/ICustomerRepository";
import ICustomerService from "./Interfaces/ICustomerService";
import {
  NotFoundError,
  ConflictError,
  InternalServerError,
} from "../types/errors";
import { Prisma } from "@prisma/client";
import { handlePrismaError } from "../utils/handlePrismaErrors";
import {
  TCustomerCreate,
  TCustomerUpdate,
  TCustomerWithOrders,
  TFindInput,
} from "../types/types";

@injectable()
export default class CustomerService implements ICustomerService {
  constructor(
    @inject("ICustomerRepository")
    private customerRepository: ICustomerRepository,
  ) {}

  async createCustomer(data: TCustomerCreate) {
    try {
      return await this.customerRepository.create(data);
    } catch (error) {
      
     
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "customer" });

      throw new InternalServerError("Failed to create customer");
    }
  }

  async updateCustomer(data: TCustomerUpdate) {
    try {
      return await this.customerRepository.update(data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "customer" });

      throw error;
    }
  }

  async getCustomerWithOrders(customerId: string) {
    try {
      return this.customerRepository.findById(customerId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        handlePrismaError(error, { resource: "customer" });

      throw new InternalServerError("Failed to retrieve customer");
    }
  }

  async getStoreCustomers(data:TFindInput
  ) {
    try {
      return await this.customerRepository.findByStore(data);
    } catch (error) {
      console.error("Error fetching store customers:", error);
  
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handlePrismaError(error, { resource: "customer" });
      }
  
      throw new InternalServerError("Failed to retrieve customers. Please try again later.");
    }
  }
  
  }

