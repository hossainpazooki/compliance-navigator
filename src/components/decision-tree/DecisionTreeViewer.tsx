import { useState, useRef, useCallback, useMemo } from 'react';
import type { DecisionNode, TraceNode, LeafNode, ConditionNode } from '@/types/decisionTree';
import { isLeafNode } from '@/types/decisionTree';
import { calculateLayout, getPathFromTrace, DEFAULT_LAYOUT_CONFIG } from '@/lib/svg/treeLayout';
import { TreeNode } from './TreeNode';
import { TreeEdge } from './TreeEdge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared';

interface DecisionTreeViewerProps {
  tree: DecisionNode;
  trace?: TraceNode[];
  finalNode?: LeafNode;
  title?: string;
  onNodeSelect?: (node: DecisionNode) => void;
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

export function DecisionTreeViewer({
  tree,
  trace,
  finalNode,
  title = 'Decision Tree',
  onNodeSelect,
}: DecisionTreeViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Calculate path nodes from trace
  const pathNodeIds = useMemo(() => {
    if (!trace) return new Set<string>();
    const ids = getPathFromTrace(trace);
    if (finalNode) {
      ids.add(finalNode.nodeId);
    }
    return ids;
  }, [trace, finalNode]);

  // Calculate layout
  const layout = useMemo(() => {
    return calculateLayout(tree, DEFAULT_LAYOUT_CONFIG, pathNodeIds);
  }, [tree, pathNodeIds]);

  // Find node by ID
  const findNodeById = useCallback((nodeId: string): DecisionNode | null => {
    function search(node: DecisionNode): DecisionNode | null {
      if (node.nodeId === nodeId) return node;
      if (isLeafNode(node)) return null;
      return search(node.children.true) || search(node.children.false);
    }
    return search(tree);
  }, [tree]);

  // Get hovered node details
  const hoveredNode = hoveredNodeId ? findNodeById(hoveredNodeId) : null;

  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
    const node = findNodeById(nodeId);
    if (node && onNodeSelect) {
      onNodeSelect(node);
    }
  }, [findNodeById, onNodeSelect]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Zoom handlers
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * delta, 0.25), 2),
    }));
  }, []);

  // Reset view
  const handleReset = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 2) }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: Math.max(prev.scale * 0.8, 0.25) }));
  }, []);

  return (
    <Card variant="bordered">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span className="text-blue-400">🌳</span>
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="rounded bg-slate-700 px-2 py-1 text-sm text-slate-300 hover:bg-slate-600"
          >
            -
          </button>
          <span className="text-xs text-slate-400 w-12 text-center">
            {Math.round(transform.scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="rounded bg-slate-700 px-2 py-1 text-sm text-slate-300 hover:bg-slate-600"
          >
            +
          </button>
          <button
            onClick={handleReset}
            className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-600"
          >
            Reset
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {/* SVG Canvas */}
          <svg
            ref={svgRef}
            width="100%"
            height="500"
            className="bg-slate-900 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <defs>
              {/* Grid pattern */}
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Background grid */}
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Transformed content */}
            <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
              {/* Edges (rendered first, below nodes) */}
              {layout.edges.map(edge => (
                <TreeEdge key={edge.id} edge={edge} />
              ))}

              {/* Nodes */}
              {layout.nodes.map(layoutNode => (
                <TreeNode
                  key={layoutNode.id}
                  layoutNode={layoutNode}
                  isSelected={selectedNodeId === layoutNode.id}
                  onSelect={handleNodeSelect}
                  onHover={setHoveredNodeId}
                />
              ))}
            </g>
          </svg>

          {/* Hover tooltip */}
          {hoveredNode && (
            <div className="absolute top-2 left-2 max-w-xs rounded-lg bg-slate-800 p-3 shadow-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">
                {isLeafNode(hoveredNode) ? 'Leaf Node' : 'Condition Node'}
              </p>
              {isLeafNode(hoveredNode) ? (
                <>
                  <p className="text-sm text-white font-medium">{hoveredNode.decision}</p>
                  {hoveredNode.obligations && hoveredNode.obligations.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-400">Obligations:</p>
                      <ul className="text-xs text-slate-300 mt-1">
                        {hoveredNode.obligations.slice(0, 3).map((ob, i) => (
                          <li key={i}>• {ob}</li>
                        ))}
                        {hoveredNode.obligations.length > 3 && (
                          <li className="text-slate-500">+{hoveredNode.obligations.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p className="text-sm text-white font-medium">
                    {(hoveredNode as ConditionNode).annotation ||
                     `${(hoveredNode as ConditionNode).condition.fact} ${(hoveredNode as ConditionNode).condition.op}`}
                  </p>
                  {(hoveredNode as ConditionNode).sourceRef && (
                    <p className="text-xs text-blue-400 mt-1">
                      {(hoveredNode as ConditionNode).sourceRef?.document_id} Art. {(hoveredNode as ConditionNode).sourceRef?.article}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-2 right-2 rounded-lg bg-slate-800/90 p-2 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-cyan-500/50 border border-cyan-400" />
                <span className="text-slate-400">Evaluation Path</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-slate-400">Condition</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-slate-400">Leaf</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
