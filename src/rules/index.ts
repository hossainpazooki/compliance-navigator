import type { RuleDefinition } from '@/types/decisionTree';
import micaStablecoin from './mica-stablecoin.json';

// Type assertion for JSON imports
export const MICA_STABLECOIN_RULE = micaStablecoin as unknown as RuleDefinition;

// Rule registry for easy lookup
export const RULES: Record<string, RuleDefinition> = {
  'mica-stablecoin-auth': MICA_STABLECOIN_RULE,
};

/**
 * Get a rule by ID
 */
export function getRule(ruleId: string): RuleDefinition | undefined {
  return RULES[ruleId];
}

/**
 * Get all rules for a jurisdiction
 */
export function getRulesForJurisdiction(jurisdiction: string): RuleDefinition[] {
  return Object.values(RULES).filter(
    (rule) => rule.metadata.jurisdiction === jurisdiction
  );
}

/**
 * Get all available rule IDs
 */
export function getAllRuleIds(): string[] {
  return Object.keys(RULES);
}
