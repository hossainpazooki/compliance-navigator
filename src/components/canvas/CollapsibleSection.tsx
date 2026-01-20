import { useState, useCallback, type ReactNode } from 'react';
import { cn } from '@/utils';

interface CollapsibleSectionProps {
  title: string;
  defaultExpanded?: boolean;
  children: ReactNode;
  badge?: string | number;
  icon?: string;
  className?: string;
}

/**
 * CollapsibleSection - Expandable form section for the scenario builder
 * Used in the left rail for Advanced Facts, Assumptions, etc.
 */
export function CollapsibleSection({
  title,
  defaultExpanded = false,
  children,
  badge,
  icon,
  className,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div className={cn('border-t border-slate-700', className)}>
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-slate-800/50"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="text-sm font-medium text-slate-300">{title}</span>
          {badge !== undefined && (
            <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-400">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={cn(
            'h-4 w-4 text-slate-400 transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
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
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    </div>
  );
}
