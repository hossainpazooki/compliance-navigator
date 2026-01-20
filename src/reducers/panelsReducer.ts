/**
 * Panels Reducer
 * Manages collapse/expand state for all canvas panels
 */

import type { PanelsState, PanelsAction, PanelState } from '@/types/canvas';

export const initialPanelsState: PanelsState = {
  leftRail: 'expanded',
  rightRail: 'expanded',
  workbench: 'collapsed',
  focusedPanel: null,
};

function togglePanelState(current: PanelState): PanelState {
  return current === 'expanded' ? 'collapsed' : 'expanded';
}

export function panelsReducer(state: PanelsState, action: PanelsAction): PanelsState {
  switch (action.type) {
    case 'TOGGLE':
      return {
        ...state,
        [action.id]: togglePanelState(state[action.id]),
        focusedPanel: null,
      };

    case 'EXPAND':
      return {
        ...state,
        [action.id]: 'expanded',
        focusedPanel: null,
      };

    case 'COLLAPSE':
      return {
        ...state,
        [action.id]: 'collapsed',
        focusedPanel: null,
      };

    case 'FOCUS_EXPAND':
      // Focus expand: target panel expands, others collapse
      return {
        leftRail: action.panelId === 'leftRail' ? 'expanded' : 'collapsed',
        rightRail: action.panelId === 'rightRail' ? 'expanded' : 'collapsed',
        workbench: action.panelId === 'workbench' ? 'expanded' : 'collapsed',
        focusedPanel: action.panelId,
      };

    case 'RESET':
      return initialPanelsState;

    default:
      return state;
  }
}
