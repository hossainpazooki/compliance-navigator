import { cn } from '@/utils';
import { JURISDICTION_LIST } from '@/constants';
import type { JurisdictionCode } from '@/types/common';

interface JurisdictionSelectorProps {
  selected: JurisdictionCode[];
  onChange: (jurisdiction: JurisdictionCode) => void;
  multiple?: boolean;
  label?: string;
  disabledJurisdictions?: JurisdictionCode[];
}

export function JurisdictionSelector({
  selected,
  onChange,
  multiple: _multiple = true,
  label,
  disabledJurisdictions = [],
}: JurisdictionSelectorProps) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="grid grid-cols-5 gap-2">
        {JURISDICTION_LIST.map((jurisdiction) => {
          const isSelected = selected.includes(jurisdiction.code);
          const isDisabled = disabledJurisdictions.includes(jurisdiction.code);

          return (
            <button
              key={jurisdiction.code}
              type="button"
              onClick={() => !isDisabled && onChange(jurisdiction.code)}
              disabled={isDisabled}
              className={cn(
                'flex flex-col items-center rounded-lg border p-3 transition-all',
                isSelected
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500',
                isDisabled && 'cursor-not-allowed opacity-50'
              )}
            >
              <span className="mb-1 text-2xl">{jurisdiction.flag}</span>
              <span className="text-xs font-medium text-white">
                {jurisdiction.code}
              </span>
              <span className="text-[10px] text-slate-400">
                {jurisdiction.authority}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface SingleJurisdictionSelectorProps {
  selected: JurisdictionCode;
  onChange: (jurisdiction: JurisdictionCode) => void;
  label?: string;
}

export function SingleJurisdictionSelector({
  selected,
  onChange,
  label,
}: SingleJurisdictionSelectorProps) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="grid grid-cols-5 gap-2">
        {JURISDICTION_LIST.map((jurisdiction) => {
          const isSelected = selected === jurisdiction.code;

          return (
            <button
              key={jurisdiction.code}
              type="button"
              onClick={() => onChange(jurisdiction.code)}
              className={cn(
                'flex flex-col items-center rounded-lg border p-3 transition-all',
                isSelected
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
              )}
            >
              <span className="mb-1 text-2xl">{jurisdiction.flag}</span>
              <span className="text-xs font-medium text-white">
                {jurisdiction.code}
              </span>
              <span className="text-[10px] text-slate-400">
                {jurisdiction.authority}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
