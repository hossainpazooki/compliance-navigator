export { INSTRUMENT_HELP } from './instrumentHelp';
export type { InstrumentHelpKey } from './instrumentHelp';

export { ACTIVITY_HELP } from './activityHelp';
export type { ActivityHelpKey } from './activityHelp';

export { INVESTOR_HELP } from './investorHelp';
export type { InvestorHelpKey } from './investorHelp';

// Section-level help text for form labels
export const SECTION_HELP = {
  issuerJurisdiction:
    'Where your company is legally incorporated or where the token issuer is based. This determines your "home" regulatory regime.',
  targetMarkets:
    'The jurisdictions where you plan to offer, market, or sell your tokens. Each selected market adds its regulatory requirements to your compliance pathway.',
  instrumentType:
    'The type of digital asset or token you plan to issue. Classification affects which regulations apply.',
  activityType:
    'Your primary business activity with the token. Different activities require different licenses.',
  investorTypes:
    'Who you plan to sell to. Retail investors require more protections than professional/institutional.',
  amount:
    'Total value of the offering. Certain thresholds trigger additional requirements (e.g., EUR 8M in EU).',
} as const;
