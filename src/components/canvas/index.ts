/**
 * Canvas components barrel export
 */

// Layout components
export { CanvasLayout, LeftRailArea, CenterPaneArea, RightRailArea, WorkbenchArea } from './CanvasLayout';
export { PanelHeader } from './PanelHeader';
export { LeftRail } from './LeftRail';
export { CenterPane } from './CenterPane';
export { RightRail } from './RightRail';
export { BottomWorkbench } from './BottomWorkbench';

// Phase 3: Scenario Builder components
export { CollapsibleSection } from './CollapsibleSection';
export { ScenarioSummary } from './ScenarioSummary';
export { ScenarioBuilder } from './ScenarioBuilder';

// Phase 4: Tree interaction components
export { TreeToolbar, type ViewMode } from './TreeToolbar';
export { NodeInspector } from './NodeInspector';

// Phase 5: Right Rail decoder components
export { OutcomeSummary } from './OutcomeSummary';
export { DecoderPanel } from './DecoderPanel';
export { CitationsList } from './CitationsList';
export { AnchoredText, injectCitationMarkers } from './AnchoredText';
