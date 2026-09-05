// region Imports

// Import Package
import { z } from 'zod';
import dotenv from 'dotenv';

// endregion

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(5000),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
    JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
    JWT_EXPIRES_IN: z.string().min(1, 'JWT_EXPIRES_IN is required'),
    CORS_ORIGIN: z.string().min(1, 'CORS_ORIGIN is required'),
});

// Type describing the validated set of environment variables
export type Env = z.infer<typeof envSchema>;

// Parses and validates process.env against the schema, exiting the process if it is invalid
function loadEnv(): Env {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
        console.error('[ENV VALIDATION ERROR] Invalid environment variables:');
        console.error(parsed.error.flatten().fieldErrors);
        process.exit(1);
    }

    return parsed.data;
}

// Validated environment variables, loaded once at module init
export const env: Env = loadEnv();
