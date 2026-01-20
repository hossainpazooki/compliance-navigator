/**
 * Custom React Query hook for deterministic evaluations.
 *
 * Droit pattern: Decision evaluation is deterministic - same inputs always
 * produce same outputs. Use staleTime: Infinity to never refetch for the
 * same query key.
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

/**
 * Hook for deterministic queries that should never be refetched for the same inputs.
 *
 * Use this for:
 * - Decision tree evaluations
 * - Rule lookups
 * - Any pure function that produces the same output for the same input
 *
 * @example
 * const { data: result } = useEvaluationQuery(
 *   ['evaluation', ruleId, facts],
 *   () => evaluateTree(rule, facts)
 * );
 */
export function useEvaluationQuery<TData, TError = Error>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn' | 'staleTime' | 'gcTime'>
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    // Droit pattern: deterministic evaluations never become stale
    staleTime: Infinity,
    // Keep in garbage collection for 30 minutes
    gcTime: 1000 * 60 * 30,
    // Enable structural sharing for efficient re-renders
    structuralSharing: true,
    ...options,
  });
}
