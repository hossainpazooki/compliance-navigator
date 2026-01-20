import { FORM_PRESETS, type FormPreset } from '@/constants/formPresets';
import { useNavigationStore } from '@/stores';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared';

interface PresetSelectorProps {
  onSelect?: (preset: FormPreset) => void;
}

export function PresetSelector({ onSelect }: PresetSelectorProps) {
  const {
    setIssuerJurisdiction,
    setInstrumentType,
    setActivity,
    setAmount,
  } = useNavigationStore();

  const handleSelectPreset = (preset: FormPreset) => {
    // Apply preset values to the store
    setIssuerJurisdiction(preset.values.issuerJurisdiction);
    setInstrumentType(preset.values.instrumentType);
    setActivity(preset.values.activity);
    setAmount(preset.values.amount);

    // Clear and set target jurisdictions
    const store = useNavigationStore.getState();
    preset.values.targetJurisdictions.forEach(j => {
      if (!store.targetJurisdictions.includes(j)) {
        store.toggleTargetJurisdiction(j);
      }
    });

    // Clear and set investor types
    preset.values.investorTypes.forEach(t => {
      if (!store.investorTypes.includes(t)) {
        store.toggleInvestorType(t);
      }
    });

    onSelect?.(preset);
  };

  return (
    <Card variant="bordered" className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span>⚡</span>
          Quick Start Presets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-400 mb-4">
          Select a common scenario to pre-fill the form, or configure manually below.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {FORM_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="group flex flex-col items-start rounded-lg border border-slate-600 bg-slate-800/50 p-3 text-left transition-all hover:border-blue-500 hover:bg-blue-500/10"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{preset.icon}</span>
                <span className="text-sm font-medium text-white group-hover:text-blue-300">
                  {preset.name}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">
                {preset.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {preset.values.targetJurisdictions.map((j) => (
                  <span
                    key={j}
                    className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-300"
                  >
                    {j}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
