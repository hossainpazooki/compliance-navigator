import type { NavigateResponse } from '@/types/navigate';

interface StatItem {
  label: string;
  value: string | number;
  highlight?: boolean;
}

interface QuickStatsProps {
  result: NavigateResponse;
}

export function QuickStats({ result }: QuickStatsProps) {
  const stats: StatItem[] = [
    {
      label: 'Jurisdictions',
      value: result.applicable_jurisdictions.length,
    },
    {
      label: 'Pathway Steps',
      value: result.pathway.length,
    },
    {
      label: 'Conflicts',
      value: result.conflicts.length,
      highlight: result.conflicts.length > 0,
    },
    {
      label: 'Est. Timeline',
      value: result.estimated_timeline,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg bg-slate-700/50 p-4"
        >
          <p className="text-sm text-slate-400">{stat.label}</p>
          <p
            className={`text-2xl font-bold ${
              stat.highlight ? 'text-yellow-400' : 'text-white'
            }`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
