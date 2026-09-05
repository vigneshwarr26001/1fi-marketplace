// region Imports

// Import Package
import bcrypt from 'bcryptjs';
import { Schema, model, Model, Types } from 'mongoose';

// Import Interfaces
import { IUserDocument } from '@/interfaces/user.interface';

// endregion

const SALT_ROUNDS = 10;

const userSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
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
                delete json.password;
                return json;
            },
        },
    },
);

// Hashes the user's password with bcrypt before saving, only when it has changed
userSchema.pre('save', async function preSave(next) {
    if (!this.isModified('password')) {
        next();
        return;
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compares a plaintext candidate password against this user's stored password hash
userSchema.methods.comparePassword = async function comparePassword(
    candidate: string,
): Promise<boolean> {
    return bcrypt.compare(candidate, this.password);
};

// Mongoose model for the User collection, built from userSchema
export const UserModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema);
