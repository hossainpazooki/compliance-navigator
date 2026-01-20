import type { LayoutNode } from '@/lib/svg/treeLayout';
import type { ConditionNode, LeafNode, GroupNode, RouterNode, ConflictAnchorNode } from '@/types/decisionTree';
import type { ViewMode } from './DecisionTreeViewer';

interface TreeNodeProps {
  layoutNode: LayoutNode;
  isSelected?: boolean;
  isHighlighted?: boolean;
  highlightColor?: string;
  isCollapsed?: boolean;
  viewMode?: ViewMode;
  onSelect?: (nodeId: string) => void;
  onHover?: (nodeId: string | null) => void;
  onGroupToggle?: (groupId: string) => void;
}

/**
 * Get status color for a leaf node
 */
function getStatusColor(status: string): { bg: string; border: string; text: string } {
  switch (status) {
    case 'compliant':
      return { bg: '#065f46', border: '#10b981', text: '#6ee7b7' };
    case 'requires_action':
      return { bg: '#78350f', border: '#f59e0b', text: '#fcd34d' };
    case 'blocked':
      return { bg: '#7f1d1d', border: '#ef4444', text: '#fca5a5' };
    case 'no_applicable_rules':
      return { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' };
    default:
      return { bg: '#374151', border: '#6b7280', text: '#d1d5db' };
  }
}

/**
 * Render a condition node
 */
function ConditionNodeContent({ node }: { node: ConditionNode }) {
  const { condition, annotation } = node;
  const displayText = annotation || `${condition.fact} ${condition.op} ${JSON.stringify(condition.value)}`;

  return (
    <>
      <text
        x="0"
        y="-8"
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="10"
        fontFamily="monospace"
      >
        {condition.fact}
      </text>
      <text
        x="0"
        y="8"
        textAnchor="middle"
        fill="#e2e8f0"
        fontSize="11"
        fontWeight="500"
      >
        {truncateText(displayText, 28)}
      </text>
      {node.sourceRef && (
        <text
          x="0"
          y="24"
          textAnchor="middle"
          fill="#64748b"
          fontSize="9"
        >
          {node.sourceRef.document_id} Art. {node.sourceRef.article}
        </text>
      )}
    </>
  );
}

/**
 * Render a leaf node
 */
function LeafNodeContent({ node }: { node: LeafNode }) {
  const colors = getStatusColor(node.status);

  return (
    <>
      <text
        x="0"
        y="-8"
        textAnchor="middle"
        fill={colors.text}
        fontSize="10"
        fontWeight="600"
      >
        {node.status.replace(/_/g, ' ').toUpperCase()}
      </text>
      <text
        x="0"
        y="10"
        textAnchor="middle"
        fill="#e2e8f0"
        fontSize="10"
      >
        {truncateText(node.decision, 30)}
      </text>
      {node.obligations && node.obligations.length > 0 && (
        <text
          x="0"
          y="26"
          textAnchor="middle"
          fill="#64748b"
          fontSize="9"
        >
          {node.obligations.length} obligation{node.obligations.length > 1 ? 's' : ''}
        </text>
      )}
    </>
  );
}

/**
 * Render a group node (collapsible jurisdiction module)
 */
function GroupNodeContent({ node, isCollapsed }: { node: GroupNode; isCollapsed?: boolean }) {
  return (
    <>
      <text
        x="0"
        y="-12"
        textAnchor="middle"
        fill="#8b5cf6"
        fontSize="10"
        fontWeight="600"
      >
        MODULE
      </text>
      <text
        x="0"
        y="6"
        textAnchor="middle"
        fill="#e2e8f0"
        fontSize="11"
        fontWeight="500"
      >
        {truncateText(node.label, 24)}
      </text>
      <text
        x="0"
        y="22"
        textAnchor="middle"
        fill="#64748b"
        fontSize="9"
      >
        {node.children.length} nodes {isCollapsed ? '▶' : '▼'}
      </text>
      {node.scope?.jurisdictions && node.scope.jurisdictions.length > 0 && (
        <text
          x="0"
          y="36"
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="8"
        >
          {node.scope.jurisdictions.join(', ')}
        </text>
      )}
    </>
  );
}

/**
 * Render a router node (parallel jurisdiction dispatch)
 */
function RouterNodeContent({ node }: { node: RouterNode }) {
  return (
    <>
      <text
        x="0"
        y="-12"
        textAnchor="middle"
        fill="#f59e0b"
        fontSize="10"
        fontWeight="600"
      >
        ROUTER
      </text>
      <text
        x="0"
        y="6"
        textAnchor="middle"
        fill="#e2e8f0"
        fontSize="11"
        fontWeight="500"
      >
        {truncateText(node.label, 24)}
      </text>
      <text
        x="0"
        y="22"
        textAnchor="middle"
        fill="#64748b"
        fontSize="9"
      >
        {node.branches.length} branches
      </text>
    </>
  );
}

/**
 * Render a conflict anchor node
 */
function ConflictAnchorNodeContent({ node }: { node: ConflictAnchorNode }) {
  return (
    <>
      <text
        x="0"
        y="-8"
        textAnchor="middle"
        fill="#ef4444"
        fontSize="10"
        fontWeight="600"
      >
        ⚠️ CONFLICT
      </text>
      <text
        x="0"
        y="10"
        textAnchor="middle"
        fill="#e2e8f0"
        fontSize="10"
      >
        {truncateText(node.label, 24)}
      </text>
      <text
        x="0"
        y="24"
        textAnchor="middle"
        fill="#64748b"
        fontSize="8"
      >
        {node.conflictId}
      </text>
    </>
  );
}

/**
 * Truncate text with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Get colors based on node type
 */
function getNodeColors(node: LayoutNode['node'], isLeaf: boolean): { bg: string; border: string; text: string } {
  if (isLeaf) {
    return getStatusColor((node as LeafNode).status);
  }

  switch (node.type) {
    case 'group':
      return { bg: '#2e1065', border: '#8b5cf6', text: '#c4b5fd' };
    case 'router':
      return { bg: '#451a03', border: '#f59e0b', text: '#fcd34d' };
    case 'conflict_anchor':
      return { bg: '#450a0a', border: '#ef4444', text: '#fca5a5' };
    default:
      return { bg: '#1e293b', border: '#475569', text: '#e2e8f0' };
  }
}

/**
 * Get node type indicator
 */
function getNodeTypeIndicator(node: LayoutNode['node'], isLeaf: boolean): { color: string; label: string } {
  if (isLeaf) return { color: '#10b981', label: 'L' };

  switch (node.type) {
    case 'group':
      return { color: '#8b5cf6', label: 'G' };
    case 'router':
      return { color: '#f59e0b', label: 'R' };
    case 'conflict_anchor':
      return { color: '#ef4444', label: '!' };
    default:
      return { color: '#3b82f6', label: 'C' };
  }
}

export function TreeNode({
  layoutNode,
  isSelected,
  isHighlighted,
  highlightColor,
  isCollapsed,
  viewMode,
  onSelect,
  onHover,
  onGroupToggle,
}: TreeNodeProps) {
  const { id, x, y, width, height, node, isLeaf, isOnPath } = layoutNode;

  const colors = getNodeColors(node, isLeaf);
  const indicator = getNodeTypeIndicator(node, isLeaf);

  // Determine stroke color based on state
  const effectiveHighlightColor = highlightColor || '#22d3ee';
  const strokeColor = isHighlighted
    ? effectiveHighlightColor
    : isOnPath
      ? '#22d3ee'
      : colors.border;
  const strokeWidth = isSelected ? 3 : isHighlighted || isOnPath ? 2.5 : 1.5;

  // Handle click - for group nodes, toggle collapse
  const handleClick = () => {
    if (node.type === 'group' && onGroupToggle) {
      onGroupToggle(id);
    } else {
      onSelect?.(id);
    }
  };

  // Determine border radius based on node type
  const borderRadius = isLeaf ? 8 : node.type === 'group' ? 12 : 4;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={handleClick}
      onMouseEnter={() => onHover?.(id)}
      onMouseLeave={() => onHover?.(null)}
      style={{ cursor: 'pointer' }}
    >
      {/* Node background */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={borderRadius}
        fill={colors.bg}
        stroke={isSelected ? '#f472b6' : strokeColor}
        strokeWidth={strokeWidth}
        opacity={isOnPath || isHighlighted ? 1 : 0.7}
      />

      {/* Glow effect for highlighted/path nodes */}
      {(isOnPath || isHighlighted) && (
        <rect
          x={-2}
          y={-2}
          width={width + 4}
          height={height + 4}
          rx={borderRadius + 2}
          fill="none"
          stroke={effectiveHighlightColor}
          strokeWidth={1}
          opacity={0.3}
        />
      )}

      {/* Conflict overlay in conflict mode */}
      {viewMode === 'conflict-overlay' && node.type === 'conflict_anchor' && (
        <rect
          x={-4}
          y={-4}
          width={width + 8}
          height={height + 8}
          rx={borderRadius + 4}
          fill="none"
          stroke="#ef4444"
          strokeWidth={2}
          strokeDasharray="4 2"
          opacity={0.8}
        />
      )}

      {/* Group node collapse indicator */}
      {node.type === 'group' && (
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={borderRadius}
          fill="none"
          stroke={colors.border}
          strokeWidth={1}
          strokeDasharray={isCollapsed ? '4 2' : undefined}
        />
      )}

      {/* Node content */}
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {isLeaf ? (
          <LeafNodeContent node={node as LeafNode} />
        ) : node.type === 'group' ? (
          <GroupNodeContent node={node as GroupNode} isCollapsed={isCollapsed} />
        ) : node.type === 'router' ? (
          <RouterNodeContent node={node as RouterNode} />
        ) : node.type === 'conflict_anchor' ? (
          <ConflictAnchorNodeContent node={node as ConflictAnchorNode} />
        ) : (
          <ConditionNodeContent node={node as ConditionNode} />
        )}
      </g>

      {/* Node type indicator */}
      <circle
        cx={width - 12}
        cy={12}
        r={6}
        fill={indicator.color}
        opacity={0.8}
      />
      <text
        x={width - 12}
        y={15}
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
      >
        {indicator.label}
      </text>
    </g>
  );
}
