/**
 * DecoderPanel - Full decoder explanation with conditions, warnings, and citations
 * Follows Droit pattern: AI explanation is collapsible, canonical decision is prominent
 */

import { useState, useCallback } from 'react';
import { Badge, Button } from '@/components/shared';
import { CitationsList } from './CitationsList';
import { AnchoredText } from './AnchoredText';
import type { DecoderResponse, Citation } from '@/types/decoder';
import { cn } from '@/utils';

interface DecoderPanelProps {
  decoderResult: DecoderResponse | null;
  isLoading?: boolean;
  onGenerate?: () => void;
  onCitationClick?: (citation: Citation) => void;
  onCitationHighlight?: (citationId: string | null) => void;
  highlightedCitationId?: string;
  className?: string;
}

/**
 * Get risk level badge variant
 */
function getRiskVariant(riskLevel: string): 'success' | 'warning' | 'error' {
  switch (riskLevel) {
    case 'LOW':
      return 'success';
    case 'MEDIUM':
      return 'warning';
    default:
      return 'error';
  }
}

export function DecoderPanel({
  decoderResult,
  isLoading,
  onGenerate,
  onCitationClick,
  onCitationHighlight,
  highlightedCitationId,
  className,
}: DecoderPanelProps) {
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [isCitationsOpen, setIsCitationsOpen] = useState(false);

  const handleCitationClick = useCallback(
    (citation: Citation) => {
      // Open citations section if clicking from text
      setIsCitationsOpen(true);
      onCitationClick?.(citation);
    },
    [onCitationClick]
  );

  // No decoder result - show generate prompt
  if (!decoderResult) {
    return (
      <div className={cn('rounded-lg bg-slate-800/30 p-4', className)}>
        <div className="text-center">
          <p className="mb-3 text-sm text-slate-400">
            Generate an AI explanation of this decision
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={onGenerate}
            isLoading={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Explanation'}
          </Button>
        </div>
      </div>
    );
  }

  const { explanation, summary, citations, audit } = decoderResult;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Tier and Risk Level Header */}
      <div className="flex items-center justify-between">
        <Badge variant="info">{decoderResult.tier}</Badge>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Risk:</span>
          <Badge variant={getRiskVariant(summary.risk_level)} size="sm">
            {summary.risk_level}
          </Badge>
        </div>
      </div>

      {/* Confidence Indicator */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-slate-700">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              summary.confidence >= 0.8
                ? 'bg-green-500'
                : summary.confidence >= 0.5
                  ? 'bg-amber-500'
                  : 'bg-red-500'
            )}
            style={{ width: `${summary.confidence * 100}%` }}
          />
        </div>
        <span className="text-xs text-slate-400">
          {Math.round(summary.confidence * 100)}%
          {summary.confidence_level === 'grounded' && (
            <span className="ml-1 text-green-400">✓</span>
          )}
        </span>
      </div>

      {/* AI Explanation - Collapsible */}
      <details
        className="group"
        open={isExplanationOpen}
        onToggle={(e) => setIsExplanationOpen(e.currentTarget.open)}
      >
        <summary className="cursor-pointer list-none rounded-lg bg-slate-700/30 p-3 text-slate-300 hover:bg-slate-700/50 hover:text-white">
          <span className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span>AI Explanation</span>
              {summary.confidence_level === 'inferred' && (
                <Badge variant="warning" size="sm">
                  LLM
                </Badge>
              )}
            </span>
            <svg
              className="h-5 w-5 transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </summary>

        <div className="mt-3 space-y-4 rounded-lg bg-slate-900/50 p-4">
          {/* Headline */}
          <div className="border-l-2 border-blue-500 pl-3">
            <h4 className="font-medium text-white">{explanation.headline}</h4>
          </div>

          {/* Body with anchored citations */}
          <AnchoredText
            text={explanation.body}
            citations={citations}
            onCitationClick={handleCitationClick}
            onCitationHover={onCitationHighlight}
            highlightedCitationId={highlightedCitationId}
          />

          {/* Conditions */}
          {explanation.conditions.length > 0 && (
            <div className="rounded-lg bg-slate-800/50 p-3">
              <h4 className="mb-2 text-sm font-medium text-slate-300">
                Conditions
              </h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
                {explanation.conditions.map((condition, i) => (
                  <li key={i}>{condition}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {explanation.warnings.length > 0 && (
            <div className="rounded-lg bg-amber-500/10 p-3">
              <h4 className="mb-2 text-sm font-medium text-amber-400">
                ⚠️ Warnings
              </h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-amber-200">
                {explanation.warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Disclaimer */}
          <p className="text-xs italic text-slate-500">
            This explanation is AI-generated to help understand the decision.
            The canonical decision above is authoritative.
          </p>
        </div>
      </details>

      {/* Citations Section - Collapsible */}
      {citations.length > 0 && (
        <details
          className="group"
          open={isCitationsOpen}
          onToggle={(e) => setIsCitationsOpen(e.currentTarget.open)}
        >
          <summary className="cursor-pointer list-none rounded-lg bg-slate-700/30 p-3 text-slate-300 hover:bg-slate-700/50 hover:text-white">
            <span className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>Citations</span>
                <Badge variant="default" size="sm">
                  {citations.length}
                </Badge>
              </span>
              <svg
                className="h-5 w-5 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </summary>

          <div className="mt-3 rounded-lg bg-slate-900/50 p-4">
            <CitationsList
              citations={citations}
              highlightedCitationId={highlightedCitationId}
              onCitationClick={onCitationClick}
              onCitationHover={onCitationHighlight}
            />
          </div>
        </details>
      )}

      {/* Audit Info Footer */}
      <div className="border-t border-slate-700 pt-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span>Generated: {new Date(decoderResult.generated_at).toLocaleString()}</span>
          <span>Rules: {audit.rules_evaluated}</span>
          <span>{audit.processing_time_ms}ms</span>
          {audit.model_version && (
            <span className="text-slate-600">v{audit.model_version}</span>
          )}
        </div>
      </div>
    </div>
  );
}
