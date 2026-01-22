/**
 * CanvasHeader Component
 * Compact header for the Decision Canvas layout (64px height)
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '@/api/client';
import { Badge } from '@/components/shared';

export function CanvasHeader() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await apiClient.get('/health');
        setBackendStatus('connected');
      } catch {
        setBackendStatus('error');
      }
    };

    checkBackend();
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900 px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500">
          <span className="text-sm font-bold text-white">CN</span>
        </div>
        <div>
          <h1 className="text-base font-semibold text-white">
            Compliance Navigator
          </h1>
          <p className="text-xs text-slate-400">
            Decision Canvas
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/legacy"
          className="text-sm text-slate-400 transition-colors hover:text-white"
        >
          Legacy View
        </Link>

        {backendStatus === 'checking' && (
          <Badge variant="warning" size="sm">Checking...</Badge>
        )}
        {backendStatus === 'connected' && (
          <Badge variant="success" size="sm">Backend Connected</Badge>
        )}
        {backendStatus === 'error' && (
          <Badge variant="error" size="sm">Demo Mode</Badge>
        )}
      </div>
    </header>
  );
}
