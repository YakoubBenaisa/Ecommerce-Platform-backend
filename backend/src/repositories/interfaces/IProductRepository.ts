import { Product,Category } from "@prisma/client";
import { TProductCreate, TProductUpdate, TProductWithCategory } from "../../types/types";

export default interface IProductRepository {
  create(data: TProductCreate): Promise<Product>;
  update(data: TProductUpdate): Promise<Product>;
  delete(id: string): Promise<Product>;
  findById(id: string): Promise<(Product & { category: Category })>;
  findByStoreId(store_id: string): Promise<(Product & { category: Category })[]>;
  findByCategoryId(category_id: string): Promise<(Product & { category: Category })[]>;
  findByIdsToCheckInventory(ids: string[]): Promise<Pick<Product, "id" | "inventory_count">[]>;
}
