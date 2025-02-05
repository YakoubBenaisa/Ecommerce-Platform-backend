import { Product } from "@prisma/client";
import { TProductCreate, TProductUpdate } from "../../types/types";

export default interface IProductService {
  create(data: TProductCreate): Promise<Product>;
  update(data: TProductUpdate): Promise<Product>;
  delete(id: string): any;
  findById(id: string): Promise<Product>;
  findByStoreId(store_id: string): Promise<Product[] | null>;
  findByCategoryId(category_id: string): Promise<Product[]>;

  CheckInventory(
    inventoryData: { id: string; inventory_count: string }[],
  ): Promise<boolean>;
}
