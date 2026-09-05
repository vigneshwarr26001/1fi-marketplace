// region Imports

// Import Package
import { z } from 'zod';

// endregion

// Validates login request body: a well-formed email and a minimum-length password
export const loginSchema = z.object({
    email: z.string().email('A valid email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
