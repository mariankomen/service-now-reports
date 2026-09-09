import { ApiClient } from '../api-client';

export type SalesforceSObject = {
  label:   string;
  apiname: string;
};

export type FieldChoice = {
  label: string;
  value: string;
};

export type SalesforceSObjectField = {
  label:             string;
  apiname:           string;
  type?:             string;
  referenceTo?:      string[];
  relationshipName?: string | null;
  choices?:          FieldChoice[];   // picklist values, used by the filter builder
};

class SalesforceSObjectService {
  private api = new ApiClient({
    'X-UserToken': (window as any).g_ck || '',
  });

  private baseUrl   = '/api/x_1955226_connecto/x_1955226_connecto_connector_api/salesforce';

  private sobjectsPromise: Promise<SalesforceSObject[]> | null = null;
  private fieldsCache = new Map<string, Promise<SalesforceSObjectField[]>>();

  async getAllSobjects(): Promise<SalesforceSObject[]> {
    if (!this.sobjectsPromise) {
      this.sobjectsPromise = this.api
        .get<any>(`${this.baseUrl}/describe`)
        .then(data => data?.result?.sobjects ?? []);
      this.sobjectsPromise.catch(() => { this.sobjectsPromise = null; });
    }
    return this.sobjectsPromise;
  }

  async getSObjectFields(sobjectName: string): Promise<SalesforceSObjectField[]> {
    let cached = this.fieldsCache.get(sobjectName);
    if (!cached) {
      cached = this.api
        .get<any>(`${this.baseUrl}/fields?object=${sobjectName}`)
        .then(data => data?.result?.fields ?? []);
      cached.catch(() => this.fieldsCache.delete(sobjectName));
      this.fieldsCache.set(sobjectName, cached);
    }
    return cached;
  }

  async getObjectLabel(apiname: string): Promise<string> {
    try {
      const all = await this.getAllSobjects();
      return all.find(o => o.apiname === apiname)?.label || apiname;
    } catch {
      return apiname;
    }
  }
}

export default new SalesforceSObjectService();