// region Imports

// Import Package
import cors from 'cors';
import helmet from 'helmet';
import morgan, { StreamOptions } from 'morgan';
import express, { Express, Request, Response } from 'express';

// Import Config
import { env } from '@/config/env';
import { corsOptions } from '@/config/cors';

// Import Utils
import { logger } from '@/utils/logger';

// Import Constants
import { HTTP_STATUS } from '@/constants/http-status.constants';

// Import Middlewares
import { notFound } from '@/middlewares/not-found.middleware';
import { errorHandler } from '@/middlewares/error.middleware';
import { attachRequestId } from '@/middlewares/request-id.middleware';

// Import Routes
import apiRoutes from '@/routes/index';

// endregion

const app: Express = express();

// Security headers
app.use(helmet());
// Cross-origin resource sharing
app.use(cors(corsOptions));
// JSON body parsing
app.use(express.json());
// Attaches a unique request id to every request/response
app.use(attachRequestId);

if (env.NODE_ENV === 'development') {
    const morganStream: StreamOptions = {
        write: (message: string): void => {
            logger.info(message.trim());
        },
    };
    // HTTP request logging in development
    app.use(morgan('dev', { stream: morganStream }));
}

// GET /health — basic liveness check
app.get('/health', (_req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK).json({ status: 'ok' });
});

// Mounts all versioned API routes under /api/v1
app.use('/api/v1', apiRoutes);

// Handles any request that didn't match a route
app.use(notFound);
// Converts thrown errors into JSON error responses
app.use(errorHandler);

export { app };
