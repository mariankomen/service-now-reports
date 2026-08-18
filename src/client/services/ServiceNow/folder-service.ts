import { ApiClient } from '../api-client';
import { CreateFolderDto } from '../dtos';
import type { Folder } from '../../interfaces';

export type FolderType =
  | 'createdbymefolders'
  | 'sharedwithmefolders'
  | 'publicfolders'
  | 'rootfolders';

interface GetFoldersParams {
  type?: FolderType;
  folderId?: string;
}

export type UpdateFolderDto = {
  id: string;
  name?: string;
  description?: string;
  is_public?: boolean;
};

class FolderService {
  private api = new ApiClient({
    'X-UserToken': (window as any).g_ck || '',
  });

  private baseUrl = '/api/x_1955226_connecto/x_1955226_connecto_connector_api';

  // ─── Shared mapping ───────────────────────────────────────────────────────
  private mapFolder(f: any): Folder {
    return {
      id:          f.sys_id,
      name:        f.name,
      parent_folder_id:    f.parent_folder_id,
      description: f.description,
      createdDate: f.createdDate,
      userRole:    f.userRole,
      isPublic:    f.is_public,
    };
  }

  // ─── Get all folders (used for dropdowns — no access filter) ─────────────
  async getAll(): Promise<Folder[]> {
    const data = await this.api.get<any>(`${this.baseUrl}/folder`);
    return (data?.result?.folders ?? []).map(this.mapFolder);
  }

  // ─── Get folders by type or folderId (with access control) ───────────────
  async getFolders(params: GetFoldersParams = {}): Promise<Folder[]> {
    const query = new URLSearchParams();
    if (params.type)     query.append('type', params.type);
    if (params.folderId) query.append('folderId', params.folderId);

    const data = await this.api.get<any>(`${this.baseUrl}/folders?${query.toString()}`);
    return (data?.result?.folders ?? []).map(this.mapFolder);
  }

  async create(payload: CreateFolderDto): Promise<{ sys_id: string }> {
    const data = await this.api.post<any>(`${this.baseUrl}/folder`, payload);
    return { sys_id: data?.result?.sys_id };
  }

  async updateFolder(payload: UpdateFolderDto): Promise<void> {
    await this.api.put<any>(`${this.baseUrl}/folder`, payload);
  }

  async deleteFolder(folderId: string): Promise<void> {
    await this.api.delete<any>(`${this.baseUrl}/folder?folderId=${folderId}`);
  }
}

export default new FolderService();