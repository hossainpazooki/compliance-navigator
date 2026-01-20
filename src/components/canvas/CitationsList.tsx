/**
 * CitationsList - Display regulatory citations with relevance filtering
 */

import { useState, useCallback } from 'react';
import { Badge } from '@/components/shared';
import type { Citation } from '@/types/decoder';
import { cn } from '@/utils';

interface CitationsListProps {
  citations: Citation[];
  highlightedCitationId?: string;
  onCitationClick?: (citation: Citation) => void;
  onCitationHover?: (citationId: string | null) => void;
  className?: string;
}

type RelevanceFilter = 'all' | 'primary' | 'supporting' | 'contextual';

/**
 * Get variant for relevance badge
 */
function getRelevanceVariant(relevance: Citation['relevance']): 'success' | 'info' | 'default' {
  switch (relevance) {
    case 'primary':
      return 'success';
    case 'supporting':
      return 'info';
    default:
      return 'default';
  }
}

export function CitationsList({
  citations,
  highlightedCitationId,
  onCitationClick,
  onCitationHover,
  className,
}: CitationsListProps) {
  const [filter, setFilter] = useState<RelevanceFilter>('all');

  const filteredCitations = citations.filter((c) =>
    filter === 'all' ? true : c.relevance === filter
  );

  const handleCitationClick = useCallback(
    (citation: Citation) => {
      onCitationClick?.(citation);
    },
    [onCitationClick]
  );

  // Count by relevance for filter badges
  const counts = {
    all: citations.length,
    primary: citations.filter((c) => c.relevance === 'primary').length,
    supporting: citations.filter((c) => c.relevance === 'supporting').length,
    contextual: citations.filter((c) => c.relevance === 'contextual').length,
  };

  if (citations.length === 0) {
    return (
      <div className={cn('text-sm text-slate-500', className)}>
        No citations available.
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filter tabs */}
      <div className="mb-3 flex flex-wrap gap-2">
        {(['all', 'primary', 'supporting', 'contextual'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              filter === f
                ? 'bg-blue-500/20 text-blue-300'
                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Citations list */}
      <div className="space-y-2">
        {filteredCitations.map((citation) => (
          <div
            key={citation.id}
            onClick={() => handleCitationClick(citation)}
            onMouseEnter={() => onCitationHover?.(citation.id)}
            onMouseLeave={() => onCitationHover?.(null)}
            className={cn(
              'cursor-pointer rounded-lg bg-slate-700/30 p-3 transition-all',
              highlightedCitationId === citation.id
                ? 'ring-2 ring-amber-500/50 bg-slate-700/50'
                : 'hover:bg-slate-700/50'
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">
                    {citation.framework}
                  </span>
                  <Badge variant={getRelevanceVariant(citation.relevance)} size="sm">
                    {citation.relevance}
                  </Badge>
                </div>
                <p className="mt-1 font-medium text-white">{citation.reference}</p>
              </div>
              {citation.relevance_score !== undefined && (
                <span className="shrink-0 text-xs text-slate-500">
                  {Math.round(citation.relevance_score * 100)}%
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-400 line-clamp-2">{citation.text}</p>
            <div className="mt-2 flex items-center gap-3">
              {citation.url && (
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-blue-400 hover:underline"
                >
                  View source →
                </a>
              )}
              {citation.effective_date && (
                <span className="text-xs text-slate-500">
                  Effective: {citation.effective_date}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCitations.length === 0 && (
        <p className="text-sm text-slate-500">
          No {filter} citations found.
        </p>
      )}
    </div>
  );
}
