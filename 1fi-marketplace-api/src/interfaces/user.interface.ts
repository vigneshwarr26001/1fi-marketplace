// region Imports

// Import Package
import { Document } from 'mongoose';

// endregion

export type UserRole = 'user' | 'admin';

export interface IUserDocument extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidate: string): Promise<boolean>;
}
