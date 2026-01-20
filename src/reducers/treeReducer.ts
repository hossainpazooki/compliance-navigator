/**
 * Tree Reducer
 * Manages decision tree interaction state (selection, highlighting, groups)
 */

import type { TreeState, TreeAction } from '@/types/canvas';

export const initialTreeState: TreeState = {
  selectedNodeId: null,
  highlightedNodeIds: new Set(),
  highlightSource: null,
  expandedGroups: new Set(),
};

export function treeReducer(state: TreeState, action: TreeAction): TreeState {
  switch (action.type) {
    case 'SELECT':
      return {
        ...state,
        selectedNodeId: action.nodeId,
      };

    case 'HIGHLIGHT':
      return {
        ...state,
        highlightedNodeIds: new Set(action.nodeIds),
        highlightSource: action.source,
      };

    case 'CLEAR_HIGHLIGHT':
      return {
        ...state,
        highlightedNodeIds: new Set(),
        highlightSource: null,
      };

    case 'TOGGLE_GROUP': {
      const newExpanded = new Set(state.expandedGroups);
      if (newExpanded.has(action.groupId)) {
        newExpanded.delete(action.groupId);
      } else {
        newExpanded.add(action.groupId);
      }
      return {
        ...state,
        expandedGroups: newExpanded,
      };
    }

    case 'EXPAND_GROUP': {
      const newExpanded = new Set(state.expandedGroups);
      newExpanded.add(action.groupId);
      return {
        ...state,
        expandedGroups: newExpanded,
      };
    }

    case 'COLLAPSE_GROUP': {
      const newExpanded = new Set(state.expandedGroups);
      newExpanded.delete(action.groupId);
      return {
        ...state,
        expandedGroups: newExpanded,
      };
    }

    case 'RESET':
      return initialTreeState;

    default:
      return state;
  }
}
