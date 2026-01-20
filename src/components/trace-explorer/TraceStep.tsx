import { useState } from 'react';
import type { TraceNode } from '@/types/decisionTree';
import { Badge } from '@/components/shared';

interface TraceStepProps {
  step: TraceNode;
  stepNumber: number;
  isLast?: boolean;
  isHighlighted?: boolean;
  onHover?: (nodeId: string | null) => void;
}

export function TraceStep({
  step,
  stepNumber,
  isLast,
  isHighlighted,
  onHover,
}: TraceStepProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`relative ${!isLast ? 'pb-4' : ''}`}
      onMouseEnter={() => onHover?.(step.nodeId)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-4 top-8 h-full w-0.5 bg-slate-700" />
      )}

      <div
        className={`relative flex gap-3 rounded-lg p-3 transition-colors cursor-pointer ${
          isHighlighted
            ? 'bg-cyan-500/20 border border-cyan-500/50'
            : 'bg-slate-800/50 hover:bg-slate-800'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Step number indicator */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
            step.result
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}
        >
          {stepNumber}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-white truncate">
              {step.condition}
            </span>
            <Badge
              variant={step.result ? 'success' : 'error'}
              size="sm"
            >
              {step.result ? 'TRUE' : 'FALSE'}
            </Badge>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            {step.factPath}
          </p>

          {/* Expanded details */}
          {isExpanded && (
            <div className="mt-3 space-y-2 border-t border-slate-700 pt-3">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Actual Value:</span>
                  <pre className="mt-1 rounded bg-slate-900 p-2 text-slate-300 overflow-x-auto">
                    {JSON.stringify(step.factValue, null, 2)}
                  </pre>
                </div>
                <div>
                  <span className="text-slate-500">Expected Value:</span>
                  <pre className="mt-1 rounded bg-slate-900 p-2 text-slate-300 overflow-x-auto">
                    {JSON.stringify(step.expectedValue, null, 2)}
                  </pre>
                </div>
              </div>

              {step.sourceRef && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Source:</span>
                  <a
                    href={step.sourceRef.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {step.sourceRef.document_id}
                    {step.sourceRef.article && ` Art. ${step.sourceRef.article}`}
                    {step.sourceRef.paragraph && `(${step.sourceRef.paragraph})`}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Expand indicator */}
        <div className="text-slate-500 text-xs">
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>
    </div>
  );
}
