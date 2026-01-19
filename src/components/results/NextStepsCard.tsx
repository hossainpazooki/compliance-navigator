import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared';
import { getJurisdictionInfo } from '@/constants';
import type { NavigateResponse } from '@/types/navigate';

interface NextStep {
  priority: number;
  icon: string;
  label: string;
  description: string;
  type: 'blocking' | 'action' | 'warning';
}

interface NextStepsCardProps {
  result: NavigateResponse;
}

export function NextStepsCard({ result }: NextStepsCardProps) {
  const nextSteps = computeNextSteps(result);

  if (nextSteps.length === 0) {
    return null;
  }

  return (
    <Card variant="bordered" className="border-slate-600 bg-slate-800/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Next Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {nextSteps.slice(0, 4).map((step, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 rounded-lg p-3 ${
                step.type === 'blocking'
                  ? 'bg-red-500/10 border border-red-500/30'
                  : step.type === 'action'
                    ? 'bg-blue-500/10 border border-blue-500/30'
                    : 'bg-amber-500/10 border border-amber-500/30'
              }`}
            >
              <span className="text-lg">{step.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white">{step.label}</p>
                <p className="text-sm text-slate-400 truncate">{step.description}</p>
              </div>
              <span className="text-xs text-slate-500 shrink-0">
                #{step.priority}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function computeNextSteps(result: NavigateResponse): NextStep[] {
  const steps: NextStep[] = [];
  let priority = 1;

  // Priority 1: Blocking conflicts
  const blockingConflicts = result.conflicts.filter(c => c.severity === 'blocking');
  if (blockingConflicts.length > 0) {
    steps.push({
      priority: priority++,
      icon: '🚫',
      label: `Resolve ${blockingConflicts.length} blocking conflict${blockingConflicts.length > 1 ? 's' : ''}`,
      description: blockingConflicts.map(c => c.description).join('; '),
      type: 'blocking',
    });
  }

  // Priority 2: Blocked jurisdictions
  const blockedJurisdictions = result.jurisdiction_results.filter(
    r => r.status === 'blocked'
  );
  if (blockedJurisdictions.length > 0) {
    const names = blockedJurisdictions
      .map(r => getJurisdictionInfo(r.jurisdiction).name)
      .join(', ');
    steps.push({
      priority: priority++,
      icon: '⛔',
      label: `Address blocked market${blockedJurisdictions.length > 1 ? 's' : ''}`,
      description: names,
      type: 'blocking',
    });
  }

  // Priority 3: First actionable pathway step (not completed/waived)
  const pendingSteps = result.pathway.filter(
    s => s.status === 'pending'
  );
  if (pendingSteps.length > 0) {
    const firstStep = pendingSteps[0];
    const jurisdictionInfo = getJurisdictionInfo(firstStep.jurisdiction);
    steps.push({
      priority: priority++,
      icon: '📋',
      label: `Start: ${firstStep.action}`,
      description: `${jurisdictionInfo.flag} ${jurisdictionInfo.name}`,
      type: 'action',
    });
  }

  // Priority 4: Warning conflicts (non-blocking)
  const warningConflicts = result.conflicts.filter(c => c.severity === 'warning');
  if (warningConflicts.length > 0) {
    steps.push({
      priority: priority++,
      icon: '⚠️',
      label: `Review ${warningConflicts.length} warning${warningConflicts.length > 1 ? 's' : ''}`,
      description: warningConflicts.map(c => c.type).join(', '),
      type: 'warning',
    });
  }

  // Priority 5: Cumulative obligations
  if (result.cumulative_obligations.length > 0) {
    steps.push({
      priority: priority++,
      icon: '📌',
      label: `${result.cumulative_obligations.length} cross-border obligation${result.cumulative_obligations.length > 1 ? 's' : ''}`,
      description: 'Requirements that apply across multiple jurisdictions',
      type: 'warning',
    });
  }

  return steps;
}
