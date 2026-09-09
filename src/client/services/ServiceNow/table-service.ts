import { ApiClient } from '../api-client';

export type ServiceNowTable = {
  name:   string;
  label:  string;
  sys_id: string;
};

export type FieldChoice = {
  label: string;
  value: string;
};

export type ServiceNowTableField = {
  element:       string;
  column_label:  string;
  type:          string;            // normalized internal type name, e.g. "string" / "glide_date_time"
  referenceTable?: string;          // target table for reference fields
  choices?:      FieldChoice[];     // choice list values, when the field defines them
  internal_type?: {
    value: string;
    link:  string;
  };
};

export type ReferenceRecord = {
  sys_id: string;
  label:  string;
};

class ServiceNowTableService {
  private api = new ApiClient({
    'X-UserToken': (window as any).g_ck || '',
  });

  private baseUrl        = '/api/x_1955226_connecto/x_1955226_connecto_connector_api/servicenow/tables';
  private referenceUrl   = '/api/x_1955226_connecto/x_1955226_connecto_connector_api/servicenow/reference/search';
  private fieldsBaseUrl  = '/api/now/v1/table/sys_dictionary';
  private choicesBaseUrl = '/api/now/v1/table/sys_choice';

  // Reference columns come back as { value, link }; plain columns as strings
  private plain(value: any): string {
    if (value == null) return '';
    if (typeof value === 'object') return String(value.value ?? value.display_value ?? '');
    return String(value);
  }

  // The reference target arrives via a dot-walked field. When an instance does
  // not resolve it, a raw sys_id shows up instead — which is not a table name.
  private asTableName(value: string): string {
    if (!value) return '';
    return /^[0-9a-f]{32}$/i.test(value) ? '' : value;
  }

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
    const cols   = 'element,column_label,internal_type,name,choice,reference.name';

    const data = await this.api.get<any>(
      `${this.fieldsBaseUrl}?sysparm_query=${query}&sysparm_fields=${cols}&sysparm_limit=2000`
    );
    const rows: any[] = data?.result ?? [];

    // Deduplicate by element — a field redefined on the table itself wins over task's
    const seen: string[] = [];
    const fields: ServiceNowTableField[] = [];
    const withChoices: string[] = [];

    rows
      .sort((a, b) => (a.name === table ? -1 : 0) - (b.name === table ? -1 : 0))
      .forEach(row => {
        const element = this.plain(row.element);
        if (!element || seen.includes(element)) return;
        seen.push(element);

        const referenceTable = this.asTableName(this.plain(row['reference.name'] ?? row.reference));
        const choiceFlag     = this.plain(row.choice);
        if (choiceFlag && choiceFlag !== '0') withChoices.push(element);

        fields.push({
          element,
          column_label:  this.plain(row.column_label) || element,
          type:          this.plain(row.internal_type) || 'string',
          internal_type: row.internal_type,
          referenceTable: referenceTable || undefined,
        });
      });

    // ─── Attach choice list values in a single extra request ────────────────
    if (withChoices.length) {
      const choicesByElement = await this.getTableChoices(table);
      fields.forEach(field => {
        const choices = choicesByElement[field.element];
        if (choices && choices.length) field.choices = choices;
      });
    }

    return fields;
  }

  // ─── Choice list values for a table, keyed by field element ───────────────
  async getTableChoices(table: string): Promise<Record<string, FieldChoice[]>> {
    const tables = table === 'task' ? table : `${table},task`;
    const query  = `nameIN${tables}^inactive=false^language=en`;
    const cols   = 'element,label,value,name,sequence';

    const result: Record<string, FieldChoice[]> = {};

    try {
      const data = await this.api.get<any>(
        `${this.choicesBaseUrl}?sysparm_query=${query}&sysparm_fields=${cols}&sysparm_limit=5000`
      );
      const rows: any[] = data?.result ?? [];

      // Table-specific choices win over the ones inherited from task
      const ownElements: string[] = [];
      rows.forEach(row => {
        const element = this.plain(row.element);
        if (element && this.plain(row.name) === table && !ownElements.includes(element)) {
          ownElements.push(element);
        }
      });

      rows.forEach(row => {
        const element = this.plain(row.element);
        const value   = this.plain(row.value);
        if (!element || !value) return;
        if (ownElements.includes(element) && this.plain(row.name) !== table) return;

        if (!result[element]) result[element] = [];
        if (result[element].some(c => c.value === value)) return;
        result[element].push({ label: this.plain(row.label) || value, value });
      });
    } catch {
      // Choices are optional — the filter falls back to a plain text input
    }

    return result;
  }

  // ─── Reference field helpers (record picker in the filter builder) ────────
  async searchReferenceRecords(table: string, term: string): Promise<ReferenceRecord[]> {
    const query = new URLSearchParams({ table, term });
    const data  = await this.api.get<any>(`${this.referenceUrl}?${query.toString()}`);
    return data?.result?.records ?? [];
  }

  async getReferenceRecordLabel(table: string, sysId: string): Promise<string> {
    try {
      const query = new URLSearchParams({ table, sys_id: sysId });
      const data  = await this.api.get<any>(`${this.referenceUrl}?${query.toString()}`);
      return data?.result?.records?.[0]?.label ?? '';
    } catch {
      return '';
    }
  }
}

export default new ServiceNowTableService();
