import React from 'react';

export type DataRow = Record<string, any> & { id: string | number };

type DataGridProps = {
  rows: DataRow[];
  selectedFields?: string[];
};

const DataGrid: React.FC<DataGridProps> = ({ rows, selectedFields }) => {
  const columns = selectedFields && selectedFields.length > 0
    ? selectedFields
    : ['System.Id', 'System.Title', 'System.State'];

  if (!rows || rows.length === 0)
    return (
      <div style={{ padding: '20px', color: '#6B778C', fontSize: '13px' }}>
        No records found
      </div>
    );

  const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined) return '-';
    if (key.includes('Date') && typeof value === 'string') {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }
    return value;
  };

  const getHeaderLabel = (key: string) =>
    key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || key;

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
      <thead>
        <tr style={{ backgroundColor: '#FAFBFC', borderBottom: '2px solid #DFE1E6' }}>
          {columns.map((fieldId) => (
            <th key={fieldId} style={thStyle}>
              {getHeaderLabel(fieldId)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={row.id ?? rowIndex} style={{ borderBottom: '1px solid #EBECF0' }}>
            {columns.map((fieldId) => (
              <td key={fieldId} style={tdStyle}>
                {fieldId.includes('State') ? (
                  <span style={getStatusStyle(row[fieldId])}>{row[fieldId]}</span>
                ) : (
                  formatValue(fieldId, row[fieldId])
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 10px',
  color: '#5E6C84',
  fontWeight: 600,
  whiteSpace: 'nowrap',
};
const tdStyle: React.CSSProperties = { padding: '8px 10px', color: '#172B4D' };

const getStatusStyle = (state: string | undefined): React.CSSProperties => {
  const base: React.CSSProperties = {
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: 'bold',
  };
  if (!state) return base;
  if (['New', 'To Do', 'Design'].includes(state))
    return { ...base, backgroundColor: '#DFE1E6', color: '#42526E' };
  if (['Active', 'Doing', 'In Progress'].includes(state))
    return { ...base, backgroundColor: '#DEEBFF', color: '#0052CC' };
  if (['Closed', 'Done', 'Resolved'].includes(state))
    return { ...base, backgroundColor: '#E3FCEF', color: '#006644' };
  return { ...base, backgroundColor: '#EBECF0' };
};

export default DataGrid;