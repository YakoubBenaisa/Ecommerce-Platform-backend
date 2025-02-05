import { Product, Category } from "@prisma/client";
import {
  TProductCreate,
  TProductUpdate,
  TProductWithCategory,
} from "../../types/types";

export default interface IProductRepository {
  create(data: TProductCreate): Promise<Product>;
  update(data: TProductUpdate): Promise<Product>;
  delete(id: string): Promise<Product>;
  findById(id: string): Promise<TProductWithCategory>;
  findByStoreId(store_id: string): Promise<TProductWithCategory[] | null>;
  findByCategoryId(category_id: string): Promise<TProductWithCategory[]>;
  findByIdsToCheckInventory(
    ids: string[],
  ): Promise<Pick<Product, "id" | "name" | "price" | "inventory_count">[]>;
}
