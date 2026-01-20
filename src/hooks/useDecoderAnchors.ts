/**
 * useDecoderAnchors - Hook to manage citation anchor highlighting
 * Coordinates highlighting between citations list and tree nodes
 */

import { useState, useCallback, useMemo } from 'react';
import type { Citation } from '@/types/decoder';

interface UseDecoderAnchorsOptions {
  /** Called when a citation should highlight tree nodes */
  onHighlightTreeNodes?: (nodeIds: string[]) => void;
  /** Called when tree node highlight should be cleared */
  onClearHighlight?: () => void;
}

interface UseDecoderAnchorsReturn {
  /** Currently highlighted citation ID */
  highlightedCitationId: string | null;
  /** Set the highlighted citation */
  setHighlightedCitation: (citationId: string | null) => void;
  /** Currently selected citation */
  selectedCitation: Citation | null;
  /** Select a citation (for detailed view) */
  selectCitation: (citation: Citation | null) => void;
  /** Handle citation hover - highlights in UI and optionally tree nodes */
  handleCitationHover: (citationId: string | null, citations?: Citation[]) => void;
  /** Handle citation click - selects and potentially navigates */
  handleCitationClick: (citation: Citation) => void;
  /** Map of citation IDs to their associated tree node IDs */
  citationNodeMap: Map<string, string[]>;
  /** Build the citation-to-node mapping from citations */
  buildCitationNodeMap: (citations: Citation[]) => void;
}

/**
 * Extract tree node IDs from a citation's sourceRef or annotation
 * Citations may link to specific tree nodes via annotation_id or sourceRef
 */
function extractNodeIdsFromCitation(citation: Citation): string[] {
  const nodeIds: string[] = [];

  // Check for annotation_id pattern (e.g., "node_xyz" or "condition_abc")
  if (citation.id) {
    // Some citation IDs may directly reference nodes
    const nodeMatch = citation.id.match(/^(node|condition|leaf)_(.+)$/);
    if (nodeMatch) {
      nodeIds.push(citation.id);
    }
  }

  // Check reference for node patterns (e.g., "Art. 3(1) applies to node_123")
  const nodeRefPattern = /\b(node|condition|leaf)_([a-zA-Z0-9_-]+)\b/g;
  let match;
  while ((match = nodeRefPattern.exec(citation.full_reference || '')) !== null) {
    nodeIds.push(match[0]);
  }

  return nodeIds;
}

export function useDecoderAnchors(
  options: UseDecoderAnchorsOptions = {}
): UseDecoderAnchorsReturn {
  const { onHighlightTreeNodes, onClearHighlight } = options;

  const [highlightedCitationId, setHighlightedCitationId] = useState<string | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [citationNodeMap, setCitationNodeMap] = useState<Map<string, string[]>>(new Map());

  // Build citation-to-node mapping
  const buildCitationNodeMap = useCallback((citations: Citation[]) => {
    const map = new Map<string, string[]>();
    citations.forEach((citation) => {
      const nodeIds = extractNodeIdsFromCitation(citation);
      if (nodeIds.length > 0) {
        map.set(citation.id, nodeIds);
      }
    });
    setCitationNodeMap(map);
  }, []);

  // Handle citation hover
  const handleCitationHover = useCallback(
    (citationId: string | null, _citations?: Citation[]) => {
      setHighlightedCitationId(citationId);

      if (citationId && onHighlightTreeNodes) {
        // Find associated tree nodes
        const nodeIds = citationNodeMap.get(citationId);
        if (nodeIds && nodeIds.length > 0) {
          onHighlightTreeNodes(nodeIds);
        }
      } else if (!citationId && onClearHighlight) {
        onClearHighlight();
      }
    },
    [citationNodeMap, onHighlightTreeNodes, onClearHighlight]
  );

  // Handle citation click
  const handleCitationClick = useCallback(
    (citation: Citation) => {
      setSelectedCitation(citation);
      setHighlightedCitationId(citation.id);

      // Highlight associated tree nodes
      if (onHighlightTreeNodes) {
        const nodeIds = citationNodeMap.get(citation.id);
        if (nodeIds && nodeIds.length > 0) {
          onHighlightTreeNodes(nodeIds);
        }
      }
    },
    [citationNodeMap, onHighlightTreeNodes]
  );

  // Select citation
  const selectCitation = useCallback((citation: Citation | null) => {
    setSelectedCitation(citation);
    if (citation) {
      setHighlightedCitationId(citation.id);
    }
  }, []);

  // Set highlighted citation
  const setHighlightedCitation = useCallback(
    (citationId: string | null) => {
      setHighlightedCitationId(citationId);
      if (!citationId && onClearHighlight) {
        onClearHighlight();
      }
    },
    [onClearHighlight]
  );

  return useMemo(
    () => ({
      highlightedCitationId,
      setHighlightedCitation,
      selectedCitation,
      selectCitation,
      handleCitationHover,
      handleCitationClick,
      citationNodeMap,
      buildCitationNodeMap,
    }),
    [
      highlightedCitationId,
      setHighlightedCitation,
      selectedCitation,
      selectCitation,
      handleCitationHover,
      handleCitationClick,
      citationNodeMap,
      buildCitationNodeMap,
    ]
  );
}
