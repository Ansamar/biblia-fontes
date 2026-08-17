'use client';

import { useEffect } from 'react';

export function useExplorerUrlState({ year, entityId, enabled = true }: { year: number; entityId?: string; enabled?: boolean }) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.searchParams.set('year', String(year));
    if (entityId) url.searchParams.set('entity', entityId);
    else url.searchParams.delete('entity');

    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }, [enabled, entityId, year]);
}
