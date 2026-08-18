import { CreateReportDto } from '../dtos';
import type { Report } from '../../interfaces';
import { ApiClient } from '../api-client';

export type ReportType =
  | 'rootreports'
  | 'createdbymereports'
  | 'privatereports'
  | 'sharedwithmereports'
  | 'publicreports'
  | 'favorites'
  | 'recentreports';

interface GetReportsParams {
  type?: ReportType;
  folderId?: string;
}

export type ReportDataFilters = {
  sfObjectName: string;
  snObjectName: string;
  selectedFields: string[];
  filterQuery?: string;
  showOnlyRecordsWithSalesforce?: boolean;
  page?: number;
  pageSize?: number;
};

class ReportService {
  private api = new ApiClient({
    'X-UserToken': (window as any).g_ck || '',
  });

  private baseUrl      = '/api/x_1955226_connecto/x_1955226_connecto_connector_api';
  private reportUrl    = `${this.baseUrl}/report`;
  private reportsUrl   = `${this.baseUrl}/reports`;
  private dataUrl      = `${this.baseUrl}/report/data`;
  private prefsUrl     = `${this.baseUrl}/user-prefs`;
  private favoritesUrl = `${this.baseUrl}/user-prefs/favorites`;

  // ─── Shared mapping ────────────────────────────────────────────────────────
  private mapReport(f: any): Report {
    return {
      id:               f.sys_id,
      name:             f.name,
      folderId:         f.folderid,
      description:      f.description,
      createdDate:      f.createdDate,
      salesforceObject: f.salesforceObject,
      serviceNowObject: f.serviceNowObject,
      userRole:         f.userRole,
      isPublic:         f.is_public,
    };
  }

  // ─── CRUD ──────────────────────────────────────────────────────────────────

  async create(payload: CreateReportDto): Promise<{ sys_id: string }> {
    const data = await this.api.post<any>(this.reportUrl, payload);
    return { sys_id: data?.result?.sys_id };
  }

  async getReportById(reportId: string): Promise<Report> {
    const data = await this.api.get<any>(`${this.reportUrl}?reportId=${reportId}`);
    return data?.result?.report ?? {};
  }

  async getReports(params: GetReportsParams = {}): Promise<Report[]> {
    const query = new URLSearchParams();
    if (params.type)     query.append('type', params.type);
    if (params.folderId) query.append('folderId', params.folderId);

    const data = await this.api.get<any>(`${this.reportsUrl}?${query.toString()}`);
    return (data?.result?.reports ?? []).map(this.mapReport.bind(this));
  }

  async updateReportById(reportId: string, payload: Partial<Report>): Promise<string> {
    const data = await this.api.put<any>(this.reportUrl, { id: reportId, ...payload });
    return data?.result?.sys_id ?? null;
  }

  async deleteReport(reportId: string): Promise<void> {
    await this.api.delete<any>(`${this.reportUrl}?reportId=${reportId}`);
  }

  // ─── Data ──────────────────────────────────────────────────────────────────

  async getReportData(filters: ReportDataFilters) {
    const data = await this.api.post<any>(this.dataUrl, {
      sfObjectName:                  filters.sfObjectName,
      snObjectName:                  filters.snObjectName,
      selectedFields:                filters.selectedFields,
      filterQuery:                   filters.filterQuery ?? '',
      showOnlyRecordsWithSalesforce: filters.showOnlyRecordsWithSalesforce ?? false,
      page:                          filters.page ?? 1,
      pageSize:                      filters.pageSize ?? 200,
    });
    return {
      items:      data?.result?.data ?? [],
      pagination: data?.result?.pagination ?? null,
    };
  }

  // ─── Favorites ─────────────────────────────────────────────────────────────

  async getFavorites(): Promise<string[]> {
    const data = await this.api.get<any>(this.prefsUrl);
    return data?.result?.favorites ?? [];
  }

  async addToFavorites(reportId: string): Promise<void> {
    await this.api.post<any>(this.favoritesUrl, { reportId });
  }

  async removeFromFavorites(reportId: string): Promise<void> {
    await this.api.post<any>(`${this.favoritesUrl}/remove`, { reportId });
  }
}

export default new ReportService();