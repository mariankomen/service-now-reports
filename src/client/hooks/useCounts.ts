import { useState, useEffect, useCallback } from 'react';
import ReportService from '../services/ServiceNow/report-service';
import { getRecent } from '../utils/recent';

export type SidebarCounts = Record<string, number>;

/**
 * Item counts for the sidebar navigation, keyed by the same tab ids the
 * sidebar navigates with. Everything comes from one server call, except
 * "Recent", which only exists in this browser's local storage.
 */
export function useCounts() {
  const [counts, setCounts] = useState<SidebarCounts>({});

  const refreshCounts = useCallback(async () => {
    let serverCounts: SidebarCounts = {};
    try {
      serverCounts = await ReportService.getCounts();
    } catch {
      serverCounts = {};
    }
    setCounts(Object.assign({}, serverCounts, { recentreports: getRecent().length }));
  }, []);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  return { counts, refreshCounts };
}
