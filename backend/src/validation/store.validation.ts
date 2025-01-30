import { z } from 'zod';

export const storeCreateSchema = z.object({
    name: z.string().min(2, 'Store name must be at least 2 characters long'),
    description: z.string().optional(),
});

export const storeUpdateSchema = z.object({
    name: z.string().min(2, 'Store name must be at least 2 characters long').optional(),
    description: z.string().optional(),
});

