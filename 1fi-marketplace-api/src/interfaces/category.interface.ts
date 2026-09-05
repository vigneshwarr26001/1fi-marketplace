// region Imports

// Import Package
import { Document } from 'mongoose';

// endregion

export interface ICategoryDocument extends Document {
    name: string;
    slug: string;
    image: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
