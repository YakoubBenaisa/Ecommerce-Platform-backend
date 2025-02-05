import { MetaIntegration } from "@prisma/client";
import {
  TMetaIntegrationCreate,
  TMetaIntegrationUpdate,
} from "../../types/types";

export default interface IMetaService {
  createMetaIntegration(data: TMetaIntegrationCreate): Promise<MetaIntegration>;
  deleteMetaIntegration(storeId: string): Promise<MetaIntegration>;
  updateMetaIntegration(data: TMetaIntegrationUpdate): Promise<MetaIntegration>;
}
