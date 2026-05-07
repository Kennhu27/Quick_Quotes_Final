import { z } from 'zod';

export const AdminLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const CreateAdminSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be less than 64 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
});
