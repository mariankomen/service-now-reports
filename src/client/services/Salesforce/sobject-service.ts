import { ApiClient } from '../api-client';

export type SalesforceSObject = {
  label:   string;
  apiname: string;
};

export type SalesforceSObjectField = {
  label:             string;
  apiname:           string;
  type?:             string;
  referenceTo?:      string[];
  relationshipName?: string | null;
};

class SalesforceSObjectService {
  private api = new ApiClient({
    'X-UserToken': (window as any).g_ck || '',
  });

  private baseUrl   = '/api/x_1955226_connecto/x_1955226_connecto_connector_api/salesforce';

  async getAllSobjects(): Promise<SalesforceSObject[]> {
    const data = await this.api.get<any>(`${this.baseUrl}/describe`);
    return data?.result?.sobjects ?? [];
  }

  async getSObjectFields(sobjectName: string): Promise<SalesforceSObjectField[]> {
    const data = await this.api.get<any>(`${this.baseUrl}/fields?object=${sobjectName}`);
    return data?.result?.fields ?? [];
  }
}

export default new SalesforceSObjectService();