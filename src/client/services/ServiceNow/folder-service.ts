import { CreateFolderDto } from "../dtos";
import type {Folder} from '../../interfaces'
import AuthService from './auth-service'

type FolderType =
  | 'createdbymefolders'
  | 'sharedwithmefolders'
  | 'publicfolders'
  | 'rootfolders';

interface GetFoldersParams {
  type?: FolderType;
  folderId?: string;
}
class FolderService{
    constructor(){

    }

    async getAll(){
        const res = await fetch('/api/x_1955226_connecto/connector_api/folder', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-UserToken': (window as any).g_ck || '',
            }
        });
        const data = await res.json();
        return data?.result?.folders ?? [];
    }

    async getFolders(params: GetFoldersParams = {}): Promise<Folder[]>{
        const query = new URLSearchParams();

        if (params.type) {
            query.append('type', params.type);
        }

        if (params.folderId) {
            query.append('folderId', params.folderId);
        }
        const res = await fetch(
            `/api/x_1955226_connecto/connector_api/folders?${query.toString()}`
        );

        const data = await res.json();

        const folders = data?.result?.folders ?? [];
        return folders.map((f: any) => ({
            id: f.sys_id,
            name: f.name,
            parentId: f.parent_folder_id,
            description: f.description,
            createdDate: f.createdDate
        }));
    };

    async create(payload: CreateFolderDto){
        const res = await fetch('/api/x_1955226_connecto/connector_api/folder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-UserToken': (window as any).g_ck || '',
            },
            body: JSON.stringify(payload),
        });

        return res.json();
    }
}

export default new FolderService();