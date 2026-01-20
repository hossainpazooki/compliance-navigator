/**
 * PanelHeader Component
 * Collapsible header for canvas panels with title, summary, and toggle
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils';

export interface PanelHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  summary?: ReactNode;
  actions?: ReactNode;
  badge?: ReactNode;
}

export const PanelHeader = forwardRef<HTMLDivElement, PanelHeaderProps>(
  function PanelHeader(
    { title, isExpanded, onToggle, summary, actions, badge, className, ...props },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between border-b border-slate-700 bg-slate-800/50 px-4 py-3',
          className
        )}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            className="flex items-center gap-2 text-left hover:text-white"
            aria-expanded={isExpanded}
          >
            <svg
              className={cn(
                'h-4 w-4 shrink-0 text-slate-400 transition-transform',
                isExpanded && 'rotate-90'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="font-medium text-slate-200">{title}</span>
          </button>
          {badge && <div className="shrink-0">{badge}</div>}
          {!isExpanded && summary && (
            <div className="min-w-0 truncate text-sm text-slate-400">
              {summary}
            </div>
          )}
        </div>
        {actions && (
          <div className="ml-4 flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    );
  }
);

PanelHeader.displayName = 'PanelHeader';
