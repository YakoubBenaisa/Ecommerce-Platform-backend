import { z } from "zod";



export const createProductSchema = z.object({
  name: z.string({
    required_error: "Product name is required",
    invalid_type_error: "Product name must be a string",
  }),
  description: z.string({
    invalid_type_error: "Description must be a string",
  }).optional(),
  price: z.coerce.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }).min(0, "Price must be a positive number"),
  inventory_count: z.coerce.number({
    invalid_type_error: "Stock must be a number",
  }).int("Stock must be an integer")
    .min(0, "Stock must be a positive integer")
    , images: z
    .array(z.string(), {
      invalid_type_error: "Images must be an array of strings",
    })
    .optional(),
});

export const updateProductSchema = z.object({
  
  name: z.string({
    invalid_type_error: "Product name must be a string",
  }).optional(),
  description: z.string({
    invalid_type_error: "Description must be a string",
  }).optional(),
  price: z.number({
    invalid_type_error: "Price must be a number",
  }).min(0, "Price must be a positive number")
    .optional(),
  inventory_count: z.number({
    invalid_type_error: "Stock must be a number",
  }).int("Stock must be an integer")
    .min(0, "Stock must be a positive integer")
    .optional(),
});



export const storeIdParamSchema = z.object({
  storeId: z.string().uuid("Invalid store ID"),
}); 




export const createCategorySchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});


