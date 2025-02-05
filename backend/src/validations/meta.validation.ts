// validations/meta.validation.ts
import { z } from "zod";

export const metaCreateSchema = z.object({
  page_id: z.string(),
  app_id: z.string(),
  access_token: z.string(),
});

export const metaUpdateSchema = z.object({
  page_id: z.string().optional(),
  app_id: z.string().optional(),
  access_token: z.string().optional(),
});
