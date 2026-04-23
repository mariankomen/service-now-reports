import React from 'react';
import { FilterConfig, AvailableField } from './ConfigPanel';

interface ChartPropertiesProps {
  filters: FilterConfig;
  setFilters: React.Dispatch<React.SetStateAction<FilterConfig>>;
  availableFields: AvailableField[];
}

const ChartProperties: React.FC<ChartPropertiesProps> = ({ filters, setFilters, availableFields }) => {
  const chartTypes = [
    { id: 'donut', label: 'Donut', icon: '🍩' },
    { id: 'bar', label: 'Bar', icon: '📊' },
    { id: 'line', label: 'Line', icon: '📈' },
    { id: 'table', label: 'Table', icon: '▦' },
  ];

  return (
    <div style={{ padding: '15px' }}>
      <div style={labelStyle}>Display As</div>
      <div style={gridStyle}>
        {chartTypes.map(t => (
          <div
            key={t.id}
            onClick={() => setFilters({ ...filters, chartType: t.id as FilterConfig['chartType'] })}
            style={{
              ...typeCardStyle,
              backgroundColor: filters.chartType === t.id ? '#e9f2ff' : '#fff',
              border: filters.chartType === t.id ? '2px solid #0052cc' : '1px solid #ddd'
            }}
          >
            <span style={{ fontSize: '20px' }}>{t.icon}</span>
            <div style={{ fontSize: '10px', marginTop: '4px' }}>{t.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '25px' }}>
        <div style={labelStyle}>Attributes</div>
        <div style={formGroupStyle}>
          <label style={subLabelStyle}>X-Axis (Group By)</label>
          <select
            style={selectStyle}
            value={filters.groupBy}
            onChange={(e) => setFilters({ ...filters, groupBy: e.target.value })}
          >
            {availableFields.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ChartProperties;

const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 'bold', color: '#5E6C84', textTransform: 'uppercase', marginBottom: '12px' };
const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' };
const typeCardStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', borderRadius: '4px', cursor: 'pointer', textAlign: 'center' };
const formGroupStyle: React.CSSProperties = { marginTop: '15px' };
const subLabelStyle: React.CSSProperties = { fontSize: '11px', color: '#42526E', marginBottom: '5px', display: 'block' };
const selectStyle: React.CSSProperties = { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' };