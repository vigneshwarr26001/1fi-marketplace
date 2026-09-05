'use client';

// region Imports

// Import Package
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

// Import Providers
import { useAuthContext } from '@/providers/AuthProvider';

// endregion

export interface ILoginVariables {
    email: string;
    password: string;
}

// Logs a user in with email/password via the auth context
export function useLogin(): UseMutationResult<void, Error, ILoginVariables> {
    const { login } = useAuthContext();

    return useMutation({
        mutationFn: async ({ email, password }: ILoginVariables) => {
            // Authenticates the user and updates the shared auth state
            await login(email, password);
        },
    });
}
