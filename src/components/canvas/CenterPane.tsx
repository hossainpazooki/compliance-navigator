/**
 * CenterPane Component
 * Contains the Decision Tree Viewer (always expanded)
 * Phase 4 will enhance with TreeToolbar and NodeInspector
 */

import { useMemo } from 'react';
import { useCanvasState, useTreeHighlight } from '@/hooks';
import { CenterPaneArea } from './CanvasLayout';
import { DecisionTreeViewer } from '@/components/decision-tree';
import { TraceExplorer } from '@/components/trace-explorer';
import { LoadingSpinner, Badge } from '@/components/shared';
import { evaluateTree } from '@/lib/decisionTree/evaluator';
import { MICA_STABLECOIN_RULE } from '@/rules';
import { useNavigationStore } from '@/stores';

export function CenterPane() {
  const { canvas, analysisComplete } = useCanvasState();
  const { selectNode, tree } = useTreeHighlight();
  const store = useNavigationStore();

  // Demo mode: use client-side evaluation until backend ready
  const demoEvaluation = useMemo(() => {
    if (!MICA_STABLECOIN_RULE?.tree) return null;

    const facts = {
      issuer_jurisdiction: store.issuerJurisdiction,
      target_jurisdictions: store.targetJurisdictions,
      instrument_type: store.instrumentType,
      activity: store.activity,
      investor_types: store.investorTypes,
      amount: store.amount,
    };

    try {
      return evaluateTree(MICA_STABLECOIN_RULE.tree, facts, 'demo-tree');
    } catch {
      return null;
    }
  }, [store]);

  // Use backend result if available, otherwise demo
  const hasResult = analysisComplete || demoEvaluation;

  return (
    <CenterPaneArea>
      {/* Phase 4: TreeToolbar will go here */}
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800/30 px-4 py-2">
        <div className="flex items-center gap-3">
          <h2 className="font-medium text-slate-200">Decision Tree</h2>
          {canvas.uiState === 'stale' && (
            <Badge variant="warning" size="sm">
              Inputs changed
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          {/* Phase 4: View mode toggle, search, zoom controls */}
          <span>View: Baseline</span>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Tree visualization */}
        <div className="flex-1 overflow-auto p-4">
          {canvas.uiState === 'loading' ? (
            <div className="flex h-full items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : canvas.uiState === 'error' ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <div className="rounded-lg bg-red-500/10 p-6 text-center">
                <p className="text-red-400">
                  {canvas.lastError?.message || 'An error occurred'}
                </p>
                {canvas.lastError?.requestId && (
                  <p className="mt-2 text-xs text-slate-500">
                    Request ID: {canvas.lastError.requestId}
                  </p>
                )}
              </div>
            </div>
          ) : hasResult ? (
            <div className="h-full">
              {/* Use DecisionTreeViewer when we have a tree to display */}
              {MICA_STABLECOIN_RULE?.tree ? (
                <DecisionTreeViewer
                  tree={MICA_STABLECOIN_RULE.tree}
                  trace={demoEvaluation?.trace}
                  highlightedNodeIds={tree.highlightedNodeIds}
                  highlightSource={tree.highlightSource}
                  onNodeSelect={(node) => selectNode(node.nodeId)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  No tree data available
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="rounded-lg border border-dashed border-slate-600 p-8">
                <p className="text-slate-400">
                  Configure your scenario and run analysis to see the decision tree
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  The tree will highlight the evaluation path based on your inputs
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Trace explorer sidebar (compact) */}
        {hasResult && demoEvaluation?.trace && (
          <div className="w-80 shrink-0 overflow-y-auto border-l border-slate-700 bg-slate-800/30">
            <div className="border-b border-slate-700 px-4 py-2">
              <h3 className="text-sm font-medium text-slate-300">
                Trace ({demoEvaluation.trace.length} steps)
              </h3>
            </div>
            <div className="p-2">
              <TraceExplorer
                trace={demoEvaluation.trace}
                finalNode={demoEvaluation.leaf}
              />
            </div>
          </div>
        )}
      </div>
    </CenterPaneArea>
  );
}
