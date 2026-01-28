import { apiClient } from './client';
import type {
  JurisdictionResolveRequest,
  JurisdictionResolveResponse,
  JurisdictionConflictsRequest,
  JurisdictionConflictsResponse,
  JurisdictionPathwaysRequest,
  JurisdictionPathwaysResponse,
} from '@/types/jurisdiction';

export const jurisdictionApi = {
  /**
   * Resolve applicable jurisdictions for a cross-border scenario.
   * Determines which jurisdictions apply based on issuer location,
   * target markets, and regulatory regime rules.
   */
  async resolve(request: JurisdictionResolveRequest): Promise<JurisdictionResolveResponse> {
    const response = await apiClient.post<JurisdictionResolveResponse>(
      '/jurisdiction/resolve',
      request
    );
    return response.data;
  },

  /**
   * Detect conflicts between jurisdictions for a given activity.
   * Identifies regulatory conflicts, obligation mismatches, and
   * timeline incompatibilities across selected jurisdictions.
   */
  async getConflicts(request: JurisdictionConflictsRequest): Promise<JurisdictionConflictsResponse> {
    const response = await apiClient.post<JurisdictionConflictsResponse>(
      '/jurisdiction/conflicts',
      request
    );
    return response.data;
  },

  /**
   * Generate compliance pathways for cross-border operations.
   * Returns ordered steps, prerequisites, and timeline estimates
   * for achieving compliance across target jurisdictions.
   */
  async getPathways(request: JurisdictionPathwaysRequest): Promise<JurisdictionPathwaysResponse> {
    const response = await apiClient.post<JurisdictionPathwaysResponse>(
      '/jurisdiction/pathways',
      request
    );
    return response.data;
  },
};
