// validations/payment-setup.validation.ts
import { z } from "zod";

export const ChargiliAccountCreateSchema = z.object({
  SECRET_KEY: z.string().min(1, "Secret key is required"),
});

export const ChargiliAccountUpdateSchema = ChargiliAccountCreateSchema;
