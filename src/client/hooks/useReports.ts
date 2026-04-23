import { useState, useEffect, useCallback } from 'react';
import ReportService from '../services/ServiceNow/report-service';
import type { Report } from '../interfaces';
import type { CreateReportDto } from '../services/dtos';

export type ReportType =
  | 'rootreports'
  | 'createdbymereports'
  | 'sharedwithmereports'
  | 'publicreports';

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
      const data = await ReportService.getReports({ type, folderId });
      setReports(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [type, folderId]);

  const createReport = async (dto: CreateReportDto) => {
    await ReportService.create(dto);
    await fetchReports(); // refresh after create
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    error,
    createReport,
    refreshReports: fetchReports
  };
}