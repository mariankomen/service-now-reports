export interface ReportListItem{
    id: string,
    name: string,
    description: string,
    folderName: string,
    createdDate: string,
    isFolder: boolean,
    salesforceObject?: string;
    serviceNowObject?: string;
    owner?: string;
    userRole?: string;
    isFavorite?: boolean;
    isPublic?: boolean;
}