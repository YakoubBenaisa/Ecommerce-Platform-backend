
import { injectable, inject } from "tsyringe";
import  ICategoryService  from "./Interfaces/ICategoryService";
import  ICategoryRepository  from "../repositories/interfaces/ICategoryRepository";
import { TCategoryCreate } from "../types/types";
import { Prisma } from "@prisma/client";
import { InternalServerError, NotFoundError } from "../types/errors";
import { handlePrismaError } from "../utils/handlePrismaErrors";

@injectable()
export default class CategoryService implements ICategoryService {
  constructor(
    @inject("ICategoryRepository") private repository: ICategoryRepository
  ) {}

  async create(data:TCategoryCreate){
    
    try {
      return await this.repository.create(data);
    } catch (error: any) {
      
    
      throw new InternalServerError("Failed to create category");
    }
  }

  async list(storeId: string) {
    try {
      return await this.repository.listByStore(storeId);
    } catch (error: any) {
      throw new InternalServerError("Failed to list categories");
    }
  }

  async delete(categoryId: string) {
    try {
      return await this.repository.delete(categoryId);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) 
        handlePrismaError(error, { resource: 'Category', id: categoryId });
      
      throw new InternalServerError("Failed to delete category");
    }
  }
}
