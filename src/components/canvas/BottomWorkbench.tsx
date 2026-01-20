/**
 * BottomWorkbench Component
 * Tabbed workbench for Jurisdictions, Pathway, Conflicts, What-If
 * Phase 6 will add full compound component implementation
 */

import { useState } from 'react';
import { usePanelState, useCanvasState } from '@/hooks';
import { useResultsStore } from '@/stores';
import { Badge, Button } from '@/components/shared';
import { WorkbenchArea } from './CanvasLayout';
import { PanelHeader } from './PanelHeader';
import { JURISDICTION_MAP } from '@/constants';

type WorkbenchTab = 'jurisdictions' | 'pathway' | 'conflicts' | 'whatif';

const TABS: Array<{ id: WorkbenchTab; label: string }> = [
  { id: 'jurisdictions', label: 'Jurisdictions' },
  { id: 'pathway', label: 'Pathway' },
  { id: 'conflicts', label: 'Conflicts' },
  { id: 'whatif', label: 'What-If' },
];

export function BottomWorkbench() {
  const { panels, togglePanel } = usePanelState();
  const { analysisComplete } = useCanvasState();
  const { navigationResult } = useResultsStore();
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('jurisdictions');

  const isExpanded = panels.workbench === 'expanded';

  // Counts for badges
  const jurisdictionCount = navigationResult?.jurisdiction_results.length || 0;
  const pathwaySteps = navigationResult?.pathway?.length || 0;
  const conflictCount = navigationResult?.conflicts?.length || 0;

  // Build summary for collapsed state
  const summary = analysisComplete
    ? `${jurisdictionCount} jurisdictions • ${pathwaySteps} steps • ${conflictCount} conflicts`
    : 'Run analysis to see workbench';

  return (
    <WorkbenchArea>
      <PanelHeader
        title="Workbench"
        isExpanded={isExpanded}
        onToggle={() => togglePanel('workbench')}
        summary={!isExpanded ? summary : undefined}
        actions={
          isExpanded && (
            <div className="flex gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'jurisdictions' && jurisdictionCount > 0 && (
                    <Badge variant="info" size="sm" className="ml-2">
                      {jurisdictionCount}
                    </Badge>
                  )}
                  {tab.id === 'conflicts' && conflictCount > 0 && (
                    <Badge variant="warning" size="sm" className="ml-2">
                      {conflictCount}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )
        }
      />

      {isExpanded && (
        <div className="flex-1 overflow-auto p-4">
          {!analysisComplete ? (
            <div className="flex h-full items-center justify-center text-slate-400">
              Run analysis to populate workbench
            </div>
          ) : (
            <>
              {/* Jurisdictions Tab */}
              {activeTab === 'jurisdictions' && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {navigationResult?.jurisdiction_results.map((result) => (
                    <div
                      key={result.jurisdiction}
                      className="shrink-0 rounded-lg border border-slate-700 bg-slate-800/50 p-4"
                      style={{ minWidth: '200px' }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xl">
                          {JURISDICTION_MAP[result.jurisdiction]?.flag}
                        </span>
                        <span className="font-medium text-white">
                          {JURISDICTION_MAP[result.jurisdiction]?.name}
                        </span>
                      </div>
                      <Badge
                        variant={
                          result.status === 'compliant'
                            ? 'success'
                            : result.status === 'blocked'
                              ? 'error'
                              : 'warning'
                        }
                      >
                        {result.status}
                      </Badge>
                      <p className="mt-2 text-sm text-slate-400">
                        {result.obligations?.length || 0} obligations
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Pathway Tab */}
              {activeTab === 'pathway' && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {navigationResult?.pathway?.map((step, i) => (
                    <div
                      key={i}
                      className="relative shrink-0 rounded-lg border border-slate-700 bg-slate-800/50 p-4"
                      style={{ minWidth: '180px' }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-white">
                          {step.action}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {step.timeline ? `${step.timeline.min_days}-${step.timeline.max_days} days` : 'Timeline TBD'}
                      </p>
                      {i < (navigationResult?.pathway?.length || 0) - 1 && (
                        <div className="absolute -right-3 top-1/2 text-slate-500">
                          →
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Conflicts Tab */}
              {activeTab === 'conflicts' && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {conflictCount === 0 ? (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      No conflicts detected
                    </div>
                  ) : (
                    navigationResult?.conflicts?.map((conflict, i) => (
                      <div
                        key={i}
                        className="shrink-0 rounded-lg border border-slate-700 bg-slate-800/50 p-4"
                        style={{ minWidth: '250px' }}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <Badge
                            variant={
                              conflict.severity === 'blocking'
                                ? 'error'
                                : conflict.severity === 'warning'
                                  ? 'warning'
                                  : 'info'
                            }
                          >
                            {conflict.severity}
                          </Badge>
                          <span className="text-sm text-slate-400">
                            {conflict.type}
                          </span>
                        </div>
                        <p className="text-sm text-white">
                          {conflict.description}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            // Phase 6: Will implement highlight in tree
                            console.log('Highlight conflict in tree');
                          }}
                        >
                          Highlight in tree
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* What-If Tab */}
              {activeTab === 'whatif' && (
                <div className="flex gap-4">
                  <div className="rounded-lg border border-dashed border-slate-600 p-6 text-center">
                    <p className="text-slate-400">
                      What-If analysis coming in Phase 7
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Compare scenarios and see decision diffs
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </WorkbenchArea>
  );
}
