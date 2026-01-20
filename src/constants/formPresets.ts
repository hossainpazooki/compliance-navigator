import type { JurisdictionCode, InstrumentType, ActivityType, InvestorType } from '@/types/common';

export interface FormPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'token' | 'defi' | 'service';
  values: {
    issuerJurisdiction: JurisdictionCode;
    targetJurisdictions: JurisdictionCode[];
    instrumentType: InstrumentType;
    activity: ActivityType;
    investorTypes: InvestorType[];
    amount: number;
  };
}

export const FORM_PRESETS: FormPreset[] = [
  {
    id: 'stablecoin-eu-public',
    name: 'EU Stablecoin Offering',
    icon: '💰',
    description: 'Launch a EUR-pegged stablecoin for retail investors in the EU under MiCA',
    category: 'token',
    values: {
      issuerJurisdiction: 'CH',
      targetJurisdictions: ['EU'],
      instrumentType: 'stablecoin',
      activity: 'public_offer',
      investorTypes: ['retail', 'professional'],
      amount: 10000000,
    },
  },
  {
    id: 'security-token-private',
    name: 'Private Security Token',
    icon: '🔐',
    description: 'Offer tokenized securities to institutional investors across multiple jurisdictions',
    category: 'token',
    values: {
      issuerJurisdiction: 'SG',
      targetJurisdictions: ['EU', 'UK', 'CH'],
      instrumentType: 'security_token',
      activity: 'private_placement',
      investorTypes: ['professional', 'institutional'],
      amount: 50000000,
    },
  },
  {
    id: 'defi-lending-global',
    name: 'DeFi Lending Protocol',
    icon: '🏦',
    description: 'Launch a cross-border DeFi lending service for professional users',
    category: 'defi',
    values: {
      issuerJurisdiction: 'CH',
      targetJurisdictions: ['EU', 'UK', 'SG'],
      instrumentType: 'lp_token',
      activity: 'lending',
      investorTypes: ['professional', 'institutional'],
      amount: 100000000,
    },
  },
  {
    id: 'utility-token-global',
    name: 'Utility Token Launch',
    icon: '🎟️',
    description: 'Launch a utility token for platform access across major markets',
    category: 'token',
    values: {
      issuerJurisdiction: 'SG',
      targetJurisdictions: ['EU', 'UK', 'SG'],
      instrumentType: 'utility_token',
      activity: 'public_offer',
      investorTypes: ['retail', 'professional'],
      amount: 5000000,
    },
  },
  {
    id: 'governance-dao',
    name: 'DAO Governance Token',
    icon: '🗳️',
    description: 'Issue governance tokens for DAO participation',
    category: 'defi',
    values: {
      issuerJurisdiction: 'CH',
      targetJurisdictions: ['EU', 'CH'],
      instrumentType: 'governance_token',
      activity: 'public_offer',
      investorTypes: ['retail', 'professional'],
      amount: 1000000,
    },
  },
  {
    id: 'custody-service',
    name: 'Crypto Custody Service',
    icon: '🔒',
    description: 'Offer institutional crypto custody services in the EU and UK',
    category: 'service',
    values: {
      issuerJurisdiction: 'UK',
      targetJurisdictions: ['EU', 'UK'],
      instrumentType: 'security_token',
      activity: 'custody',
      investorTypes: ['institutional'],
      amount: 0,
    },
  },
];

/**
 * Get presets by category
 */
export function getPresetsByCategory(category: FormPreset['category']): FormPreset[] {
  return FORM_PRESETS.filter(p => p.category === category);
}

/**
 * Get a preset by ID
 */
export function getPresetById(id: string): FormPreset | undefined {
  return FORM_PRESETS.find(p => p.id === id);
}
