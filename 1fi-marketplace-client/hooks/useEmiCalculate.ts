'use client';

// region Imports

// Import Package
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

// Import Services
import { calculateEmi } from '@/services/emi.service';

// Import Types
import type { IEmiCalculateData, IEmiCalculateRequest } from '@/types/emi.types';

// endregion

// Calculates EMI installment details for a given plan/amount selection
export function useEmiCalculate(): UseMutationResult<
    IEmiCalculateData,
    Error,
    IEmiCalculateRequest
> {
    return useMutation({
        mutationFn: async (payload: IEmiCalculateRequest) => {
            // Requests EMI calculation results from the API
            const response = await calculateEmi(payload);
            if (!response.success) {
                throw new Error(response.message);
            }
            return response.data;
        },
    });
}
