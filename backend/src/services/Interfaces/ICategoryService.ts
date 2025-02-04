
import { TCategoryCreate } from "../../types/types";
import { Category } from "@prisma/client";

export default interface ICategoryService {
  create(data: TCategoryCreate): Promise<Category>;
  list(storeId: string): Promise<Category[]>;
  delete(categoryId: string): Promise<Category>;
}
