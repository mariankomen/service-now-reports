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
    // ServiceNow tables inherit their parent's fields (always task in this app),
    // so fetch the table's own dictionary rows together with the inherited ones.
    // Collection rows (empty element) and sys_id are excluded.
    const tables = table === 'task' ? table : `${table},task`;
    const query  = `nameIN${tables}^elementISNOTEMPTY^element!=sys_id`;

    const data = await this.api.get<any>(
      `${this.fieldsBaseUrl}?sysparm_query=${query}&sysparm_fields=element,column_label,internal_type,name`
    );
    const rows: (ServiceNowTableField & { name?: string })[] = data?.result ?? [];

    // Deduplicate by element — a field redefined on the table itself wins over task's
    const seen: string[] = [];
    const fields: ServiceNowTableField[] = [];
    rows
      .sort((a, b) => (a.name === table ? -1 : 0) - (b.name === table ? -1 : 0))
      .forEach(row => {
        if (seen.includes(row.element)) return;
        seen.push(row.element);
        fields.push(row);
      });

    return fields;
  }
}

export default new ServiceNowTableService();