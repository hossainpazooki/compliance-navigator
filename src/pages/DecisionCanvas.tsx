/**
 * DecisionCanvas Page
 * Single-screen compliance workstation with 3-column + workbench layout
 */

import { CanvasProvider } from '@/contexts';
import {
  CanvasHeader,
  CanvasLayout,
  LeftRail,
  CenterPane,
  RightRail,
  BottomWorkbench,
} from '@/components/canvas';

export function DecisionCanvas() {
  return (
    <CanvasProvider>
      <CanvasHeader />
      <CanvasLayout>
        <LeftRail />
        <CenterPane />
        <RightRail />
        <BottomWorkbench />
      </CanvasLayout>
    </CanvasProvider>
  );
}
