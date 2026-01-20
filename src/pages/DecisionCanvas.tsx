/**
 * DecisionCanvas Page
 * Single-screen compliance workstation with 3-column + workbench layout
 */

import { CanvasProvider } from '@/contexts';
import {
  CanvasLayout,
  LeftRail,
  CenterPane,
  RightRail,
  BottomWorkbench,
} from '@/components/canvas';

export function DecisionCanvas() {
  return (
    <CanvasProvider>
      <CanvasLayout>
        <LeftRail />
        <CenterPane />
        <RightRail />
        <BottomWorkbench />
      </CanvasLayout>
    </CanvasProvider>
  );
}
