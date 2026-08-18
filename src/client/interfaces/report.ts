export interface Report {
  id: string;
  name: string;
  folderId: string;
  description?: string;
  createdDate?: string;
  salesforceObject?: string;
  serviceNowObject?: string;
  columns?: string;
  showChart?: boolean;
  chartType?: string;
  groupBy?: string;
  showOnlyRecordsWithSalesforce?: boolean;
  filterQuery?: string;
  chartGroupBy?: string;
  owner?: string;
  ownerName?: string;
  userRole?: string;
  isPublic?: boolean;
  filterConditions?: string;
  filterLogic?: string;
}