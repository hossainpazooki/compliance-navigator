import type { LayoutEdge } from '@/lib/svg/treeLayout';
import { generateEdgePath } from '@/lib/svg/treeLayout';

interface TreeEdgeProps {
  edge: LayoutEdge;
}

export function TreeEdge({ edge }: TreeEdgeProps) {
  const { label, isOnPath } = edge;
  const path = generateEdgePath(edge);

  // Colors based on true/false branch
  const baseColor = label === 'true' ? '#10b981' : '#ef4444';
  const pathColor = isOnPath ? '#22d3ee' : baseColor;
  const opacity = isOnPath ? 1 : 0.5;

  // Label position (midpoint of edge)
  const labelX = (edge.fromX + edge.toX) / 2;
  const labelY = (edge.fromY + edge.toY) / 2;

  return (
    <g>
      {/* Edge path */}
      <path
        d={path}
        fill="none"
        stroke={pathColor}
        strokeWidth={isOnPath ? 2.5 : 1.5}
        opacity={opacity}
        strokeLinecap="round"
      />

      {/* Glow effect for path edges */}
      {isOnPath && (
        <path
          d={path}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={6}
          opacity={0.2}
          strokeLinecap="round"
        />
      )}

      {/* Arrow marker */}
      <circle
        cx={edge.toX}
        cy={edge.toY - 4}
        r={3}
        fill={pathColor}
        opacity={opacity}
      />

      {/* Edge label */}
      <g transform={`translate(${labelX}, ${labelY})`}>
        <rect
          x={-18}
          y={-8}
          width={36}
          height={16}
          rx={4}
          fill={label === 'true' ? '#064e3b' : '#7f1d1d'}
          opacity={0.9}
        />
        <text
          x={0}
          y={4}
          textAnchor="middle"
          fill={label === 'true' ? '#6ee7b7' : '#fca5a5'}
          fontSize="10"
          fontWeight="500"
        >
          {label}
        </text>
      </g>
    </g>
  );
}
