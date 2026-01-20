import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { DecisionNode, TraceNode } from '@/types/decisionTree';
import type { JurisdictionCode } from '@/types/common';
import type { ViewMode } from '@/components/canvas/TreeToolbar';

interface UseTreeNavigationOptions {
  tree: DecisionNode | null;
  trace?: TraceNode[];
  initialZoom?: number;
}

interface TreeNavigationState {
  // Zoom
  zoomLevel: number;
  // Pan
  panX: number;
  panY: number;
  // Search
  searchQuery: string;
  searchResults: string[];
  currentSearchIndex: number;
  // Filter
  jurisdictionFilter: JurisdictionCode | null;
  // View mode
  viewMode: ViewMode;
  // Selection
  selectedNodeId: string | null;
  highlightedNodeIds: Set<string>;
}

function collectAllNodeIds(node: DecisionNode): string[] {
  const ids: string[] = [node.nodeId];

  if (node.type === 'condition') {
    ids.push(...collectAllNodeIds(node.children.true));
    ids.push(...collectAllNodeIds(node.children.false));
  } else if (node.type === 'group') {
    node.children.forEach((child) => {
      ids.push(...collectAllNodeIds(child));
    });
  }

  return ids;
}

function searchNodes(node: DecisionNode, query: string): string[] {
  const matches: string[] = [];
  const lowerQuery = query.toLowerCase();

  function search(n: DecisionNode) {
    // Check node ID
    if (n.nodeId.toLowerCase().includes(lowerQuery)) {
      matches.push(n.nodeId);
    }

    // Check label if present
    if ('label' in n && n.label?.toLowerCase().includes(lowerQuery)) {
      if (!matches.includes(n.nodeId)) {
        matches.push(n.nodeId);
      }
    }

    // Check condition
    if (n.type === 'condition') {
      if (n.condition.fact.toLowerCase().includes(lowerQuery)) {
        if (!matches.includes(n.nodeId)) {
          matches.push(n.nodeId);
        }
      }
      search(n.children.true);
      search(n.children.false);
    }

    // Check decision
    if (n.type === 'leaf') {
      if (n.decision.toLowerCase().includes(lowerQuery)) {
        if (!matches.includes(n.nodeId)) {
          matches.push(n.nodeId);
        }
      }
    }

    // Check group children
    if (n.type === 'group') {
      n.children.forEach(search);
    }
  }

  search(node);
  return matches;
}

/**
 * useTreeNavigation - Pan/zoom/search/filter logic for the decision tree
 */
