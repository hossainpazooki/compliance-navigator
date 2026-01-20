import type { TraceNode, LeafNode } from '@/types/decisionTree';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/shared';
import { TraceStep } from './TraceStep';

interface TraceExplorerProps {
  trace: TraceNode[];
  finalNode?: LeafNode;
  title?: string;
  highlightedNodeId?: string | null;
  onNodeHover?: (nodeId: string | null) => void;
}

/**
 * Get status color variant
 */
function getStatusVariant(status: string): 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'compliant':
      return 'success';
    case 'requires_action':
      return 'warning';
    case 'blocked':
      return 'error';
    default:
      return 'info';
  }
}

export function TraceExplorer({
  trace,
  finalNode,
  title = 'Decision Trace',
  highlightedNodeId,
  onNodeHover,
}: TraceExplorerProps) {
  if (trace.length === 0) {
    return (
      <Card variant="bordered">
        <CardContent>
          <p className="text-center text-slate-400 py-4">
            No evaluation trace available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-purple-400">📋</span>
          {title}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>{trace.length} conditions evaluated</span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Trace steps */}
        <div className="space-y-1">
          {trace.map((step, index) => (
            <TraceStep
              key={step.nodeId}
              step={step}
              stepNumber={index + 1}
              isLast={index === trace.length - 1 && !finalNode}
              isHighlighted={highlightedNodeId === step.nodeId}
              onHover={onNodeHover}
            />
          ))}
        </div>

        {/* Final decision */}
        {finalNode && (
          <div className="mt-4 rounded-lg border border-slate-600 bg-slate-800/80 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎯</span>
              <span className="font-medium text-white">Final Decision</span>
              <Badge variant={getStatusVariant(finalNode.status)}>
                {finalNode.status.replace(/_/g, ' ')}
              </Badge>
            </div>
            <p className="text-sm text-slate-300 mb-3">{finalNode.decision}</p>

            {finalNode.obligations && finalNode.obligations.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Obligations:</p>
                <div className="flex flex-wrap gap-1">
                  {finalNode.obligations.map((obligation, i) => (
                    <span
                      key={i}
                      className="rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300"
                    >
                      {obligation}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {finalNode.sourceRef && (
              <div className="mt-3 pt-3 border-t border-slate-700">
                <a
                  href={finalNode.sourceRef.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline"
                >
                  {finalNode.sourceRef.document_id}
                  {finalNode.sourceRef.article && ` Art. ${finalNode.sourceRef.article}`}
                </a>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
