'use client';

// region Imports

// Import Package
import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';

// Import Icons
import { Search } from 'lucide-react';

// Import Utils
import { cn } from '@/utils/cn';

// endregion

export interface SearchBarProps {
    value?: string;
    placeholder?: string;
    debounceMs?: number;
    onChange: (value: string) => void;
    className?: string;
}

// Renders a debounced search input that mirrors an external value and only calls
// onChange after typing pauses for debounceMs
export function SearchBar({
    value = '',
    placeholder = 'Search products…',
    debounceMs = 400,
    onChange,
    className,
}: SearchBarProps): ReactNode {
    const [internalValue, setInternalValue] = useState<string>(value);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Updates the input's local value immediately and schedules the debounced onChange call
    function handleChange(event: ChangeEvent<HTMLInputElement>): void {
        const nextValue = event.target.value;
        setInternalValue(nextValue);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            onChange(nextValue);
        }, debounceMs);
    }

    return (
        <div className={cn('relative', className)}>
            <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
            />
            <input
                type="text"
                value={internalValue}
                onChange={handleChange}
                placeholder={placeholder}
                aria-label="Search products"
                className={cn(
                    'h-10 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
                )}
            />
        </div>
    );
}
