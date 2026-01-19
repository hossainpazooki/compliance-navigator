import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/shared';
import { PathwayStep } from './PathwayStep';
import type { PathwayStep as PathwayStepType } from '@/types/navigate';

interface PathwayTimelineProps {
  steps: PathwayStepType[];
  estimatedTimeline: string;
}

export function PathwayTimeline({ steps, estimatedTimeline }: PathwayTimelineProps) {
  const completedSteps = steps.filter((s) => s.status === 'completed').length;
  const waivedSteps = steps.filter((s) => s.status === 'waived').length;
  const progress = steps.length > 0
    ? Math.round(((completedSteps + waivedSteps) / steps.length) * 100)
    : 0;

  return (
    <Card variant="bordered">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CardTitle>Compliance Pathway</CardTitle>
          <Badge variant="info">{estimatedTimeline}</Badge>
        </div>
        {/* Progress bar */}
        <div className="mt-2 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-slate-400">
            {completedSteps + waivedSteps}/{steps.length} steps
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {steps.length === 0 ? (
          <p className="text-center text-slate-400">No pathway steps available.</p>
        ) : (
          <div className="space-y-6">
            {steps.map((step, index) => (
              <PathwayStep
                key={step.step_id}
                step={step}
                stepNumber={index + 1}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
