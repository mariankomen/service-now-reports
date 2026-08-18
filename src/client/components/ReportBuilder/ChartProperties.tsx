import React from 'react';
import { type AvailableField, type FilterConfig } from './ReportBuilder';
import {
  AiOutlinePieChart,
  AiOutlineBarChart,
  AiOutlineLineChart,
  AiOutlineTable,
} from 'react-icons/ai';

export type ChartMetric = 'count' | 'sum' | 'avg' | 'max' | 'min';

const CHART_METRICS: { value: ChartMetric; label: string }[] = [
  { value: 'count', label: 'Count'   },
  { value: 'sum',   label: 'Sum'     },
  { value: 'avg',   label: 'Average' },
  { value: 'max',   label: 'Max'     },
  { value: 'min',   label: 'Min'     },
];

const NUMERIC_TYPES = new Set([
  'integer', 'decimal', 'float', 'long', 'currency', 'currency2',
  'percent', 'double', 'number',
]);

const CHART_TYPES = [
  { id: 'donut', label: 'Donut', icon: <AiOutlinePieChart size={20} /> },
  { id: 'bar',   label: 'Bar',   icon: <AiOutlineBarChart size={20} /> },
  { id: 'line',  label: 'Line',  icon: <AiOutlineLineChart size={20} /> },
  { id: 'table', label: 'Table', icon: <AiOutlineTable size={20} /> },
];

interface ChartPropertiesProps {
  filters: FilterConfig;
  setFilters: React.Dispatch<React.SetStateAction<FilterConfig>>;
  availableFields: AvailableField[];
}

const ChartProperties: React.FC<ChartPropertiesProps> = ({ filters, setFilters, availableFields }) => {

  // ─── Only numeric fields for value aggregation ────────────────────────────
  const numericFields = availableFields.filter(f => NUMERIC_TYPES.has(f.type ?? ''));

  const metric      = (filters.chartMetric as ChartMetric) ?? 'count';
  const valueField  = filters.chartValueField ?? '';
  const needsField  = metric !== 'count';

  return (
    <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Chart type ── */}
      <div>
        <div style={sectionLabelStyle}>Display As</div>
        <div style={gridStyle}>
          {CHART_TYPES.map(t => (
            <div
              key={t.id}
              onClick={() => setFilters(prev => ({ ...prev, chartType: t.id as FilterConfig['chartType'] }))}
              style={{
                ...typeCardStyle,
                backgroundColor: filters.chartType === t.id ? '#E9F2FF' : '#fff',
                border: filters.chartType === t.id ? '2px solid #0052CC' : '1px solid #DFE1E6',
                color: filters.chartType === t.id ? '#0052CC' : '#42526E',
              }}
            >
              {t.icon}
              <div style={{ fontSize: 10, marginTop: 4, fontWeight: 500 }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── X-Axis ── */}
      <div>
        <div style={sectionLabelStyle}>X-Axis (Group By)</div>
        <select
          style={selectStyle}
          value={filters.chartGroupBy ?? ''}
          onChange={e => setFilters(prev => ({ ...prev, chartGroupBy: e.target.value }))}
        >
          <option value="">— Select field —</option>
          {availableFields.map(f => (
            <option key={f.id} value={f.id}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* ── Y-Axis metric ── */}
      <div>
        <div style={sectionLabelStyle}>Y-Axis (Metric)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {CHART_METRICS.map(m => (
            <label key={m.value} style={metricRowStyle}>
              <input
                type="radio"
                name="chartMetric"
                value={m.value}
                checked={metric === m.value}
                onChange={() => setFilters(prev => ({ ...prev, chartMetric: m.value }))}
                style={{ accentColor: '#0052CC' }}
              />
              <span style={{ fontSize: 13, color: '#172B4D' }}>{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Value field — shown only when metric needs a field ── */}
      {needsField && (
        <div>
          <div style={sectionLabelStyle}>Value Field</div>
          {numericFields.length === 0 ? (
            <div style={{ fontSize: 12, color: '#8993A4', fontStyle: 'italic' }}>
              No numeric fields selected in the report.
            </div>
          ) : (
            <select
              style={selectStyle}
              value={valueField}
              onChange={e => setFilters(prev => ({ ...prev, chartValueField: e.target.value }))}
            >
              <option value="">— Select numeric field —</option>
              {numericFields.map(f => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          )}
        </div>
      )}

    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const sectionLabelStyle: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: '#5E6C84', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 };
const gridStyle: React.CSSProperties         = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 };
const typeCardStyle: React.CSSProperties     = { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 6px', borderRadius: 4, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' };
const selectStyle: React.CSSProperties       = { width: '100%', padding: '7px 8px', border: '1px solid #DFE1E6', borderRadius: 4, fontSize: 12, color: '#172B4D', backgroundColor: '#FAFBFC', outline: 'none' };
const metricRowStyle: React.CSSProperties    = { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 0' };

export default ChartProperties;