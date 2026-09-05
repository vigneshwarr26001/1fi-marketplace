// region Imports

// Import Package
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

// endregion

// Merges conditional class names and resolves conflicting Tailwind classes
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
