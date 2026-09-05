// region Imports

// Import Package
import { Types } from 'mongoose';

// Import Models
import { UserModel } from '@/models/user.model';

// Import Interfaces
import { IUserDocument } from '@/interfaces/user.interface';

// Import Utils
import { ApiError } from '@/utils/api-error';
import { signAccessToken } from '@/utils/jwt';

// endregion

export interface ILoginResult {
    accessToken: string;
    user: IUserDocument;
}

// Authenticates a user by email/password and returns a signed access token with the user record
export async function login(email: string, password: string): Promise<ILoginResult> {
    // Looks up the user by email, including the normally-hidden password field
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    const accessToken = signAccessToken({
        id: (user._id as Types.ObjectId).toString(),
        email: user.email,
        role: user.role,
    });

    return { accessToken, user };
}

// Fetches the currently authenticated user's profile by id
export async function me(userId: string): Promise<IUserDocument> {
    if (!Types.ObjectId.isValid(userId)) {
        throw ApiError.notFound('User not found');
    }

    // Looks up the user by their primary key
    const user = await UserModel.findById(userId);

    if (!user) {
        throw ApiError.notFound('User not found');
    }

    return user;
}
