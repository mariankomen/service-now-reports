import { ApiClient } from '../api-client';

export type ServiceNowTable = {
  name:   string;
  label:  string;
  sys_id: string;
};

export type ServiceNowTableField = {
  element:       string;
  column_label:  string;
  internal_type?: {
    value: string;
    link:  string;
  };
};

class ServiceNowTableService {
  private api = new ApiClient({
    'X-UserToken': (window as any).g_ck || '',
  });

  private baseUrl       = '/api/x_1955226_connecto/x_1955226_connecto_connector_api/servicenow/tables';
  private fieldsBaseUrl = '/api/now/v1/table/sys_dictionary';

  async getAllTables(): Promise<ServiceNowTable[]> {
    const data = await this.api.get<any>(this.baseUrl);
    return data?.result?.tables ?? [];
  }

  async getTableFields(table: string): Promise<ServiceNowTableField[]> {
    const data = await this.api.get<any>(`${this.fieldsBaseUrl}?sysparm_query=nameIN${table}`);
    return data?.result ?? [];
  }
}

export default new ServiceNowTableService();