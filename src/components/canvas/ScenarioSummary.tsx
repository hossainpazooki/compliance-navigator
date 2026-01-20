import { useMemo } from 'react';
import { Badge } from '@/components/shared';
import { JURISDICTIONS, INSTRUMENT_TYPES, ACTIVITY_TYPES, INVESTOR_TYPES } from '@/constants';
import type { JurisdictionCode, InstrumentType, ActivityType, InvestorType } from '@/types/common';
import { cn } from '@/utils';

interface ScenarioSummaryProps {
  issuerJurisdiction: JurisdictionCode;
  targetJurisdictions: JurisdictionCode[];
  instrumentType: InstrumentType | string;
  activity: ActivityType | string;
  investorTypes: InvestorType[];
  amount: number;
  missingFacts?: string[];
  isStale?: boolean;
  onExpand?: () => void;
}

/**
 * ScenarioSummary - Collapsed state summary for the left rail
 * Shows: "Home: US, Targets: EU, UK, CH | NFT • Secondary | Retail + Accredited | $5,000,000"
 */
export function ScenarioSummary({
  issuerJurisdiction,
  targetJurisdictions,
  instrumentType,
  activity,
  investorTypes,
  amount,
  missingFacts = [],
  isStale = false,
  onExpand,
}: ScenarioSummaryProps) {
  const issuerLabel = useMemo(() => {
    return JURISDICTIONS.find((j) => j.code === issuerJurisdiction)?.code || issuerJurisdiction;
  }, [issuerJurisdiction]);

  const targetLabels = useMemo(() => {
    return targetJurisdictions
      .map((code) => JURISDICTIONS.find((j) => j.code === code)?.code || code)
      .join(', ');
  }, [targetJurisdictions]);

  const instrumentLabel = useMemo(() => {
    return INSTRUMENT_TYPES.find((i) => i.value === instrumentType)?.label || instrumentType;
  }, [instrumentType]);

  const activityLabel = useMemo(() => {
    return ACTIVITY_TYPES.find((a) => a.value === activity)?.label || activity;
  }, [activity]);

  const investorLabels = useMemo(() => {
    return investorTypes
      .map((type) => INVESTOR_TYPES.find((i) => i.value === type)?.label || type)
      .join(' + ');
  }, [investorTypes]);

  const formattedAmount = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  }, [amount]);

  return (
    <div
      className={cn(
        'cursor-pointer space-y-2 p-4 transition-colors hover:bg-slate-800/50',
        isStale && 'border-l-2 border-l-amber-500'
      )}
      onClick={onExpand}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onExpand?.()}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Scenario
        </span>
        {isStale && (
          <Badge variant="warning" size="sm">
            Stale
          </Badge>
        )}
      </div>

      {/* Jurisdictions */}
      <div className="text-sm">
        <span className="text-slate-400">Home:</span>{' '}
        <span className="font-medium text-white">{issuerLabel}</span>
      </div>
      <div className="text-sm">
        <span className="text-slate-400">Targets:</span>{' '}
        <span className="font-medium text-white">{targetLabels || 'None'}</span>
      </div>

      {/* Instrument & Activity */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-emerald-400">{instrumentLabel}</span>
        <span className="text-slate-600">•</span>
        <span className="font-medium text-purple-400">{activityLabel}</span>
      </div>

      {/* Investors */}
      <div className="text-sm text-slate-300">{investorLabels || 'No investors selected'}</div>

      {/* Amount */}
      <div className="text-sm">
        <span className="font-medium text-amber-400">{formattedAmount}</span>
      </div>

      {/* Missing facts indicator */}
      {missingFacts.length > 0 && (
        <div className="mt-2 flex items-center gap-1 text-xs text-red-400">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Missing facts: {missingFacts.length}</span>
        </div>
      )}

      {/* Expand hint */}
      <div className="flex items-center justify-center pt-2">
        <svg
          className="h-4 w-4 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
