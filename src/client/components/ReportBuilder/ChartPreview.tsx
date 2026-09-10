import React from 'react';
import ChartRenderer, { type ChartModel } from '../Charts/ChartRenderer';
import { getChartTypeDef, type ChartType } from '../Charts/chartTypes';
import { formatChartValue, type ChartValueFormat } from '../Charts/chartFormat';

interface ChartPreviewProps {
  model: ChartModel;
  loading?: boolean;
  chartType?: ChartType;
  title?: string;
  seriesName?: string;
  yAxisLabel?: string;
  valueFormat?: ChartValueFormat;
}

const emptyStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '100%', height: '100%', color: '#6B778C', fontSize: 14,
};

const ChartPreview: React.FC<ChartPreviewProps> = ({
  model, loading = false, chartType = 'bar', title,
  seriesName = 'Count', yAxisLabel = 'Value', valueFormat = 'number',
}) => {
  if (loading) return <div style={emptyStyle}>Loading chart data...</div>;
  if (!model || model.categories.length === 0) return <div style={emptyStyle}>No data to display</div>;

  const def = getChartTypeDef(chartType);

  // ─── Table view ────────────────────────────────────────────────────────────
  if (def.id === 'table') {
    return (
      <div style={{ width: '100%', height: 300, overflow: 'auto' }}>
        {title && (
          <div style={{ fontSize: 14, fontWeight: 600, color: '#172B4D', padding: '0 0 10px 2px' }}>{title}</div>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ backgroundColor: '#F4F5F7', borderBottom: '2px solid #DFE1E6' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', color: '#42526E', fontWeight: 600 }}>Category</th>
              {model.series.map(s => (
                <th key={s.name} style={{ padding: '8px 12px', textAlign: 'right', color: '#42526E', fontWeight: 600 }}>
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.categories.map((category, index) => (
              <tr key={category} style={{ borderBottom: '1px solid #EBECF0', backgroundColor: index % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                <td style={{ padding: '7px 12px', color: '#172B4D' }}>{category}</td>
                {model.series.map(s => (
                  <td key={s.name} style={{ padding: '7px 12px', color: '#172B4D', textAlign: 'right' }}>
                    {formatChartValue(s.data[index] ?? 0, valueFormat)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <ChartRenderer
      model={model}
      chartType={def.id}
      title={title}
      seriesName={seriesName}
      yAxisLabel={yAxisLabel}
      valueFormat={valueFormat}
    />
  );
};

export default ChartPreview;
