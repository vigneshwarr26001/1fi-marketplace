// region Imports

// Import Package
import { Schema, model, Model, Types } from 'mongoose';

// Import Interfaces
import {
    IProductDocument,
    IVariantOption,
    IVariantGroup,
    ISpecification,
    IEmiPlan,
    IProductImage,
} from '@/interfaces/product.interface';

// endregion

const productImageSchema = new Schema<IProductImage>(
    {
        url: { type: String, required: true },
        alt: { type: String, required: true },
    },
    { _id: false },
);

const variantOptionSchema = new Schema<IVariantOption>(
    {
        label: { type: String, required: true },
        value: { type: String, required: true },
        priceModifier: { type: Number, default: 0 },
    },
    { _id: false },
);

const variantGroupSchema = new Schema<IVariantGroup>(
    {
        name: { type: String, required: true },
        key: { type: String, required: true },
        options: { type: [variantOptionSchema], default: [] },
    },
    { _id: false },
);

const specificationSchema = new Schema<ISpecification>(
    {
        group: { type: String, required: true },
        label: { type: String, required: true },
        value: { type: String, required: true },
    },
    { _id: false },
);

const emiPlanSchema = new Schema<IEmiPlan>(
    {
        planId: { type: String, required: true },
        tenureMonths: { type: Number, required: true },
        interestRate: { type: Number, required: true },
        isNoCostEmi: { type: Boolean, default: false },
        monthlyAmount: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        cashback: { type: Number, default: 0 },
        recommended: { type: Boolean, default: false },
    },
    { _id: false },
);

interface IPopulatedCategoryRef {
    _id?: Types.ObjectId | string;
    id?: string;
    name?: string;
    slug?: string;
}

const productSchema = new Schema<IProductDocument>(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: [true, 'Product slug is required'],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        brand: {
            type: String,
            required: [true, 'Brand is required'],
            trim: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        shortDescription: {
            type: String,
            required: [true, 'Short description is required'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: 0,
        },
        originalPrice: {
            type: Number,
            required: [true, 'Original price is required'],
            min: 0,
        },
        discountPercentage: {
            type: Number,
            default: 0,
        },
        images: {
            type: [productImageSchema],
            default: [],
        },
        variants: {
            type: [variantGroupSchema],
            default: [],
        },
        specifications: {
            type: [specificationSchema],
            default: [],
        },
        emiPlans: {
            type: [emiPlanSchema],
            default: [],
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

                const category = json.category;
                if (category && typeof category === 'object') {
                    const populated = category as IPopulatedCategoryRef;
                    const categoryId = populated.id ?? populated._id?.toString();
                    if (categoryId) {
                        json.category = {
                            id: categoryId,
                            name: populated.name,
                            slug: populated.slug,
                        };
                    }
                } else if (category) {
                    json.category = (category as Types.ObjectId).toString();
                }

                return json;
            },
        },
    },
);

// Recalculates the product's discount percentage from price/originalPrice before saving
productSchema.pre('save', function preSave(next) {
    if (this.originalPrice > this.price) {
        this.discountPercentage = Math.round(
            ((this.originalPrice - this.price) / this.originalPrice) * 100,
        );
    } else {
        this.discountPercentage = 0;
    }
    next();
});

// Mongoose model for the Product collection, built from productSchema
export const ProductModel: Model<IProductDocument> = model<IProductDocument>(
    'Product',
    productSchema,
);
