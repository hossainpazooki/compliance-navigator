import type { ExplanationTier, RiskLevel } from './common';

/** Droit pattern: distinguish grounded (from rule path) vs inferred (LLM reasoning) */
export type ConfidenceLevel = 'grounded' | 'inferred';

// Citation in explanation
export interface Citation {
  id: string;
  framework: string;
  reference: string;
  full_reference: string;
  text: string;
  url?: string;
  effective_date?: string;
  relevance: 'primary' | 'supporting' | 'contextual';
  relevance_score: number;
}

// Structured explanation content
export interface Explanation {
  headline: string;
  body: string;
  conditions: string[];
  warnings: string[];
}

// Explanation summary metadata
export interface ExplanationSummary {
  status: string;
  confidence: number;
  /** Droit pattern: 'grounded' = from rule traversal, 'inferred' = LLM reasoning */
  confidence_level: ConfidenceLevel;
  primary_framework: string;
  risk_level: RiskLevel;
}

// Audit information
export interface AuditInfo {
  trace_id?: string;
  rules_evaluated: number;
  processing_time_ms: number;
  template_id?: string;
  model_version: string;
}

// Request to /decoder/explain/inline
export interface InlineDecisionRequest {
  instrument_type?: string;
  activity?: string;
  jurisdiction?: string;
  authorized?: boolean;
  actor_type?: string;
  issuer_type?: string;
  is_credit_institution?: boolean;
  is_authorized_institution?: boolean;
  reference_asset?: string;
  is_significant?: boolean;
  reserve_value_eur?: number;
  extra?: Record<string, unknown>;
  rule_id?: string;
  tier: ExplanationTier;
  include_citations: boolean;
}

// Full decoder response
export interface DecoderResponse {
  explanation_id: string;
  decision_id: string;
  tier: ExplanationTier;
  generated_at: string;
  summary: ExplanationSummary;
  explanation: Explanation;
  citations: Citation[];
  audit: AuditInfo;
}
