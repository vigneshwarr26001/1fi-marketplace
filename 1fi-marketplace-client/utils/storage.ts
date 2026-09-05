// region Imports

// Import Types
import type { IUser } from '@/types/auth.types';

// endregion

const ACCESS_TOKEN_KEY = '1fi_access_token';
const USER_KEY = '1fi_user';
const SELECTION_KEY = '1fi_selection';

export interface IStoredSelection {
    productSlug: string;
    selectedVariants: { groupKey: string; optionValue: string }[];
    selectedPlanId: string;
}

// Reads the persisted access token from local storage, if any
export function getAccessToken(): string | null {
    if (typeof window === 'undefined') {
        return null;
    }
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

// Persists the access token to local storage
export function setAccessToken(token: string): void {
    if (typeof window === 'undefined') {
        return;
    }
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

// Removes the persisted access token from local storage
export function clearAccessToken(): void {
    if (typeof window === 'undefined') {
        return;
    }
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Reads and parses the persisted user object from local storage, if any
export function getStoredUser(): IUser | null {
    if (typeof window === 'undefined') {
        return null;
    }
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw) as IUser;
    } catch {
        return null;
    }
}

// Persists the user object to local storage as JSON
export function setStoredUser(user: IUser): void {
    if (typeof window === 'undefined') {
        return;
    }
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Removes the persisted user object from local storage
export function clearStoredUser(): void {
    if (typeof window === 'undefined') {
        return;
    }
    window.localStorage.removeItem(USER_KEY);
}

// Persists the current checkout selection to session storage as JSON
export function saveSelection(selection: IStoredSelection): void {
    if (typeof window === 'undefined') {
        return;
    }
    window.sessionStorage.setItem(SELECTION_KEY, JSON.stringify(selection));
}

// Reads and parses the persisted checkout selection from session storage, if any
export function getSelection(): IStoredSelection | null {
    if (typeof window === 'undefined') {
        return null;
    }
    const raw = window.sessionStorage.getItem(SELECTION_KEY);
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw) as IStoredSelection;
    } catch {
        return null;
    }
}

// Removes the persisted checkout selection from session storage
export function clearSelection(): void {
    if (typeof window === 'undefined') {
        return;
    }
    window.sessionStorage.removeItem(SELECTION_KEY);
}
