/**
 * OutcomeSummary - Canonical decision display with status and quick stats
 * Follows Droit pattern: authoritative decision always prominent
 */

import { Badge } from '@/components/shared';
import type { NavigateResponse } from '@/types/navigate';

interface OutcomeSummaryProps {
  result: NavigateResponse;
  className?: string;
}

/**
 * Compute overall status from jurisdiction results
 */
function computeOverallStatus(result: NavigateResponse): 'COMPLIANT' | 'BLOCKED' | 'CONDITIONAL' {
  const allCompliant = result.jurisdiction_results.every((r) => r.status === 'compliant');
  const anyBlocked = result.jurisdiction_results.some((r) => r.status === 'blocked');

  if (allCompliant) return 'COMPLIANT';
  if (anyBlocked) return 'BLOCKED';
  return 'CONDITIONAL';
}

/**
 * Get status variant for Badge component
 */
function getStatusVariant(status: string): 'success' | 'error' | 'warning' {
  switch (status) {
    case 'COMPLIANT':
      return 'success';
    case 'BLOCKED':
      return 'error';
    default:
      return 'warning';
  }
}

/**
 * Get headline text for status
 */
function getStatusHeadline(status: string): string {
  switch (status) {
    case 'COMPLIANT':
      return 'Proceed with compliance pathway';
    case 'BLOCKED':
      return 'Activity not permitted';
    default:
      return 'Additional requirements apply';
  }
}

export function OutcomeSummary({ result, className }: OutcomeSummaryProps) {
  const overallStatus = computeOverallStatus(result);
  const totalObligations = result.jurisdiction_results.reduce(
    (acc, r) => acc + (r.obligations?.length || 0),
    0
  );

  return (
    <div className={className}>
      {/* Canonical Decision - Droit pattern: never leave the authoritative answer */}
      <div className="rounded-lg border-l-4 border-green-500 bg-slate-800 p-4">
        <div className="mb-1 text-sm text-slate-400">Canonical Decision</div>
        <div className="flex items-center gap-3">
          <Badge variant={getStatusVariant(overallStatus)}>
            {overallStatus}
          </Badge>
          <span className="text-lg font-medium text-white">
            {getStatusHeadline(overallStatus)}
          </span>
        </div>
        <div className="mt-2 text-sm text-slate-400">
          This is the authoritative decision from the rule engine.
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-slate-800/50 p-3 text-center">
          <div className="text-2xl font-bold text-white">
            {result.jurisdiction_results.length}
          </div>
          <div className="text-xs text-slate-400">Jurisdictions</div>
        </div>
        <div className="rounded-lg bg-slate-800/50 p-3 text-center">
          <div className="text-2xl font-bold text-white">
            {totalObligations}
          </div>
          <div className="text-xs text-slate-400">Obligations</div>
        </div>
      </div>

      {/* Next Steps Preview */}
      {result.pathway && result.pathway.length > 0 && (
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
          <h3 className="mb-3 text-sm font-medium text-slate-300">Next Steps</h3>
          <ol className="space-y-2 text-sm">
            {result.pathway.slice(0, 3).map((step, i) => (
              <li key={i} className="flex gap-2 text-slate-400">
                <span className="shrink-0 text-blue-400">{i + 1}.</span>
                <span>{step.action}</span>
              </li>
            ))}
            {result.pathway.length > 3 && (
              <li className="text-xs text-slate-500">
                +{result.pathway.length - 3} more steps
              </li>
            )}
          </ol>
        </div>
      )}
    </div>
  );
}
