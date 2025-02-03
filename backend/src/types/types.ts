import { User ,Store,Product, Category, MetaIntegration , ChargiliAccount,Prisma } from "@prisma/client";
import { Decimal, JsonValue } from "@prisma/client/runtime/library";
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

export type TStoreCreate = Omit<Store, "id" |  "created_at" | "updated_at"| "meta_integration_status" | "payment_setup_status">;

export type TStoreUpdate = Partial<Store>;


//________________ Product types _______________________



export type TProductWithCategory = Prisma.ProductGetPayload<{
  include: {
    category: true;
  }
}>;




export type TProductCreate = Omit<Prisma.ProductCreateInput, "id" | "created_at" | "updated_at"> & {
  images?: Prisma.InputJsonValue | null;  
};


export type TProductUpdate = {
  id: string; // Required for updates
  name?: string; 
  description?: string | null;
  price?: Decimal;
  category_id?: string | null;
  inventory_count?: number;
  images?: JsonValue;
  store_id: string; // Keep store_id as required
};


//________________ MetaIntegration types _______________________

export type TMetaIntegration = Omit<MetaIntegration, "id" | "store_id" | "created_at" | "updated_at">;
//________________ types _______________________

export type TChargiliAccount = Omit<ChargiliAccount, "id" | "store_id" | "created_at" | "updated_at">;


