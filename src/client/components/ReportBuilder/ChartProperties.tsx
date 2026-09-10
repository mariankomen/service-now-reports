import React from 'react';
import { type AvailableField, type FilterConfig } from './ReportBuilder';
import { CHART_TYPES, CHART_ICONS, getChartTypeDef } from '../Charts/chartTypes';

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

interface ChartPropertiesProps {
  filters: FilterConfig;
  setFilters: React.Dispatch<React.SetStateAction<FilterConfig>>;
  availableFields: AvailableField[];
}

const ChartProperties: React.FC<ChartPropertiesProps> = ({ filters, setFilters, availableFields }) => {

  // ─── Only fields added to the report, in report column order ──────────────
  const reportFields = (filters.selectedFields ?? []).map(
    id => availableFields.find(f => f.id === id) ?? { id, label: id }
  );

  // ─── Only numeric fields for value aggregation ────────────────────────────
  const numericFields = reportFields.filter(f => NUMERIC_TYPES.has((f as AvailableField).type ?? ''));

  const typeDef     = getChartTypeDef(filters.chartType);
  const metric      = (filters.chartMetric as ChartMetric) ?? 'count';
  const valueField  = filters.chartValueField ?? '';
  const needsField  = metric !== 'count';
  const splitFields = reportFields.filter(f => f.id !== filters.chartGroupBy);

  return (
    <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Chart type ── */}
      <div>
        <div style={sectionLabelStyle}>Display As</div>
        <div style={gridStyle}>
          {CHART_TYPES.map(t => {
            const selected = typeDef.id === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setFilters(prev => ({ ...prev, chartType: t.id }))}
                title={t.label}
                style={{
                  ...typeCardStyle,
                  backgroundColor: selected ? '#E9F2FF' : '#fff',
                  border: selected ? '2px solid #0052CC' : '1px solid #DFE1E6',
                  color: selected ? '#0052CC' : '#42526E',
                }}
              >
                {CHART_ICONS[t.id]}
                <div style={{ fontSize: 9, marginTop: 3, fontWeight: 500, lineHeight: 1.15 }}>{t.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Chart title ── */}
      <div>
        <div style={sectionLabelStyle}>Chart Title</div>
        <input
          type="text"
          value={filters.chartTitle ?? ''}
          onChange={e => setFilters(prev => ({ ...prev, chartTitle: e.target.value }))}
          placeholder="Optional title shown above the chart"
          style={inputStyle}
        />
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
          {reportFields.map(f => (
            <option key={f.id} value={f.id}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* ── Split by — only meaningful for stacked and multi-series charts ── */}
      {typeDef.multiSeries && (
        <div>
          <div style={sectionLabelStyle}>Split By (Series)</div>
          {splitFields.length === 0 ? (
            <div style={hintStyle}>Add another field to the report to split the chart into series.</div>
          ) : (
            <>
              <select
                style={selectStyle}
                value={filters.chartSeriesBy ?? ''}
                onChange={e => setFilters(prev => ({ ...prev, chartSeriesBy: e.target.value }))}
              >
                <option value="">— Select field —</option>
                {splitFields.map(f => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
              {!filters.chartSeriesBy && (
                <div style={{ ...hintStyle, marginTop: 6 }}>
                  Without a split field this chart draws a single series.
                </div>
              )}
            </>
          )}
        </div>
      )}

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
            <div style={hintStyle}>No numeric fields selected in the report.</div>
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
const gridStyle: React.CSSProperties         = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 };
const typeCardStyle: React.CSSProperties     = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 2px', borderRadius: 4, cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', minHeight: 56 };
const selectStyle: React.CSSProperties       = { width: '100%', padding: '7px 8px', border: '1px solid #DFE1E6', borderRadius: 4, fontSize: 12, color: '#172B4D', backgroundColor: '#FAFBFC', outline: 'none', boxSizing: 'border-box' };
const inputStyle: React.CSSProperties        = { width: '100%', padding: '7px 8px', border: '1px solid #DFE1E6', borderRadius: 4, fontSize: 12, color: '#172B4D', backgroundColor: '#FAFBFC', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };
const metricRowStyle: React.CSSProperties    = { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '4px 0' };
const hintStyle: React.CSSProperties         = { fontSize: 12, color: '#8993A4', fontStyle: 'italic' };

export default ChartProperties;
