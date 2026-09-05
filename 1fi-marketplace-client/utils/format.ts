// Formats a numeric rupee amount as a localized INR currency string
export function formatCurrency(amountInRupees: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amountInRupees);
}

// Formats an ISO date string into a localized short date (e.g. "04 Sep 2026")
export function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(iso));
}
