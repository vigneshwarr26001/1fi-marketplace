// region Imports

// Import Package
import mongoose from 'mongoose';

// Import Config
import { env } from '@/config/env';

// Import Utils
import { logger } from '@/utils/logger';

// endregion

mongoose.connection.on('connected', () => {
    logger.info('MongoDB connection established');
});

mongoose.connection.on('error', (err: Error) => {
    logger.error('MongoDB connection error', err.message);
});

mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection disconnected');
});

// Opens the MongoDB connection using the configured URI, exiting the process on failure
export async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(env.MONGODB_URI);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        logger.error('Failed to connect to MongoDB', message);
        process.exit(1);
    }
}
