import { z } from "zod";

export const customerCreateSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: "At least one contact method (email or phone) is required",
  });

export const customerUpdateSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
