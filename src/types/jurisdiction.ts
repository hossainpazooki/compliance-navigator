import type {
  JurisdictionCode,
  JurisdictionRole,
  ConflictType,
  ConflictSeverity,
  InstrumentType,
  ActivityType,
} from './common';

// Request to resolve applicable jurisdictions
export interface JurisdictionResolveRequest {
  issuer_jurisdiction: JurisdictionCode;
  target_jurisdictions: JurisdictionCode[];
  instrument_type: InstrumentType | string;
  activity: ActivityType | string;
  facts?: Record<string, unknown>;
}

// Resolved jurisdiction with applicable regime
export interface ResolvedJurisdiction {
  jurisdiction: JurisdictionCode;
  regime_id: string;
  role: JurisdictionRole;
  applicable: boolean;
  reason?: string;
}

// Response from /jurisdiction/resolve
export interface JurisdictionResolveResponse {
  resolved: ResolvedJurisdiction[];
  primary_jurisdiction: JurisdictionCode;
  passporting_available: boolean;
  third_country_rules_apply: boolean;
}

// Request to detect conflicts
export interface JurisdictionConflictsRequest {
  jurisdictions: JurisdictionCode[];
  instrument_type: InstrumentType | string;
  activity: ActivityType | string;
  include_resolved?: boolean;
}

// Conflict detected between jurisdictions
export interface JurisdictionConflict {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  jurisdictions: JurisdictionCode[];
  description: string;
  rule_ids: string[];
  resolution_strategy: 'cumulative' | 'stricter' | 'home_jurisdiction' | 'satisfy_both' | 'earliest';
  resolution_note?: string;
  resolvable: boolean;
}

// Response from /jurisdiction/conflicts
export interface JurisdictionConflictsResponse {
  conflicts: JurisdictionConflict[];
  blocking_count: number;
  warning_count: number;
  all_resolvable: boolean;
}

// Request for compliance pathways
export interface JurisdictionPathwaysRequest {
  issuer_jurisdiction: JurisdictionCode;
  target_jurisdictions: JurisdictionCode[];
  instrument_type: InstrumentType | string;
  activity: ActivityType | string;
  facts?: Record<string, unknown>;
}

// Pathway prerequisite
export interface PathwayPrerequisite {
  id: string;
  description: string;
  jurisdiction: JurisdictionCode;
  met: boolean;
}

// Single pathway option
export interface CompliancePathway {
  pathway_id: string;
  name: string;
  description: string;
  jurisdictions: JurisdictionCode[];
  steps: PathwayStepDetail[];
  prerequisites: PathwayPrerequisite[];
  estimated_days: { min: number; max: number };
  complexity: 'low' | 'medium' | 'high';
  recommended: boolean;
}

// Detailed step in a pathway
export interface PathwayStepDetail {
  step_id: string;
  order: number;
  jurisdiction: JurisdictionCode;
  action: string;
  description: string;
  dependencies: string[];
  timeline_days: { min: number; max: number };
  documents_required: string[];
  authority: string;
}

// Response from /jurisdiction/pathways
export interface JurisdictionPathwaysResponse {
  pathways: CompliancePathway[];
  recommended_pathway_id: string | null;
  passporting_pathway_available: boolean;
  third_country_pathway_available: boolean;
}
