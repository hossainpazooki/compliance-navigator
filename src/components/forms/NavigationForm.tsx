import { useNavigationStore } from '@/stores';
import { useNavigate } from '@/hooks';
import { Button, Tooltip, HelpIcon } from '@/components/shared';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared';
import {
  SingleJurisdictionSelector,
  JurisdictionSelector,
} from './JurisdictionSelector';
import { INSTRUMENT_TYPES, ACTIVITY_TYPES, INVESTOR_TYPES, SECTION_HELP } from '@/constants';
import { cn } from '@/utils';

function SectionLabel({ label, helpText }: { label: string; helpText: string }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <Tooltip content={helpText}>
        <HelpIcon />
      </Tooltip>
    </div>
  );
}

export function NavigationForm() {
  const {
    issuerJurisdiction,
    targetJurisdictions,
    instrumentType,
    activity,
    investorTypes,
    amount,
    setIssuerJurisdiction,
    toggleTargetJurisdiction,
    setInstrumentType,
    setActivity,
    toggleInvestorType,
    setAmount,
  } = useNavigationStore();

  const { navigate, isLoading } = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate();
  };

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Navigation Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issuer Jurisdiction */}
          <div>
            <SectionLabel
              label="Issuer Home Jurisdiction"
              helpText={SECTION_HELP.issuerJurisdiction}
            />
            <SingleJurisdictionSelector
              selected={issuerJurisdiction}
              onChange={setIssuerJurisdiction}
            />
          </div>

          {/* Target Jurisdictions */}
          <div>
            <SectionLabel
              label="Target Markets"
              helpText={SECTION_HELP.targetMarkets}
            />
            <JurisdictionSelector
              selected={targetJurisdictions}
              onChange={toggleTargetJurisdiction}
              disabledJurisdictions={[issuerJurisdiction]}
            />
          </div>

          {/* Instrument Type */}
          <div>
            <SectionLabel
              label="Instrument Type"
              helpText={SECTION_HELP.instrumentType}
            />
            <div className="grid grid-cols-3 gap-2">
              {INSTRUMENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setInstrumentType(type.value)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border p-3 text-left transition-all',
                    instrumentType === type.value
                      ? 'border-emerald-500 bg-emerald-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                  )}
                >
                  <span className="text-lg">{type.icon}</span>
                  <span className="text-sm font-medium text-white">
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Type */}
          <div>
            <SectionLabel
              label="Activity Type"
              helpText={SECTION_HELP.activityType}
            />
            <div className="grid grid-cols-3 gap-2">
              {ACTIVITY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setActivity(type.value)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border p-3 text-left transition-all',
                    activity === type.value
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                  )}
                >
                  <span className="text-lg">{type.icon}</span>
                  <span className="text-sm font-medium text-white">
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Investor Types */}
          <div>
            <SectionLabel
              label="Target Investor Types (select applicable)"
              helpText={SECTION_HELP.investorTypes}
            />
            <div className="grid grid-cols-4 gap-2">
              {INVESTOR_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => toggleInvestorType(type.value)}
                  className={cn(
                    'rounded-lg border p-3 text-center transition-all',
                    investorTypes.includes(type.value)
                      ? 'border-cyan-500 bg-cyan-500/20'
                      : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
                  )}
                >
                  <span className="mb-1 block text-lg">{type.icon}</span>
                  <span className="block text-sm font-medium text-white">
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <SectionLabel
              label="Offering Amount (USD)"
              helpText={SECTION_HELP.amount}
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
              placeholder="5000000"
            />
            <p className="mt-1 text-xs text-slate-500">
              {amount >= 8000000
                ? '€8M+ threshold: Additional requirements may apply'
                : amount >= 1000000
                  ? 'Standard offering requirements'
                  : 'Small offering: Simplified requirements may apply'}
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              disabled={targetJurisdictions.length === 0}
            >
              Run Cross-Border Analysis
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
