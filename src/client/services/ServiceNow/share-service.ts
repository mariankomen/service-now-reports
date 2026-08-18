import { ApiClient } from '../api-client';

export type ShareRole = 'viewer' | 'editor' | 'manager';
export type ShareItemType = 'report' | 'folder';

export type ShareRecord = {
  sys_id:     string;
  item_id:    string;
  item_type:  ShareItemType;
  role:       ShareRole;
  user_id:    string;
  user_name:  string;
  user_email: string;
};

export type SysUser = {
  sys_id:  string;
  name:    string;
  email:   string;
  avatar?: string;
};

export type CreateSharePayload = {
  itemId:   string;
  itemType: ShareItemType;
  userId:   string;
  role:     ShareRole;
};

class ShareService {
  private api = new ApiClient({
    'X-UserToken': (window as any).g_ck || '',
  });

  private baseUrl  = '/api/x_1955226_connecto/x_1955226_connecto_connector_api';
  private shareUrl = `${this.baseUrl}/share`;
  private usersUrl = `${this.baseUrl}/users/search`;

  async searchUsers(query: string): Promise<SysUser[]> {
    const data = await this.api.get<any>(`${this.usersUrl}?q=${encodeURIComponent(query)}`);
    return data?.result?.users ?? [];
  }

  async getShares(itemId: string, itemType: ShareItemType): Promise<ShareRecord[]> {
    const data = await this.api.get<any>(`${this.shareUrl}?itemId=${itemId}&itemType=${itemType}`);
    return data?.result?.shares ?? [];
  }

  async createShare(payload: CreateSharePayload): Promise<string> {
    const data = await this.api.post<any>(this.shareUrl, payload);
    return data?.result?.sys_id;
  }

  async updateShare(sysId: string, role: ShareRole): Promise<void> {
    await this.api.put<any>(this.shareUrl, { sysId, role });
  }

  async deleteShare(sysId: string): Promise<void> {
    await this.api.delete<any>(`${this.shareUrl}?sysId=${sysId}`);
  }
}

export default new ShareService();