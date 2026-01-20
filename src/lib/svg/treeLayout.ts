import type { DecisionNode, ConditionNode } from '@/types/decisionTree';
import { isLeafNode, isConditionNode } from '@/types/decisionTree';

/**
 * Layout configuration for tree rendering
 */
export interface LayoutConfig {
  nodeWidth: number;
  nodeHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
  padding: number;
}

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  nodeWidth: 200,
  nodeHeight: 80,
  horizontalSpacing: 40,
  verticalSpacing: 60,
  padding: 20,
};

/**
 * A positioned node in the layout
 */
export interface LayoutNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  node: DecisionNode;
  depth: number;
  isLeaf: boolean;
  /** Whether this node is on the evaluation path */
  isOnPath?: boolean;
}

/**
 * An edge connecting two nodes
 */
export interface LayoutEdge {
  id: string;
  fromId: string;
  toId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  label: 'true' | 'false';
  /** Whether this edge is on the evaluation path */
  isOnPath?: boolean;
}

/**
 * Complete layout result
 */
export interface TreeLayout {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  width: number;
  height: number;
}

/**
 * Calculate tree layout using a simple recursive algorithm
 * Based on Reingold-Tilford style layout
 */
export function calculateLayout(
  tree: DecisionNode,
  config: LayoutConfig = DEFAULT_LAYOUT_CONFIG,
  evaluationPath?: Set<string>
): TreeLayout {
  const nodes: LayoutNode[] = [];
  const edges: LayoutEdge[] = [];

  const { nodeWidth, nodeHeight, horizontalSpacing, verticalSpacing, padding } = config;

  // Calculate positions recursively
  function layoutNode(
    node: DecisionNode,
    depth: number,
    leftBound: number
  ): { x: number; width: number } {
    const isLeaf = isLeafNode(node);
    const isOnPath = evaluationPath?.has(node.nodeId) ?? false;

    if (isLeaf) {
      const x = leftBound;
      nodes.push({
        id: node.nodeId,
        x: x + padding,
        y: depth * (nodeHeight + verticalSpacing) + padding,
        width: nodeWidth,
        height: nodeHeight,
        node,
        depth,
        isLeaf: true,
        isOnPath,
      });
      return { x, width: nodeWidth + horizontalSpacing };
    }

    // Only ConditionNodes have true/false children for binary tree layout
    if (!isConditionNode(node)) {
      // For GroupNode, RouterNode, ConflictAnchorNode - render as single node for now
      const x = leftBound;
      nodes.push({
        id: node.nodeId,
        x: x + padding,
        y: depth * (nodeHeight + verticalSpacing) + padding,
        width: nodeWidth,
        height: nodeHeight,
        node,
        depth,
        isLeaf: false,
        isOnPath,
      });
      return { x, width: nodeWidth + horizontalSpacing };
    }

    // Layout children first (ConditionNode has true/false children)
    const conditionNode = node as ConditionNode;
    const leftChild = layoutNode(conditionNode.children.false, depth + 1, leftBound);
    const rightChild = layoutNode(conditionNode.children.true, depth + 1, leftBound + leftChild.width);

    // Position this node centered above children
    const totalWidth = leftChild.width + rightChild.width;
    const x = leftBound + totalWidth / 2 - nodeWidth / 2;

    const layoutNodeData: LayoutNode = {
      id: node.nodeId,
      x: x + padding,
      y: depth * (nodeHeight + verticalSpacing) + padding,
      width: nodeWidth,
      height: nodeHeight,
      node,
      depth,
      isLeaf: false,
      isOnPath,
    };
    nodes.push(layoutNodeData);

    // Create edges to children
    const parentCenterX = layoutNodeData.x + nodeWidth / 2;
    const parentBottomY = layoutNodeData.y + nodeHeight;

    // Find child nodes
    const falseChild = nodes.find(n => n.id === conditionNode.children.false.nodeId);
    const trueChild = nodes.find(n => n.id === conditionNode.children.true.nodeId);

    if (falseChild) {
      const isEdgeOnPath = isOnPath && evaluationPath?.has(falseChild.id);
      edges.push({
        id: `${node.nodeId}-false`,
        fromId: node.nodeId,
        toId: falseChild.id,
        fromX: parentCenterX,
        fromY: parentBottomY,
        toX: falseChild.x + nodeWidth / 2,
        toY: falseChild.y,
        label: 'false',
        isOnPath: isEdgeOnPath,
      });
    }

    if (trueChild) {
      const isEdgeOnPath = isOnPath && evaluationPath?.has(trueChild.id);
      edges.push({
        id: `${node.nodeId}-true`,
        fromId: node.nodeId,
        toId: trueChild.id,
        fromX: parentCenterX,
        fromY: parentBottomY,
        toX: trueChild.x + nodeWidth / 2,
        toY: trueChild.y,
        label: 'true',
        isOnPath: isEdgeOnPath,
      });
    }

    return { x: leftBound, width: totalWidth };
  }

  layoutNode(tree, 0, 0);

  // Calculate total dimensions
  const maxX = Math.max(...nodes.map(n => n.x + n.width));
  const maxY = Math.max(...nodes.map(n => n.y + n.height));

  return {
    nodes,
    edges,
    width: maxX + padding,
    height: maxY + padding,
  };
}

/**
 * Generate SVG path for a curved edge
 */
export function generateEdgePath(edge: LayoutEdge): string {
  const { fromX, fromY, toX, toY } = edge;
  const midY = (fromY + toY) / 2;

  // Bezier curve
  return `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;
}

/**
 * Get nodes on the evaluation path from a trace
 */
export function getPathFromTrace(trace: { nodeId: string }[]): Set<string> {
  return new Set(trace.map(t => t.nodeId));
}
