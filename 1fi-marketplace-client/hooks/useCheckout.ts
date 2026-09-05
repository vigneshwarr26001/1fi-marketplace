'use client';

// region Imports

// Import Package
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

// Import Services
import { createCheckout } from '@/services/checkout.service';

// Import Types
import type { ICheckoutData, ICheckoutRequest } from '@/types/checkout.types';

// endregion

// Submits a checkout request and returns the created checkout data
export function useCheckout(): UseMutationResult<ICheckoutData, Error, ICheckoutRequest> {
    return useMutation({
        mutationFn: async (payload: ICheckoutRequest) => {
            // Creates a checkout order via the API
            const response = await createCheckout(payload);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response.data;
        },
    });
}
