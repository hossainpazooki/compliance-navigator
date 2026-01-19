export const ACTIVITY_HELP = {
  section:
    'The primary business activity you plan to conduct. This determines which licenses and regulatory frameworks apply.',

  types: {
    public_offer: {
      title: 'Public Offering',
      description:
        'Offering tokens to the general public, including retail investors. No minimum investment threshold.',
      regulatory:
        'Typically requires prospectus/whitepaper approval, investor protections, and marketing restrictions. Most heavily regulated.',
      requirements: [
        'Prospectus or whitepaper',
        'Regulatory approval before offering',
        'Investor suitability checks',
        'Marketing compliance',
      ],
    },
    private_placement: {
      title: 'Private Placement',
      description:
        'Offering tokens to a limited number of qualified, professional, or institutional investors only.',
      regulatory:
        'Exemption from public offering requirements in most jurisdictions. Still subject to AML/KYC and certain disclosure requirements.',
      requirements: [
        'Investor qualification verification',
        'Investment minimums (varies by jurisdiction)',
        'Limited marketing restrictions',
        'Resale restrictions',
      ],
    },
    trading: {
      title: 'Secondary Trading',
      description:
        'Operating a platform or service for secondary market trading of tokens between users.',
      regulatory:
        'Exchange/trading platform licenses required. Subject to market manipulation rules, order book requirements, and custody rules.',
      requirements: [
        'Exchange/MTF license',
        'Market surveillance systems',
        'Order handling rules',
        'Best execution obligations',
      ],
    },
    custody: {
      title: 'Custody',
      description:
        'Providing safekeeping and management services for third-party digital assets.',
      regulatory:
        'Custody licenses required in most jurisdictions. Subject to asset segregation, insurance, and operational resilience requirements.',
      requirements: [
        'Custody authorization',
        'Asset segregation',
        'Insurance coverage',
        'Disaster recovery',
      ],
    },
    staking: {
      title: 'Staking',
      description:
        'Offering proof-of-stake validation services, allowing users to earn rewards by locking their tokens.',
      regulatory:
        'Emerging regulation varies by jurisdiction. May be classified as collective investment or unregulated depending on service structure.',
      requirements: [
        'Clear fee disclosure',
        'Risk disclosure (slashing)',
        'Possibly collective investment rules',
        'AML/KYC for users',
      ],
    },
    lending: {
      title: 'DeFi Lending',
      description:
        'Providing crypto lending and borrowing services, either centralized (CeFi) or through smart contracts (DeFi).',
      regulatory:
        'Heavily scrutinized post-2022 collapses. May require lending licenses, consumer credit rules, and disclosure requirements.',
      requirements: [
        'Lending/credit license (CeFi)',
        'Interest rate disclosures',
        'Collateral management rules',
        'Consumer protection compliance',
      ],
    },
  },
} as const;

export type ActivityHelpKey = keyof typeof ACTIVITY_HELP.types;
