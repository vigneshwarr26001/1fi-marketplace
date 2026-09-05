// region Imports

// Import Package
import { Schema, model, Model, Types } from 'mongoose';

// Import Interfaces
import { ICategoryDocument } from '@/interfaces/category.interface';

// endregion

const categorySchema = new Schema<ICategoryDocument>(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, 'Category slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        image: {
            type: String,
            required: [true, 'Category image is required'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                const json = ret as unknown as Record<string, unknown>;
                json.id = (json._id as Types.ObjectId).toString();
                delete json._id;
                delete json.__v;
                return json;
            },
        },
    },
);

// Mongoose model for the Category collection, built from categorySchema
export const CategoryModel: Model<ICategoryDocument> = model<ICategoryDocument>(
    'Category',
    categorySchema,
);
