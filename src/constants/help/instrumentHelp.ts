export const INSTRUMENT_HELP = {
  section:
    'The type of digital asset or token you plan to issue. Different instruments have different regulatory classifications and requirements.',

  types: {
    stablecoin: {
      title: 'Stablecoin',
      description:
        'A digital currency designed to maintain a stable value by pegging to a reserve asset like USD, EUR, or gold.',
      regulatory:
        'Subject to MiCA (EU), state money transmitter laws (US), and payment regulations. May require e-money or banking licenses.',
      examples: 'USDC, USDT, DAI',
    },
    security_token: {
      title: 'Security Token',
      description:
        'A tokenized representation of ownership in an asset, similar to traditional securities like stocks or bonds.',
      regulatory:
        'Treated as securities under most jurisdictions. Requires prospectus/registration or exemption qualification.',
      examples: 'Tokenized equity, tokenized bonds, REITs on blockchain',
    },
    utility_token: {
      title: 'Utility Token',
      description:
        'A token that provides access to a specific product, service, or platform functionality.',
      regulatory:
        'May avoid securities classification if purely functional. MiCA provides specific regime for utility tokens in EU.',
      examples: 'Access tokens, in-app currencies, service credits',
    },
    governance_token: {
      title: 'Governance Token',
      description:
        'A token granting voting rights in protocol decisions, often used in DAOs and DeFi protocols.',
      regulatory:
        'Classification depends on economic rights attached. May be securities if profit expectations exist.',
      examples: 'UNI, AAVE, MKR',
    },
    nft: {
      title: 'NFT (Non-Fungible Token)',
      description:
        'A unique digital token representing ownership of a specific digital or physical asset.',
      regulatory:
        'Generally unregulated unless fractional or representing financial instruments. Some jurisdictions imposing AML requirements.',
      examples: 'Digital art, collectibles, event tickets',
    },
    lp_token: {
      title: 'LP Token (Liquidity Provider)',
      description:
        'A token representing a share in a liquidity pool, issued when providing liquidity to a decentralized exchange.',
      regulatory:
        'May be classified as securities or collective investment schemes. DeFi-specific regulations emerging.',
      examples: 'Uniswap LP tokens, Curve LP tokens',
    },
  },
} as const;

export type InstrumentHelpKey = keyof typeof INSTRUMENT_HELP.types;
