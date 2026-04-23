import { CreateReportDto } from "../dtos";
import AuthService from './auth-service'
import type {Report} from '../../interfaces'

export type ReportType =
  | 'rootreports'
  | 'createdbymereports'
  | 'sharedwithmereports'
  | 'publicreports';

interface GetReportsParams {
  type?: ReportType;
  folderId?: string;
}

class FolderService{
    constructor(){

    }

    async create(payload: CreateReportDto){
        const res = await fetch('/api/x_1955226_connecto/connector_api/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-UserToken': (window as any).g_ck || '',
            },
            body: JSON.stringify(payload),
        });

        return res.json();
    }

    async getReports(params: GetReportsParams = {}): Promise<Report[]>{
            const query = new URLSearchParams();
    
            if (params.type) {
                query.append('type', params.type);
            }
    
            if (params.folderId) {
                query.append('folderId', params.folderId);
            }
            const res = await fetch(
                `/api/x_1955226_connecto/connector_api/reports?${query.toString()}`
            );
    
            const data = await res.json();
    
            const folders = data?.result?.reports ?? [];
            return folders.map((f: any) => ({
                id: f.sys_id,
                name: f.name,
                folderid: f.folderid,
                description: f.description,
                createdDate: f.createdDates      
            }));
        };
}

export default new FolderService();