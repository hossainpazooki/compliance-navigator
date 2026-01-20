/**
 * Decision Canvas state types
 * Phase 1: Foundation types for panel, tree, and canvas state management
 */

// Panel collapse states
export type PanelState = 'expanded' | 'collapsed';
export type PanelId = 'leftRail' | 'rightRail' | 'workbench';

export interface PanelsState {
  leftRail: PanelState;
  rightRail: PanelState;
  workbench: PanelState;
  focusedPanel: PanelId | null;
}

// Global canvas UI state
export type CanvasUIState = 'idle' | 'loading' | 'success' | 'error' | 'stale';

export interface CanvasError {
  message: string;
  requestId?: string;
}

export interface CanvasState {
  uiState: CanvasUIState;
  lastError?: CanvasError;
  inputsChangedSinceRun: boolean;
}

// Tree interaction state
export type HighlightSource = 'jurisdiction' | 'pathway' | 'conflict' | 'decoder' | null;

export interface TreeState {
  selectedNodeId: string | null;
  highlightedNodeIds: Set<string>;
  highlightSource: HighlightSource;
  expandedGroups: Set<string>;
}

// Panel actions
export type PanelsAction =
  | { type: 'TOGGLE'; id: PanelId }
  | { type: 'EXPAND'; id: PanelId }
  | { type: 'COLLAPSE'; id: PanelId }
  | { type: 'FOCUS_EXPAND'; panelId: PanelId }
  | { type: 'RESET' };

// Tree actions
export type TreeAction =
  | { type: 'SELECT'; nodeId: string | null }
  | { type: 'HIGHLIGHT'; nodeIds: string[]; source: HighlightSource }
  | { type: 'CLEAR_HIGHLIGHT' }
  | { type: 'TOGGLE_GROUP'; groupId: string }
  | { type: 'EXPAND_GROUP'; groupId: string }
  | { type: 'COLLAPSE_GROUP'; groupId: string }
  | { type: 'RESET' };

// Canvas actions
export type CanvasAction =
  | { type: 'SET_STATE'; state: CanvasUIState }
  | { type: 'SET_ERROR'; error: CanvasError }
  | { type: 'CLEAR_ERROR' }
  | { type: 'MARK_INPUTS_CHANGED' }
  | { type: 'MARK_INPUTS_SYNCED' }
  | { type: 'RESET' };
