import { Category } from "@prisma/client";
import { TCategoryCreate } from "../../types/types";

export default interface ICategoryRepository {
  create(data: TCategoryCreate): Promise<Category>;
  listByStore(storeId: string): Promise<Category[]>;
  delete(categoryId: string): Promise<Category>;
}
