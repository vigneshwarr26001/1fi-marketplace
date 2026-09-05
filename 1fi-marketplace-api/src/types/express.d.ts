// region Imports

// Import Package
import 'express';

// endregion

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: 'user' | 'admin';
            };
            id?: string;
        }
    }
}

export {};
