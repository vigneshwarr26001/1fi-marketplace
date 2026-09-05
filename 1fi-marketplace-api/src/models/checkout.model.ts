// region Imports

// Import Package
import { Schema, model, Model, Types } from 'mongoose';

// Import Interfaces
import {
    ICheckoutDocument,
    ISelectedVariant,
    ISelectedEmiPlan,
} from '@/interfaces/checkout.interface';

// endregion

interface IPopulatedRef {
    _id?: Types.ObjectId | string;
}

const selectedVariantSchema = new Schema<ISelectedVariant>(
    {
        groupKey: { type: String, required: true },
        optionValue: { type: String, required: true },
    },
    { _id: false },
);

const selectedEmiPlanSchema = new Schema<ISelectedEmiPlan>(
    {
        planId: { type: String, required: true },
        tenureMonths: { type: Number, required: true },
        interestRate: { type: Number, required: true },
        isNoCostEmi: { type: Boolean, required: true },
    },
    { _id: false },
);

const checkoutSchema = new Schema<ICheckoutDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product is required'],
        },
        selectedVariants: {
            type: [selectedVariantSchema],
            default: [],
        },
        selectedEmiPlan: {
            type: selectedEmiPlanSchema,
            required: [true, 'Selected EMI plan is required'],
        },
        productPrice: {
            type: Number,
            required: [true, 'Product price is required'],
            min: 0,
        },
        monthlyEmi: {
            type: Number,
            required: [true, 'Monthly EMI is required'],
            min: 0,
        },
        totalPayable: {
            type: Number,
            required: [true, 'Total payable is required'],
            min: 0,
        },
        status: {
            type: String,
            enum: ['INITIATED', 'PENDING', 'CONFIRMED', 'CANCELLED'],
            default: 'INITIATED',
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

                const userId = json.userId;
                if (userId && typeof userId === 'object') {
                    const populated = userId as IPopulatedRef;
                    json.userId = (populated._id ?? userId).toString();
                } else if (userId) {
                    json.userId = (userId as Types.ObjectId).toString();
                }

                const productId = json.productId;
                if (productId && typeof productId === 'object') {
                    const populated = productId as IPopulatedRef;
                    json.productId = (populated._id ?? productId).toString();
                } else if (productId) {
                    json.productId = (productId as Types.ObjectId).toString();
                }

                return json;
            },
        },
    },
);

// Mongoose model for the Checkout collection, built from checkoutSchema
export const CheckoutModel: Model<ICheckoutDocument> = model<ICheckoutDocument>(
    'Checkout',
    checkoutSchema,
);
