/**
 * Canvas Reducer
 * Manages global canvas UI state (loading, error, stale)
 */

import type { CanvasState, CanvasAction } from '@/types/canvas';

export const initialCanvasState: CanvasState = {
  uiState: 'idle',
  lastError: undefined,
  inputsChangedSinceRun: false,
};

export function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'SET_STATE':
      return {
        ...state,
        uiState: action.state,
        // Clear error when transitioning to non-error state
        lastError: action.state === 'error' ? state.lastError : undefined,
        // Clear inputs changed flag when successful
        inputsChangedSinceRun: action.state === 'success' ? false : state.inputsChangedSinceRun,
      };

    case 'SET_ERROR':
      return {
        ...state,
        uiState: 'error',
        lastError: action.error,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        uiState: state.uiState === 'error' ? 'idle' : state.uiState,
        lastError: undefined,
      };

    case 'MARK_INPUTS_CHANGED':
      return {
        ...state,
        uiState: state.uiState === 'success' ? 'stale' : state.uiState,
        inputsChangedSinceRun: true,
      };

    case 'MARK_INPUTS_SYNCED':
      return {
        ...state,
        inputsChangedSinceRun: false,
      };

    case 'RESET':
      return initialCanvasState;

    default:
      return state;
  }
}
