'use client';

// region Imports

// Import Package
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

// Import Services
import { loginApi, logoutApi, meApi } from '@/services/auth.service';

// Import Utils
import {
    clearAccessToken,
    clearStoredUser,
    getAccessToken,
    getStoredUser,
    setAccessToken,
    setStoredUser,
} from '@/utils/storage';

// Import Types
import type { IUser } from '@/types/auth.types';

// endregion

interface AuthContextValue {
    user: IUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

// Provides the current user, auth status, and login/logout actions to the component tree,
// hydrating the session from a stored access token on mount
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        async function hydrate(): Promise<void> {
            const token = getAccessToken();
            if (!token) {
                if (isMounted) {
                    setIsLoading(false);
                }
                return;
            }

            const cachedUser = getStoredUser();
            if (cachedUser) {
                if (isMounted) {
                    setUser(cachedUser);
                    setIsLoading(false);
                }
                return;
            }

            try {
                const response = await meApi();
                if (isMounted && response.success) {
                    setUser(response.data.user);
                    setStoredUser(response.data.user);
                } else if (isMounted) {
                    clearAccessToken();
                    clearStoredUser();
                }
            } catch {
                if (isMounted) {
                    clearAccessToken();
                    clearStoredUser();
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void hydrate();

        return () => {
            isMounted = false;
        };
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<void> => {
        const response = await loginApi({ email, password });
        if (!response.success) {
            throw new Error(response.message);
        }
        setAccessToken(response.data.accessToken);
        setStoredUser(response.data.user);
        setUser(response.data.user);
    }, []);

    const logout = useCallback(async (): Promise<void> => {
        try {
            await logoutApi();
        } finally {
            clearAccessToken();
            clearStoredUser();
            setUser(null);
        }
    }, []);

    const value: AuthContextValue = {
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Reads the current auth context, throwing if used outside an AuthProvider
export function useAuthContext(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
