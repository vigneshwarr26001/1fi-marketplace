// region Imports

// Import Package
import { CorsOptions } from 'cors';

// Import Config
import { env } from '@/config/env';

// endregion

const allowedOrigins: string[] = env.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

// CORS options that allow only whitelisted origins (from CORS_ORIGIN env var) with credentials
export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error(`Origin '${origin}' is not allowed by CORS policy`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
