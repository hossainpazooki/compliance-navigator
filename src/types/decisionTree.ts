import type { JurisdictionCode, ComplianceStatus } from './common';
import type { SourceReference } from './navigate';

/**
 * Condition operators (Clojure-style naming)
 * These mirror Clojure predicates for familiarity
 */
export type ConditionOp =
  | 'eq'       // equals
  | 'neq'      // not equals
  | 'gt'       // greater than
  | 'lt'       // less than
  | 'gte'      // greater than or equal
  | 'lte'      // less than or equal
  | 'in'       // value in array
  | 'contains' // array contains value
  | 'matches'  // regex match
  | 'nil?'     // is null/undefined
  | 'some?';   // is not null/undefined

/**
 * A single condition to evaluate against facts
 */
export interface Condition {
  /** Dot-path to the fact: "instrument.type" or "investor.jurisdiction" */
  fact: string;
  /** The comparison operator */
  op: ConditionOp;
  /** The value to compare against */
  value: unknown;
}

/**
 * A condition node in the decision tree (internal node)
 */
export interface ConditionNode {
  nodeId: string;
  type: 'condition';
  condition: Condition;
  /** Optional source reference for regulatory citation */
  sourceRef?: SourceReference;
  /** Human-readable annotation for the condition */
  annotation?: string;
  children: {
    true: DecisionNode;
    false: DecisionNode;
  };
}

/**
 * A leaf node representing a final decision
 */
export interface LeafNode {
  nodeId: string;
  type: 'leaf';
  /** The decision outcome */
  decision: string;
  /** Compliance status this decision results in */
  status: ComplianceStatus;
  /** Obligations triggered by this decision */
  obligations?: string[];
  /** Source reference for regulatory citation */
  sourceRef?: SourceReference;
}

/**
 * A decision tree node (discriminated union)
 */
export type DecisionNode = ConditionNode | LeafNode;

/**
 * A trace of a single condition evaluation
 */
export interface TraceNode {
  nodeId: string;
  /** Human-readable description of the condition */
  condition: string;
  /** The fact path that was evaluated */
  factPath: string;
  /** The actual value of the fact */
  factValue: unknown;
  /** The expected value for comparison */
  expectedValue: unknown;
  /** The operator used */
  op: ConditionOp;
  /** The result of the evaluation */
  result: boolean;
  /** Depth in the tree (for visualization) */
  depth: number;
  /** Source reference if available */
  sourceRef?: SourceReference;
}

/**
 * Complete evaluation trace for a decision
 */
export interface EvaluationTrace {
  ruleId: string;
  ruleVersion: string;
  /** The path of nodes traversed */
  path: TraceNode[];
  /** The final leaf node reached */
  finalNode: LeafNode;
  /** Timestamp of evaluation */
  evaluatedAt: string;
}

/**
 * Metadata for a rule definition
 */
export interface RuleMetadata {
  jurisdiction: JurisdictionCode;
  framework: string;
  effectiveDate: string;
  expiresDate?: string;
  tags?: string[];
}

/**
 * A complete rule definition (JSON format)
 */
export interface RuleDefinition {
  id: string;
  version: string;
  name: string;
  description?: string;
  metadata: RuleMetadata;
  tree: DecisionNode;
}

/**
 * Facts object for evaluation
 */
export type Facts = Record<string, unknown>;

/**
 * Result of evaluating a decision tree
 */
export interface EvaluationResult {
  leaf: LeafNode;
  trace: TraceNode[];
}

/**
 * Result of partial evaluation (when facts are incomplete)
 */
export interface PartialEvaluationResult {
  /** Leaf nodes that are still reachable */
  reachableLeaves: LeafNode[];
  /** Fact paths that are missing */
  missingFacts: string[];
  /** Partial trace up to the missing fact */
  partialTrace: TraceNode[];
}

// Type guards

export function isConditionNode(node: DecisionNode): node is ConditionNode {
  return node.type === 'condition';
}

export function isLeafNode(node: DecisionNode): node is LeafNode {
  return node.type === 'leaf';
}
