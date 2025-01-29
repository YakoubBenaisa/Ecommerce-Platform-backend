import { User ,Store,Product, Category, MetaIntegration , ChargiliAccount } from "@prisma/client";
import { Request } from "express";




// __________________ Auth types _____________________

export interface TUserWithStore extends User {
  store: { id: string } | null;
}

export interface TAuthToken {
  accessToken: string;
  refreshToken: string;
}

export type RequestWithUser = Request & { user?: any };

//________________ Store types _______________________

export interface TStoreWithProducts extends Store {
  owner: Omit<User, "password_hash" | "created_at" | "updated_at">;
  products: TProductWithCategory;
}

export type TStoreWrite = Omit<Store, "id" | "owner_id" | "created_at" | "updated_at"| "meta_integration_status" | "payment_setup_status">;

export type TStoreUpdate = Partial<Store>;


//________________ Product types _______________________
export interface TProductWithCategory extends Product {
  categories: Category[ ];}

  //________________ MetaIntegration types _______________________

  export type TMetaIntegration = Omit<MetaIntegration, "id" | "store_id" | "created_at" | "updated_at">;
  //________________ types _______________________

export type TChargiliAccount = Omit<ChargiliAccount, "id" | "store_id" | "created_at" | "updated_at">;