export function useTreeNavigation({ tree, trace, initialZoom = 1 }: UseTreeNavigationOptions) {
  const [state, setState] = useState<TreeNavigationState>({
    zoomLevel: initialZoom,
    panX: 0,
    panY: 0,
    searchQuery: '',
    searchResults: [],
    currentSearchIndex: 0,
    jurisdictionFilter: null,
    viewMode: 'baseline',
    selectedNodeId: null,
    highlightedNodeIds: new Set(),
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // All node IDs in the tree
  const allNodeIds = useMemo(() => {
    if (!tree) return [];
    return collectAllNodeIds(tree);
  }, [tree]);

  // Trace node IDs for highlighting
  const traceNodeIds = useMemo(() => {
    if (!trace) return new Set<string>();
    return new Set(trace.map((t) => t.nodeId));
  }, [trace]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setState((prev) => ({
      ...prev,
      zoomLevel: Math.min(prev.zoomLevel + 0.1, 2),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setState((prev) => ({
      ...prev,
      zoomLevel: Math.max(prev.zoomLevel - 0.1, 0.25),
    }));
  }, []);

  const zoomReset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      zoomLevel: 1,
      panX: 0,
      panY: 0,
    }));
  }, []);

  const setZoom = useCallback((level: number) => {
    setState((prev) => ({
      ...prev,
      zoomLevel: Math.max(0.25, Math.min(2, level)),
    }));
  }, []);

  // Pan controls
  const setPan = useCallback((x: number, y: number) => {
    setState((prev) => ({
      ...prev,
      panX: x,
      panY: y,
    }));
  }, []);

  // Search
  const setSearchQuery = useCallback(
    (query: string) => {
      if (!tree || !query.trim()) {
        setState((prev) => ({
          ...prev,
          searchQuery: query,
          searchResults: [],
          currentSearchIndex: 0,
        }));
        return;
      }

      const results = searchNodes(tree, query.trim());
      setState((prev) => ({
        ...prev,
        searchQuery: query,
        searchResults: results,
        currentSearchIndex: 0,
        highlightedNodeIds: new Set(results),
      }));
    },
    [tree]
  );

  const nextSearchResult = useCallback(() => {
    setState((prev) => {
      if (prev.searchResults.length === 0) return prev;
      const nextIndex = (prev.currentSearchIndex + 1) % prev.searchResults.length;
      return {
        ...prev,
        currentSearchIndex: nextIndex,
        selectedNodeId: prev.searchResults[nextIndex],
      };
    });
  }, []);

  const prevSearchResult = useCallback(() => {
    setState((prev) => {
      if (prev.searchResults.length === 0) return prev;
      const prevIndex =
        prev.currentSearchIndex === 0
          ? prev.searchResults.length - 1
          : prev.currentSearchIndex - 1;
      return {
        ...prev,
        currentSearchIndex: prevIndex,
        selectedNodeId: prev.searchResults[prevIndex],
      };
    });
  }, []);

  // Jurisdiction filter
  const setJurisdictionFilter = useCallback((jurisdiction: JurisdictionCode | null) => {
    setState((prev) => ({
      ...prev,
      jurisdictionFilter: jurisdiction,
    }));
  }, []);

  // View mode
  const setViewMode = useCallback((mode: ViewMode) => {
    setState((prev) => ({
      ...prev,
      viewMode: mode,
    }));
  }, []);

  // Selection
  const selectNode = useCallback((nodeId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedNodeId: nodeId,
    }));
  }, []);

  // Highlighting
  const setHighlightedNodes = useCallback((nodeIds: Set<string>) => {
    setState((prev) => ({
      ...prev,
      highlightedNodeIds: nodeIds,
    }));
  }, []);

  const highlightNodes = useCallback((nodeIds: string[]) => {
    setState((prev) => ({
      ...prev,
      highlightedNodeIds: new Set([...prev.highlightedNodeIds, ...nodeIds]),
    }));
  }, []);

  const clearHighlights = useCallback(() => {
    setState((prev) => ({
      ...prev,
      highlightedNodeIds: new Set(),
    }));
  }, []);

  // Navigate to a specific node
  const navigateToNode = useCallback((nodeId: string) => {
    // Select the node
    setState((prev) => ({
      ...prev,
      selectedNodeId: nodeId,
      highlightedNodeIds: new Set([nodeId]),
    }));

    // In a real implementation, this would calculate the node position
    // and pan/zoom to center it in the viewport
    // For now, we just select it
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectNode(null);
        clearHighlights();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        // Focus search input - would need a ref to the input
      }
      if (e.key === 'Enter' && state.searchResults.length > 0) {
        if (e.shiftKey) {
          prevSearchResult();
        } else {
          nextSearchResult();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.searchResults.length, selectNode, clearHighlights, nextSearchResult, prevSearchResult]);

  // Available jurisdictions (from tree scope)
  const availableJurisdictions = useMemo((): JurisdictionCode[] => {
    if (!tree) return [];
    const jurisdictions = new Set<JurisdictionCode>();

    function collect(node: DecisionNode) {
      if ('scope' in node && node.scope?.jurisdictions) {
        node.scope.jurisdictions.forEach((j) => jurisdictions.add(j));
      }
      if (node.type === 'condition') {
        collect(node.children.true);
        collect(node.children.false);
      } else if (node.type === 'group') {
        node.children.forEach(collect);
      } else if (node.type === 'router') {
        node.branches.forEach((b) => jurisdictions.add(b.jurisdiction));
      }
    }

    collect(tree);
    return Array.from(jurisdictions);
  }, [tree]);

  return {
    // State
    ...state,
    containerRef,
    allNodeIds,
    traceNodeIds,
    availableJurisdictions,

    // Zoom
    zoomIn,
    zoomOut,
    zoomReset,
    setZoom,

    // Pan
    setPan,

    // Search
    setSearchQuery,
    nextSearchResult,
    prevSearchResult,

    // Filter
    setJurisdictionFilter,

    // View mode
    setViewMode,

    // Selection
    selectNode,

    // Highlighting
    setHighlightedNodes,
    highlightNodes,
    clearHighlights,

    // Navigation
    navigateToNode,
  };
}
