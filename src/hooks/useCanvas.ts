/**
 * useCanvas Hook
 * Main consumer hook for the Canvas Context
 */

import { useContext } from 'react';
import { CanvasContext, type CanvasContextValue } from '@/contexts';

/**
 * Access the Canvas context from within a CanvasProvider.
 * Throws an error if used outside of the provider.
 */
export function useCanvas(): CanvasContextValue {
  const context = useContext(CanvasContext);

  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }

  return context;
}

/**
 * Hook for panel-specific operations
 */
export function usePanelState() {
  const {
    panels,
    togglePanel,
    expandPanel,
    collapsePanel,
    focusExpandPanel,
    resetPanels,
  } = useCanvas();

  return {
    panels,
    togglePanel,
    expandPanel,
    collapsePanel,
    focusExpandPanel,
    resetPanels,
    isExpanded: (id: 'leftRail' | 'rightRail' | 'workbench') => panels[id] === 'expanded',
    isCollapsed: (id: 'leftRail' | 'rightRail' | 'workbench') => panels[id] === 'collapsed',
    isFocused: (id: 'leftRail' | 'rightRail' | 'workbench') => panels.focusedPanel === id,
  };
}

/**
 * Hook for tree-specific operations
 */
export function useTreeHighlight() {
  const {
    tree,
    selectNode,
    highlightNodes,
    clearHighlight,
    toggleGroup,
    expandGroup,
    collapseGroup,
    resetTree,
  } = useCanvas();

  return {
    tree,
    selectNode,
    highlightNodes,
    clearHighlight,
    toggleGroup,
    expandGroup,
    collapseGroup,
    resetTree,
    isNodeSelected: (nodeId: string) => tree.selectedNodeId === nodeId,
    isNodeHighlighted: (nodeId: string) => tree.highlightedNodeIds.has(nodeId),
    isGroupExpanded: (groupId: string) => tree.expandedGroups.has(groupId),
  };
}

/**
 * Hook for canvas state operations
 */
export function useCanvasState() {
  const {
    canvas,
    setCanvasState,
    setCanvasError,
    clearCanvasError,
    markInputsChanged,
    markInputsSynced,
    resetCanvas,
    navigationResult,
    analysisComplete,
  } = useCanvas();

  return {
    canvas,
    setCanvasState,
    setCanvasError,
    clearCanvasError,
    markInputsChanged,
    markInputsSynced,
    resetCanvas,
    navigationResult,
    analysisComplete,
    isLoading: canvas.uiState === 'loading',
    isError: canvas.uiState === 'error',
    isStale: canvas.uiState === 'stale',
    isSuccess: canvas.uiState === 'success',
    isIdle: canvas.uiState === 'idle',
  };
}
