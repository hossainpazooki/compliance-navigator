import { useMemo } from 'react';
import { Badge, Button } from '@/components/shared';
import type {
  DecisionNode,
  ConditionNode,
  LeafNode,
  GroupNode,
  RouterNode,
  ConflictAnchorNode,
  TraceNode,
} from '@/types/decisionTree';
import {
  isConditionNode,
  isLeafNode,
  isGroupNode,
  isRouterNode,
  isConflictAnchorNode,
} from '@/types/decisionTree';
import { cn } from '@/utils';

interface NodeInspectorProps {
  node: DecisionNode | null;
  traceNode?: TraceNode;
  onClose: () => void;
  onNavigateToNode?: (nodeId: string) => void;
  className?: string;
}

function getNodeTypeLabel(node: DecisionNode): string {
  if (isConditionNode(node)) return 'Condition';
  if (isLeafNode(node)) return 'Decision';
  if (isGroupNode(node)) return 'Module';
  if (isRouterNode(node)) return 'Router';
  if (isConflictAnchorNode(node)) return 'Conflict Anchor';
  return 'Node';
}

function getNodeTypeVariant(
  node: DecisionNode
): 'info' | 'success' | 'warning' | 'error' | 'default' {
  if (isLeafNode(node)) {
    switch (node.status) {
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
  if (isGroupNode(node)) return 'info';
  if (isRouterNode(node)) return 'warning';
  if (isConflictAnchorNode(node)) return 'error';
  return 'default';
}

function ConditionNodeDetails({ node }: { node: ConditionNode }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-500">Condition</label>
        <p className="mt-1 rounded bg-slate-800 p-2 font-mono text-sm text-white">
          {node.condition.fact} {node.condition.op} {JSON.stringify(node.condition.value)}
        </p>
      </div>
      {node.annotation && (
        <div>
          <label className="text-xs text-slate-500">Annotation</label>
          <p className="mt-1 text-sm text-slate-300">{node.annotation}</p>
        </div>
      )}
    </div>
  );
}

function LeafNodeDetails({ node }: { node: LeafNode }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-500">Decision</label>
        <p className="mt-1 text-sm text-white">{node.decision}</p>
      </div>
      <div>
        <label className="text-xs text-slate-500">Status</label>
        <div className="mt-1">
          <Badge variant={getNodeTypeVariant(node)}>{node.status.replace(/_/g, ' ')}</Badge>
        </div>
      </div>
      {node.obligations && node.obligations.length > 0 && (
        <div>
          <label className="text-xs text-slate-500">Obligations</label>
          <ul className="mt-1 space-y-1">
            {node.obligations.map((obligation, i) => (
              <li
                key={i}
                className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300"
              >
                {obligation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function GroupNodeDetails({
  node,
  onNavigateToNode,
}: {
  node: GroupNode;
  onNavigateToNode?: (nodeId: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-500">Module ID</label>
        <p className="mt-1 font-mono text-sm text-white">{node.moduleId}</p>
      </div>
      <div>
        <label className="text-xs text-slate-500">Entry Point</label>
        <button
          onClick={() => onNavigateToNode?.(node.entryNodeId)}
          className="mt-1 block text-sm text-blue-400 hover:underline"
        >
          {node.entryNodeId}
        </button>
      </div>
      {node.exitNodeId && (
        <div>
          <label className="text-xs text-slate-500">Exit Point</label>
          <button
            onClick={() => onNavigateToNode?.(node.exitNodeId!)}
            className="mt-1 block text-sm text-blue-400 hover:underline"
          >
            {node.exitNodeId}
          </button>
        </div>
      )}
      <div>
        <label className="text-xs text-slate-500">Children</label>
        <p className="mt-1 text-sm text-slate-300">{node.children.length} nodes</p>
      </div>
    </div>
  );
}

function RouterNodeDetails({
  node,
  onNavigateToNode,
}: {
  node: RouterNode;
  onNavigateToNode?: (nodeId: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-500">Branches</label>
        <ul className="mt-1 space-y-2">
          {node.branches.map((branch, i) => (
            <li key={i} className="rounded bg-slate-800 p-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-white">
                    {branch.jurisdiction}
                  </span>
                  <span className="ml-2 text-xs text-slate-400">({branch.role})</span>
                </div>
                <button
                  onClick={() => onNavigateToNode?.(branch.targetNodeId)}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Go to node →
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ConflictAnchorNodeDetails({
  node,
  onNavigateToNode,
}: {
  node: ConflictAnchorNode;
  onNavigateToNode?: (nodeId: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-slate-500">Conflict ID</label>
        <p className="mt-1 font-mono text-sm text-red-400">{node.conflictId}</p>
      </div>
      <div>
        <label className="text-xs text-slate-500">Paired Anchor</label>
        <button
          onClick={() => onNavigateToNode?.(node.pairedAnchorId)}
          className="mt-1 block text-sm text-blue-400 hover:underline"
        >
          {node.pairedAnchorId}
        </button>
      </div>
    </div>
  );
}

function TraceDetails({ traceNode }: { traceNode: TraceNode }) {
  return (
    <div className="rounded-lg border border-slate-600 bg-slate-800/50 p-3">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Evaluation Trace
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Fact Path:</span>
          <span className="font-mono text-white">{traceNode.factPath}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Value:</span>
          <span className="font-mono text-white">{JSON.stringify(traceNode.factValue)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Expected:</span>
          <span className="font-mono text-white">{JSON.stringify(traceNode.expectedValue)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Result:</span>
          <Badge variant={traceNode.result ? 'success' : 'error'}>
            {traceNode.result ? 'True' : 'False'}
          </Badge>
        </div>
        {traceNode.regulatoryVersion && (
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Version:</span>
            <span className="text-xs text-slate-300">{traceNode.regulatoryVersion}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * NodeInspector - Slide-out drawer for inspecting a selected/pinned node
 * Shows detailed information about the node and its evaluation trace
 */
export function NodeInspector({
  node,
  traceNode,
  onClose,
  onNavigateToNode,
  className,
}: NodeInspectorProps) {
  const nodeTypeLabel = useMemo(() => (node ? getNodeTypeLabel(node) : ''), [node]);

  if (!node) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex h-full flex-col border-l border-slate-700 bg-slate-900',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <Badge variant={getNodeTypeVariant(node)} size="sm">
            {nodeTypeLabel}
          </Badge>
          <span className="font-mono text-xs text-slate-400">{node.nodeId}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Label */}
          {'label' in node && node.label && (
            <div>
              <label className="text-xs text-slate-500">Label</label>
              <p className="mt-1 text-sm font-medium text-white">{node.label}</p>
            </div>
          )}

          {/* Scope */}
          {'scope' in node && node.scope && (
            <div>
              <label className="text-xs text-slate-500">Scope</label>
              <div className="mt-1 flex flex-wrap gap-1">
                {node.scope.jurisdictions?.map((j) => (
                  <Badge key={j} variant="info" size="sm">
                    {j}
                  </Badge>
                ))}
                {node.scope.roles?.map((r) => (
                  <Badge key={r} variant="default" size="sm">
                    {r}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {'tags' in node && node.tags && node.tags.length > 0 && (
            <div>
              <label className="text-xs text-slate-500">Tags</label>
              <div className="mt-1 flex flex-wrap gap-1">
                {node.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Node-specific details */}
          {isConditionNode(node) && <ConditionNodeDetails node={node} />}
          {isLeafNode(node) && <LeafNodeDetails node={node} />}
          {isGroupNode(node) && (
            <GroupNodeDetails node={node} onNavigateToNode={onNavigateToNode} />
          )}
          {isRouterNode(node) && (
            <RouterNodeDetails node={node} onNavigateToNode={onNavigateToNode} />
          )}
          {isConflictAnchorNode(node) && (
            <ConflictAnchorNodeDetails node={node} onNavigateToNode={onNavigateToNode} />
          )}

          {/* Source Reference */}
          {node.sourceRef && (
            <div>
              <label className="text-xs text-slate-500">Citation</label>
              <a
                href={node.sourceRef.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-blue-400 hover:underline"
              >
                {node.sourceRef.document_id}
                {node.sourceRef.article && ` Art. ${node.sourceRef.article}`}
              </a>
            </div>
          )}

          {/* Trace details if available */}
          {traceNode && <TraceDetails traceNode={traceNode} />}
        </div>
      </div>
    </div>
  );
}
