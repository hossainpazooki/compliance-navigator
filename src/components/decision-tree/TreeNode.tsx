import type { LayoutNode } from '@/lib/svg/treeLayout';
import type { ConditionNode, LeafNode } from '@/types/decisionTree';
import { isLeafNode } from '@/types/decisionTree';

interface TreeNodeProps {
  layoutNode: LayoutNode;
  isSelected?: boolean;
  onSelect?: (nodeId: string) => void;
  onHover?: (nodeId: string | null) => void;
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
 * Truncate text with ellipsis
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function TreeNode({
  layoutNode,
  isSelected,
  onSelect,
  onHover,
}: TreeNodeProps) {
  const { id, x, y, width, height, node, isLeaf, isOnPath } = layoutNode;

  const colors = isLeaf
    ? getStatusColor((node as LeafNode).status)
    : { bg: '#1e293b', border: '#475569', text: '#e2e8f0' };

  // Highlight if on evaluation path
  const strokeColor = isOnPath ? '#22d3ee' : colors.border;
  const strokeWidth = isOnPath ? 2.5 : 1.5;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={() => onSelect?.(id)}
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
        rx={isLeaf ? 8 : 4}
        fill={colors.bg}
        stroke={isSelected ? '#f472b6' : strokeColor}
        strokeWidth={isSelected ? 3 : strokeWidth}
        opacity={isOnPath ? 1 : 0.7}
      />

      {/* Glow effect for path nodes */}
      {isOnPath && (
        <rect
          x={-2}
          y={-2}
          width={width + 4}
          height={height + 4}
          rx={isLeaf ? 10 : 6}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={1}
          opacity={0.3}
        />
      )}

      {/* Node content */}
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {isLeaf ? (
          <LeafNodeContent node={node as LeafNode} />
        ) : (
          <ConditionNodeContent node={node as ConditionNode} />
        )}
      </g>

      {/* Node type indicator */}
      <circle
        cx={width - 12}
        cy={12}
        r={6}
        fill={isLeaf ? '#10b981' : '#3b82f6'}
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
        {isLeaf ? 'L' : 'C'}
      </text>
    </g>
  );
}
