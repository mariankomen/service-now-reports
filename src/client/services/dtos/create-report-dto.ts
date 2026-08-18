export interface CreateReportDto{
    name: string;
    folderid?: string;
    description?: string;
    salesforceObjectName: string;
    serviceNowTableName: string;
    isPublic?: boolean;
}