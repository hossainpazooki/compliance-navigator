import { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { useNavigationStore } from '@/stores';
import { useNavigate } from './useNavigate';
import { CanvasContext, type CanvasContextValue } from '@/contexts';
import type { JurisdictionCode, InstrumentType, ActivityType, InvestorType } from '@/types/common';

/**
 * Safely get canvas context - returns undefined if not in provider
 */
function useCanvasSafe(): CanvasContextValue | undefined {
  return useContext(CanvasContext);
}

interface FormValues {
  issuerJurisdiction: JurisdictionCode;
  targetJurisdictions: JurisdictionCode[];
  instrumentType: InstrumentType | string;
  activity: ActivityType | string;
  investorTypes: InvestorType[];
  amount: number;
}

function isEqual(a: FormValues, b: FormValues): boolean {
  return (
    a.issuerJurisdiction === b.issuerJurisdiction &&
    a.instrumentType === b.instrumentType &&
    a.activity === b.activity &&
    a.amount === b.amount &&
    a.targetJurisdictions.length === b.targetJurisdictions.length &&
    a.targetJurisdictions.every((j) => b.targetJurisdictions.includes(j)) &&
    a.investorTypes.length === b.investorTypes.length &&
    a.investorTypes.every((t) => b.investorTypes.includes(t))
  );
}

function computeMissingFacts(form: FormValues): string[] {
  const missing: string[] = [];

  if (form.targetJurisdictions.length === 0) {
    missing.push('target_jurisdictions');
  }
  if (form.investorTypes.length === 0) {
    missing.push('investor_types');
  }
  if (!form.amount || form.amount <= 0) {
    missing.push('amount');
  }

  return missing;
}

/**
 * useScenarioForm - Form state + validation + stale detection hook
 * Tracks form changes and determines if inputs have changed since last run
 */
export function useScenarioForm() {
  const store = useNavigationStore();
  const { navigate, isLoading } = useNavigate();
  // Use safe version that doesn't throw outside CanvasProvider
  const canvasContext = useCanvasSafe();

  // Track if inputs changed since last run
  const [lastRunInputs, setLastRunInputs] = useState<FormValues | null>(null);

  // Current form values from store
  const form = useMemo<FormValues>(
    () => ({
      issuerJurisdiction: store.issuerJurisdiction,
      targetJurisdictions: store.targetJurisdictions,
      instrumentType: store.instrumentType,
      activity: store.activity,
      investorTypes: store.investorTypes,
      amount: store.amount,
    }),
    [
      store.issuerJurisdiction,
      store.targetJurisdictions,
      store.instrumentType,
      store.activity,
      store.investorTypes,
      store.amount,
    ]
  );

  // Detect stale state
  const isStale = useMemo(() => {
    if (!lastRunInputs) return false;
    return !isEqual(form, lastRunInputs);
  }, [form, lastRunInputs]);

  // Update canvas state when inputs become stale
  useEffect(() => {
    if (canvasContext && isStale) {
      canvasContext.setCanvasState('stale');
    }
  }, [canvasContext, isStale]);

  // Missing facts computation
  const missingFacts = useMemo(() => computeMissingFacts(form), [form]);

  // Can submit if we have at least target jurisdictions
  const canSubmit = useMemo(() => {
    return form.targetJurisdictions.length > 0;
  }, [form.targetJurisdictions]);

  // Form handlers
  const handlers = useMemo(
    () => ({
      setIssuerJurisdiction: store.setIssuerJurisdiction,
      toggleTargetJurisdiction: store.toggleTargetJurisdiction,
      setInstrumentType: store.setInstrumentType,
      setActivity: store.setActivity,
      toggleInvestorType: store.toggleInvestorType,
      setAmount: store.setAmount,
      reset: store.reset,
    }),
    [store]
  );

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

    if (canvasContext) {
      canvasContext.setCanvasState('loading');
    }

    try {
      await navigate();
      setLastRunInputs({ ...form });
      if (canvasContext) {
        canvasContext.setCanvasState('success');
      }
    } catch (error) {
      if (canvasContext) {
        canvasContext.setCanvasState('error');
      }
      throw error;
    }
  }, [canSubmit, canvasContext, form, navigate]);

  return {
    form,
    handlers,
    canSubmit,
    isPending: isLoading,
    isStale,
    missingFacts,
    handleSubmit,
    lastRunInputs,
  };
}
