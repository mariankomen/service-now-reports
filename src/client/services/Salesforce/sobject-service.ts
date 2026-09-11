import { ApiClient } from '../api-client';

export type SalesforceSObject = {
  label:   string;
  apiname: string;
};

export type FieldChoice = {
  label: string;
  value: string;
};

export type SalesforceReferenceRecord = {
  id:    string;   // Salesforce record Id
  label: string;
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

  // ─── Lookup record picker ─────────────────────────────────────────────────
  // `objects` is the lookup's referenceTo list — several for polymorphic lookups

  // Results are cached per lookup + term: reopening the dropdown or deleting
  // typed characters answers instantly instead of calling Salesforce again
  private referenceSearchCache = new Map<string, Promise<SalesforceReferenceRecord[]>>();

  async searchReferenceRecords(objects: string[], term: string): Promise<SalesforceReferenceRecord[]> {
    const normalizedTerm = term.trim();
    const cacheKey = `${objects.join(',')}|${normalizedTerm.toLowerCase()}`;

    let cached = this.referenceSearchCache.get(cacheKey);
    if (!cached) {
      const query = new URLSearchParams({ objects: objects.join(','), term: normalizedTerm });
      cached = this.api
        .get<any>(`${this.baseUrl}/reference/search?${query.toString()}`)
        .then(data => data?.result?.records ?? []);
      cached.catch(() => this.referenceSearchCache.delete(cacheKey));
      this.referenceSearchCache.set(cacheKey, cached);
    }
    return cached;
  }

  async getReferenceRecordLabel(objects: string[], id: string): Promise<string> {
    try {
      const query = new URLSearchParams({ objects: objects.join(','), id });
      const data  = await this.api.get<any>(`${this.baseUrl}/reference/search?${query.toString()}`);
      return data?.result?.records?.[0]?.label ?? '';
    } catch {
      return '';
    }
  }
}

export default new SalesforceSObjectService();