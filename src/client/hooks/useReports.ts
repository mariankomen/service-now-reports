import { useState, useEffect, useCallback } from 'react';
import ReportService from '../services/ServiceNow/report-service';
import type { Report } from '../interfaces';
import type { CreateReportDto } from '../services/dtos';
import { getRecent } from '../utils/recent';

export type ReportType =
  | 'rootreports'
  | 'createdbymereports'
  | 'sharedwithmereports'
  | 'privatereports'
  | 'publicreports'
  | 'recentreports'
  | 'favorites';

interface UseReportsParams {
  type?: ReportType;
  folderId?: string;
}

export function useReports(params: UseReportsParams) {
  const { type, folderId } = params;

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // ─── Recent: load from localStorage ───────────────────────────────
      if (type === 'recentreports') {
        const recent = getRecent();
        const mapped: Report[] = recent.map(r => ({
          id: r.id,
          name: r.name,
          folderId: '',
          salesforceObject: r.salesforceObject,
          serviceNowObject: r.serviceNowObject,
          createdDate: r.openedAt,
        }));
        setReports(mapped);
        return;
      }

      // ─── All other types: fetch from API ──────────────────────────────
      const data = await ReportService.getReports({ type, folderId });
      setReports(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [type, folderId]);

  const createReport = async (dto: CreateReportDto): Promise<{ sys_id: string }> => {
    const result = await ReportService.create(dto);
    await fetchReports();
    return result;
  };
  const deleteReport = async (reportId: string) => {
    await ReportService.deleteReport(reportId);
    await fetchReports();
  };
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    error,
    createReport,
    refreshReports: fetchReports,
    deleteReport
  };
}