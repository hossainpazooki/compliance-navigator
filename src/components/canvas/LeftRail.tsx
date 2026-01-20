/**
 * LeftRail Component
 * Contains the ScenarioBuilder form (Phase 3 will add full implementation)
 * For now, provides collapsed/expanded container with summary
 */

import { usePanelState, useCanvasState } from '@/hooks';
import { useNavigationStore } from '@/stores';
import { Button, Badge } from '@/components/shared';
import { LeftRailArea } from './CanvasLayout';
import { PanelHeader } from './PanelHeader';
import { JURISDICTIONS } from '@/types/common';

export function LeftRail() {
  const { panels, togglePanel } = usePanelState();
  const { isLoading } = useCanvasState();
  const store = useNavigationStore();

  const isExpanded = panels.leftRail === 'expanded';

  // Build summary for collapsed state
  const targetFlags = store.targetJurisdictions
    .map((code) => JURISDICTIONS[code]?.flag || code)
    .join(' ');

  const summary = `${JURISDICTIONS[store.issuerJurisdiction]?.flag || store.issuerJurisdiction} → ${targetFlags || 'No targets'}`;

  return (
    <LeftRailArea>
      <PanelHeader
        title="Scenario"
        isExpanded={isExpanded}
        onToggle={() => togglePanel('leftRail')}
        summary={summary}
        badge={
          store.targetJurisdictions.length > 0 && (
            <Badge variant="info" size="sm">
              {store.targetJurisdictions.length} targets
            </Badge>
          )
        }
      />

      {isExpanded ? (
        <div className="flex-1 overflow-y-auto p-4">
          {/* Phase 3: ScenarioBuilder will replace this placeholder */}
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <h3 className="mb-3 text-sm font-medium text-slate-300">
                Current Scenario
              </h3>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Home:</dt>
                  <dd className="text-white">
                    {JURISDICTIONS[store.issuerJurisdiction]?.flag}{' '}
                    {JURISDICTIONS[store.issuerJurisdiction]?.name}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-slate-400">Targets:</dt>
                  <dd className="text-white">
                    {store.targetJurisdictions.length > 0
                      ? store.targetJurisdictions
                          .map(
                            (code) =>
                              `${JURISDICTIONS[code]?.flag} ${JURISDICTIONS[code]?.name}`
                          )
                          .join(', ')
                      : 'None selected'}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-slate-400">Instrument:</dt>
                  <dd className="text-white capitalize">{store.instrumentType}</dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-slate-400">Activity:</dt>
                  <dd className="text-white capitalize">{store.activity}</dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-slate-400">Investors:</dt>
                  <dd className="text-white">
                    {store.investorTypes.join(', ') || 'None'}
                  </dd>
                </div>

                {store.amount && (
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Amount:</dt>
                    <dd className="text-white">
                      ${store.amount.toLocaleString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <Button
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              disabled={store.targetJurisdictions.length === 0}
            >
              Run Analysis
            </Button>

            <p className="text-center text-xs text-slate-500">
              Full scenario builder coming in Phase 3
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center gap-2 p-2 pt-4">
          {/* Collapsed state: vertical icons/indicators */}
          <div className="text-lg">
            {JURISDICTIONS[store.issuerJurisdiction]?.flag}
          </div>
          <div className="text-xs text-slate-500">↓</div>
          <div className="flex flex-col gap-1">
            {store.targetJurisdictions.slice(0, 3).map((code) => (
              <div key={code} className="text-sm">
                {JURISDICTIONS[code]?.flag}
              </div>
            ))}
            {store.targetJurisdictions.length > 3 && (
              <div className="text-xs text-slate-500">
                +{store.targetJurisdictions.length - 3}
              </div>
            )}
          </div>
        </div>
      )}
    </LeftRailArea>
  );
}
