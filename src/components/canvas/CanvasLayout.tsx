/**
 * CanvasLayout Component
 * CSS Grid orchestration for the Decision Canvas 3-column + workbench layout
 */

import { type ReactNode } from 'react';
import { usePanelState } from '@/hooks';
import { cn } from '@/utils';

interface CanvasLayoutProps {
  children: ReactNode;
}

export function CanvasLayout({ children }: CanvasLayoutProps) {
  const { panels } = usePanelState();

  // Calculate grid template columns based on panel states
  const leftWidth = panels.leftRail === 'expanded' ? '320px' : '72px';
  const rightWidth = panels.rightRail === 'expanded' ? '360px' : '72px';
  const workbenchHeight = panels.workbench === 'expanded' ? '280px' : '72px';

  return (
    <div
      className="grid h-[calc(100vh-64px)] w-full overflow-hidden"
      style={{
        gridTemplateColumns: `${leftWidth} 1fr ${rightWidth}`,
        gridTemplateRows: `1fr ${workbenchHeight}`,
        gridTemplateAreas: `
          "left center right"
          "workbench workbench workbench"
        `,
      }}
    >
      {children}
    </div>
  );
}

// Grid area wrapper components for semantic layout
interface GridAreaProps {
  children: ReactNode;
  className?: string;
}

export function LeftRailArea({ children, className }: GridAreaProps) {
  const { panels } = usePanelState();

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden border-r border-slate-700 bg-slate-900 transition-all duration-300',
        panels.leftRail === 'collapsed' && 'w-[72px]',
        className
      )}
      style={{ gridArea: 'left' }}
    >
      {children}
    </div>
  );
}

export function CenterPaneArea({ children, className }: GridAreaProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col overflow-hidden bg-slate-900',
        className
      )}
      style={{ gridArea: 'center' }}
    >
      {children}
    </div>
  );
}

export function RightRailArea({ children, className }: GridAreaProps) {
  const { panels } = usePanelState();

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden border-l border-slate-700 bg-slate-900 transition-all duration-300',
        panels.rightRail === 'collapsed' && 'w-[72px]',
        className
      )}
      style={{ gridArea: 'right' }}
    >
      {children}
    </div>
  );
}

export function WorkbenchArea({ children, className }: GridAreaProps) {
  const { panels } = usePanelState();

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden border-t border-slate-700 bg-slate-900 transition-all duration-300',
        panels.workbench === 'collapsed' && 'h-[72px]',
        className
      )}
      style={{ gridArea: 'workbench' }}
    >
      {children}
    </div>
  );
}
