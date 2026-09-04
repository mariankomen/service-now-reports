import React from 'react';
import ChartPie from '../Charts/ChartPie';
import ChartBar from '../Charts/ChartBar';
import ChartLine from '../Charts/ChartLine';
import { formatChartValue, type ChartValueFormat } from '../Charts/chartFormat';

export interface ChartDataItem {
  name: string;
  value: number;
}

interface ChartPreviewProps {
  data: ChartDataItem[];
  loading?: boolean;
  chartType?: 'donut' | 'bar' | 'line' | 'table';
  seriesName?: string;
  yAxisLabel?: string;
  valueFormat?: ChartValueFormat;
}

const emptyStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '100%', height: '100%', color: '#6B778C', fontSize: 14,
};

const ChartPreview: React.FC<ChartPreviewProps> = ({
  data, loading = false, chartType = 'donut', seriesName = 'Count', yAxisLabel = 'Value', valueFormat = 'number'
}) => {
  if (loading) return <div style={emptyStyle}>Loading chart data...</div>;
  if (!data || data.length === 0) return <div style={emptyStyle}>No data to display</div>;

  if (chartType === 'donut') return <ChartPie  data={data} loading={loading} seriesName={seriesName} valueFormat={valueFormat} />;
  if (chartType === 'bar')   return <ChartBar  data={data} loading={loading} seriesName={seriesName} yAxisLabel={yAxisLabel} valueFormat={valueFormat} />;
  if (chartType === 'line')  return <ChartLine data={data} loading={loading} seriesName={seriesName} yAxisLabel={yAxisLabel} valueFormat={valueFormat} />;

  if (chartType === 'table') {
    return (
      <div style={{ width: '100%', height: 300, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ backgroundColor: '#F4F5F7', borderBottom: '2px solid #DFE1E6' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', color: '#42526E', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', color: '#42526E', fontWeight: 600 }}>{seriesName}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #EBECF0', backgroundColor: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                <td style={{ padding: '7px 12px', color: '#172B4D' }}>{item.name}</td>
                <td style={{ padding: '7px 12px', color: '#172B4D', textAlign: 'right' }}>{formatChartValue(item.value, valueFormat)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <div style={emptyStyle}>Unknown chart type</div>;
};

export default ChartPreview;