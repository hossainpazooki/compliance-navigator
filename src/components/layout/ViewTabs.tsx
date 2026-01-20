import { NavLink } from 'react-router-dom';
import { cn } from '@/utils';
import { useResultsStore } from '@/stores';

interface TabItem {
  path: string;
  label: string;
  requiresAnalysis?: boolean;
}

const tabs: TabItem[] = [
  { path: '/', label: 'Navigator' },
  { path: '/pathway', label: 'Pathway', requiresAnalysis: true },
  { path: '/conflicts', label: 'Conflicts', requiresAnalysis: true },
  { path: '/whatif', label: 'What-If', requiresAnalysis: true },
  { path: '/decoder', label: 'Decoder', requiresAnalysis: true },
  { path: '/logic', label: 'Logic' },
];

export function ViewTabs() {
  const { analysisComplete } = useResultsStore();

  return (
    <nav className="border-b border-slate-700 bg-slate-800/30">
      <div className="container mx-auto px-4">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const isDisabled = tab.requiresAnalysis && !analysisComplete;

            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={({ isActive }) =>
                  cn(
                    'relative px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-white'
                      : isDisabled
                        ? 'cursor-not-allowed text-slate-500'
                        : 'text-slate-400 hover:text-white',
                    isActive &&
                      'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500'
                  )
                }
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                  }
                }}
              >
                {tab.label}
                {tab.requiresAnalysis && !analysisComplete && (
                  <span className="ml-1 text-xs text-slate-500">(run analysis first)</span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
