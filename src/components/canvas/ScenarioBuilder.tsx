import { useScenarioForm } from '@/hooks/useScenarioForm';
import { usePanelState } from '@/hooks/useCanvas';
import { Button, Tooltip, HelpIcon } from '@/components/shared';
import {
  SingleJurisdictionSelector,
  JurisdictionSelector,
} from '@/components/forms/JurisdictionSelector';
import { INSTRUMENT_TYPES, ACTIVITY_TYPES, INVESTOR_TYPES, SECTION_HELP } from '@/constants';
import { CollapsibleSection } from './CollapsibleSection';
import { ScenarioSummary } from './ScenarioSummary';
import { cn } from '@/utils';

function SectionLabel({ label, helpText }: { label: string; helpText?: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      {helpText && (
        <Tooltip content={helpText}>
          <HelpIcon />
        </Tooltip>
      )}
    </div>
  );
}

interface ScenarioBuilderProps {
  className?: string;
}

/**
 * ScenarioBuilder - Compact form for the left rail
 * Displays as ScenarioSummary when collapsed, full form when expanded
 */
export function ScenarioBuilder({ className }: ScenarioBuilderProps) {
  const { form, handlers, canSubmit, isPending, isStale, missingFacts, handleSubmit } =
    useScenarioForm();
  const { isExpanded, expandPanel } = usePanelState();

  const panelExpanded = isExpanded('leftRail');
  const handleExpand = () => expandPanel('leftRail');

  // Show summary in collapsed state
  if (!panelExpanded) {
    return (
      <div className={className}>
        <ScenarioSummary
          issuerJurisdiction={form.issuerJurisdiction}
          targetJurisdictions={form.targetJurisdictions}
          instrumentType={form.instrumentType}
          activity={form.activity}
          investorTypes={form.investorTypes}
          amount={form.amount}
          missingFacts={missingFacts}
          isStale={isStale}
          onExpand={handleExpand}
        />
        <div className="px-4 pb-4">
          <Button
            onClick={handleSubmit}
            isLoading={isPending}
            disabled={!canSubmit}
            className={cn('w-full', isStale && 'animate-pulse bg-amber-600 hover:bg-amber-500')}
          >
            {isStale ? 'Run Analysis' : 'Run'}
          </Button>
        </div>
      </div>
    );
  }

  // Full form in expanded state
  return (
    <div className={cn('flex h-full flex-col', className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex-1 overflow-y-auto"
      >
        <div className="space-y-5 p-4">
          {/* Issuer Jurisdiction */}
          <div>
            <SectionLabel label="Issuer Home" helpText={SECTION_HELP.issuerJurisdiction} />
            <SingleJurisdictionSelector
              selected={form.issuerJurisdiction}
              onChange={handlers.setIssuerJurisdiction}
            />
          </div>

          {/* Target Jurisdictions */}
          <div>
            <SectionLabel label="Target Markets" helpText={SECTION_HELP.targetMarkets} />
            <JurisdictionSelector
              selected={form.targetJurisdictions}
              onChange={handlers.toggleTargetJurisdiction}
              disabledJurisdictions={[form.issuerJurisdiction]}
            />
          </div>

          {/* Instrument Type */}
          <div>
            <SectionLabel label="Instrument" helpText={SECTION_HELP.instrumentType} />
            <div className="grid grid-cols-2 gap-2">
              {INSTRUMENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handlers.setInstrumentType(type.value)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border p-2 text-left text-sm transition-all',
                    form.instrumentType === type.value
                      ? 'border-emerald-500 bg-emerald-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                  )}
                >
                  <span>{type.icon}</span>
                  <span className="font-medium text-white">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Type */}
          <div>
            <SectionLabel label="Activity" helpText={SECTION_HELP.activityType} />
            <div className="grid grid-cols-2 gap-2">
              {ACTIVITY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handlers.setActivity(type.value)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border p-2 text-left text-sm transition-all',
                    form.activity === type.value
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                  )}
                >
                  <span>{type.icon}</span>
                  <span className="font-medium text-white">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Investor Types */}
          <div>
            <SectionLabel label="Investors" helpText={SECTION_HELP.investorTypes} />
            <div className="grid grid-cols-2 gap-2">
              {INVESTOR_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handlers.toggleInvestorType(type.value)}
                  className={cn(
                    'rounded-lg border p-2 text-center text-sm transition-all',
                    form.investorTypes.includes(type.value)
                      ? 'border-cyan-500 bg-cyan-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                  )}
                >
                  <span className="mb-1 block">{type.icon}</span>
                  <span className="font-medium text-white">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <SectionLabel label="Amount (USD)" helpText={SECTION_HELP.amount} />
            <input
              type="number"
              value={form.amount}
              onChange={(e) => handlers.setAmount(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              placeholder="5000000"
            />
            <p className="mt-1 text-xs text-slate-500">
              {form.amount >= 8000000
                ? '€8M+ threshold applies'
                : form.amount >= 1000000
                  ? 'Standard requirements'
                  : 'Simplified requirements may apply'}
            </p>
          </div>
        </div>

        {/* Advanced Facts Section */}
        <CollapsibleSection title="Advanced Facts" icon="⚙️" badge={0}>
          <p className="text-xs text-slate-500">
            Additional facts for complex scenarios will appear here.
          </p>
        </CollapsibleSection>

        {/* Assumptions Section */}
        <CollapsibleSection title="Assumptions" icon="💡" badge={3}>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between rounded bg-slate-800 px-2 py-1">
              <span className="text-slate-400">Token is fungible</span>
              <span className="text-emerald-400">✓ Assumed</span>
            </div>
            <div className="flex items-center justify-between rounded bg-slate-800 px-2 py-1">
              <span className="text-slate-400">No existing exemptions</span>
              <span className="text-emerald-400">✓ Assumed</span>
            </div>
            <div className="flex items-center justify-between rounded bg-slate-800 px-2 py-1">
              <span className="text-slate-400">Cross-border offering</span>
              <span className="text-emerald-400">✓ Assumed</span>
            </div>
          </div>
        </CollapsibleSection>

        {/* Submit button sticky at bottom */}
        <div className="sticky bottom-0 border-t border-slate-700 bg-slate-900 p-4">
          {missingFacts.length > 0 && (
            <p className="mb-2 text-xs text-red-400">
              Missing: {missingFacts.join(', ')}
            </p>
          )}
          <Button
            type="submit"
            isLoading={isPending}
            disabled={!canSubmit}
            className={cn('w-full', isStale && 'animate-pulse bg-amber-600 hover:bg-amber-500')}
          >
            {isPending ? 'Running...' : isStale ? 'Run Analysis' : 'Run Cross-Border Analysis'}
          </Button>
        </div>
      </form>
    </div>
  );
}
