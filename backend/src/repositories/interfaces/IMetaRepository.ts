import { MetaIntegration } from "@prisma/client";
import {
  TMetaIntegrationCreate,
  TMetaIntegrationUpdate,
} from "../../types/types";

export default interface IMetaRepository {
  create(data: TMetaIntegrationCreate): Promise<MetaIntegration>;

  update(data: TMetaIntegrationUpdate): Promise<MetaIntegration>;

  delete(storeId: string): Promise<MetaIntegration>;
}
