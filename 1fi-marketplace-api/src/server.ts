// region Imports

// Import Package
import { Server } from 'http';

// Import App
import { app } from '@/app';

// Import Config
import { env } from '@/config/env';
import { connectDB } from '@/config/database';

// Import Utils
import { logger } from '@/utils/logger';

// endregion

let server: Server;

// Gracefully closes the HTTP server on receiving a shutdown signal
function shutdown(signal: string): void {
    logger.info(`${signal} received, shutting down gracefully`);

    if (!server) {
        process.exit(0);
        return;
    }

    server.close((err?: Error) => {
        if (err) {
            logger.error('Error during server shutdown', err.message);
            process.exit(1);
        }
        logger.info('Server closed');
        process.exit(0);
    });
}

// Connects to the database and starts the HTTP server, wiring up shutdown signal handlers
async function bootstrap(): Promise<void> {
    await connectDB();

    server = app.listen(env.PORT, () => {
        logger.info(`Server running at http://localhost:${env.PORT}`);
    });

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : 'Unknown error during bootstrap';
    logger.error('Failed to start server', message);
    process.exit(1);
});
