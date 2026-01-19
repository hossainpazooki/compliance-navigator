export const INVESTOR_HELP = {
  section:
    'The types of investors you plan to target. Investor classification significantly affects regulatory requirements and available exemptions.',

  types: {
    retail: {
      title: 'Retail Investors',
      description:
        'Individual, non-professional investors. The broadest category with the most regulatory protection.',
      regulatory:
        'Highest level of investor protection required. Prospectus requirements, suitability assessments, and cooling-off periods may apply.',
      implications: [
        'Full prospectus typically required',
        'Clear risk warnings mandatory',
        'Suitability assessments needed',
        'Marketing restrictions apply',
      ],
    },
    professional: {
      title: 'Professional Investors',
      description:
        'Investors meeting specific criteria (assets, experience, or knowledge) who can be treated as sophisticated.',
      regulatory:
        'Reduced disclosure requirements in many jurisdictions. MiFID II professional client rules apply in EU.',
      criteria: [
        'Balance sheet > EUR 20M (entities)',
        'Net turnover > EUR 40M (entities)',
        'Professional experience in finance',
        'Opt-in procedure for retail seeking professional status',
      ],
    },
    institutional: {
      title: 'Institutional Investors',
      description:
        'Large financial institutions, pension funds, insurance companies, and similar entities.',
      regulatory:
        'Minimal retail protection requirements. Focus shifts to systemic risk and prudential requirements.',
      examples: [
        'Banks and credit institutions',
        'Investment funds and asset managers',
        'Pension funds',
        'Insurance companies',
      ],
    },
    accredited: {
      title: 'Accredited Investors (US)',
      description:
        'US-specific classification for investors meeting SEC wealth or income thresholds.',
      regulatory:
        'Eligible for Regulation D exemptions. State-level requirements may still apply.',
      criteria: [
        'Net worth > $1M (excluding primary residence)',
        'Income > $200K individual / $300K joint for 2 years',
        'Certain financial professionals',
        'Knowledgeable employees of private funds',
      ],
    },
  },
} as const;

export type InvestorHelpKey = keyof typeof INVESTOR_HELP.types;
