import { z } from "zod";
import { OrderStatus } from "@prisma/client";

export const placeOrderSchema = z.object({
  customer: z
    .object({
      name: z.string().min(1, { message: "Name is required" }),
      email: z.string().email({ message: "Invalid email address" }).optional(),
      phone: z.string().optional(),
    })
    .refine((data) => data.email || data.phone, {
      message: "At least one contact method (email or phone) is required",
    }),
  order: z.object({
    store_id: z.string().uuid({ message: "Invalid store_id" }),
    payment_method: z.string().optional().default("cash_on_delivery"),
   
    address: z.any().optional(),
  }),
  items: z.array(
    z.object({
      id: z.string().uuid({ message: "Invalid product id" }),
      quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
    })
  ),
});

export const orderItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  store_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  items: z.array(orderItemSchema),
  payment_method: z.enum(["baridi_mob", "cash_on_delivery"]).optional(),
  order_source: z.enum(["messenger", "platform", "in_store"]).optional(),
  customer_messenger_id: z.string().optional(),
  address: z.any().optional(),
});

export const updateOrderSchema = z.object({
  status: z
    .enum(["pending", "processing", "cancelled", "shipped", "delivered"])
    .optional(),
  items: z.array(orderItemSchema).optional(),
  payment_method: z.enum(["baridi_mob", "cash_on_delivery"]).optional(),
  order_source: z.enum(["messenger", "platform", "in_store"]).optional(),
  customer_messenger_id: z.string().optional(),
  address: z.any().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});
