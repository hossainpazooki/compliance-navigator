import { useMemo } from 'react';
import { Badge, Button, Tooltip } from '@/components/shared';
import { JURISDICTION_LIST } from '@/constants';
import type { JurisdictionCode } from '@/types/common';
import type { ViewMode } from '@/components/decision-tree/DecisionTreeViewer';
import { cn } from '@/utils';

// Re-export ViewMode for convenience
export type { ViewMode };

interface TreeToolbarProps {
  // View mode
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;

  // Jurisdiction filter
  jurisdictionFilter: JurisdictionCode | null;
  availableJurisdictions: JurisdictionCode[];
  onJurisdictionFilterChange: (jurisdiction: JurisdictionCode | null) => void;

  // Search
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults?: number;

  // Zoom controls
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;

  // Export
  onExportTrace?: () => void;

  // Stats
  nodeCount?: number;
  traceSteps?: number;
  conflictCount?: number;

  className?: string;
}

const VIEW_MODE_OPTIONS: { value: ViewMode; label: string; icon: string }[] = [
  { value: 'baseline', label: 'Baseline', icon: '📊' },
  { value: 'whatif-diff', label: 'What-If Diff', icon: '🔀' },
  { value: 'conflict-overlay', label: 'Conflicts', icon: '⚠️' },
];

/**
 * TreeToolbar - Controls for the decision tree visualization
 * Includes view mode selector, jurisdiction filter, search, and zoom controls
 */
export function TreeToolbar({
  viewMode,
  onViewModeChange,
  jurisdictionFilter,
  availableJurisdictions,
  onJurisdictionFilterChange,
  searchQuery,
  onSearchChange,
  searchResults,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onExportTrace,
  nodeCount,
  traceSteps,
  conflictCount,
  className,
}: TreeToolbarProps) {
  const jurisdictionOptions = useMemo(() => {
    return availableJurisdictions.map((code) => {
      const jurisdiction = JURISDICTION_LIST.find((j) => j.code === code);
      return {
        code,
        label: jurisdiction?.name || code,
        flag: jurisdiction?.flag || '🌍',
      };
    });
  }, [availableJurisdictions]);

  const zoomPercentage = Math.round(zoomLevel * 100);

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 backdrop-blur-sm',
        className
      )}
    >
      {/* View Mode Selector */}
      <div className="flex items-center gap-1 rounded-lg bg-slate-900/50 p-1">
        {VIEW_MODE_OPTIONS.map((option) => (
          <Tooltip key={option.value} content={option.label}>
            <button
              type="button"
              onClick={() => onViewModeChange(option.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm transition-all',
                viewMode === option.value
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <span className="mr-1">{option.icon}</span>
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          </Tooltip>
        ))}
      </div>

      {/* Jurisdiction Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Scope:</span>
        <select
          value={jurisdictionFilter || ''}
          onChange={(e) =>
            onJurisdictionFilterChange((e.target.value as JurisdictionCode) || null)
          }
          className="rounded-lg border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="">All jurisdictions</option>
          {jurisdictionOptions.map((j) => (
            <option key={j.code} value={j.code}>
              {j.flag} {j.label}
            </option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div className="relative flex-1 min-w-[150px] max-w-[250px]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search nodes..."
          className="w-full rounded-lg border border-slate-600 bg-slate-800 py-1 pl-8 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
        />
        <svg
          className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchResults !== undefined && searchQuery && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded bg-slate-700 px-1.5 text-xs text-slate-400">
            {searchResults}
          </span>
        )}
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-1 rounded-lg bg-slate-900/50 p-1">
        <Tooltip content="Zoom out">
          <button
            type="button"
            onClick={onZoomOut}
            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            disabled={zoomLevel <= 0.25}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </Tooltip>
        <button
          type="button"
          onClick={onZoomReset}
          className="min-w-[50px] px-2 text-xs text-slate-400 hover:text-white"
        >
          {zoomPercentage}%
        </button>
        <Tooltip content="Zoom in">
          <button
            type="button"
            onClick={onZoomIn}
            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            disabled={zoomLevel >= 2}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </Tooltip>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2">
        {nodeCount !== undefined && (
          <Badge variant="info" size="sm">
            {nodeCount} nodes
          </Badge>
        )}
        {traceSteps !== undefined && (
          <Badge variant="info" size="sm">
            {traceSteps} steps
          </Badge>
        )}
        {conflictCount !== undefined && conflictCount > 0 && (
          <Badge variant="warning" size="sm">
            {conflictCount} conflicts
          </Badge>
        )}
      </div>

      {/* Export */}
      {onExportTrace && (
        <Tooltip content="Export trace">
          <Button variant="ghost" size="sm" onClick={onExportTrace}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </Button>
        </Tooltip>
      )}
    </div>
  );
}
