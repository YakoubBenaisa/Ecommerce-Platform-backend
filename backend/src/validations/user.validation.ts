import { z } from 'zod';

export const userRegistrationSchema = z.object({
  username: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('A valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});


export const userLoginSchema = z.object({
  email: z.string().email('A valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
