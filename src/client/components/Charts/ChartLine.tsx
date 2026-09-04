import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { formatChartValue, type ChartValueFormat } from './chartFormat';

export interface ChartDataItem {
  name: string;
  value: number;
}

interface Props {
  data: ChartDataItem[];
  loading?: boolean;
  seriesName?: string;
  yAxisLabel?: string;
  valueFormat?: ChartValueFormat;
}

const ChartLine: React.FC<Props> = ({ data, loading = false, seriesName = 'Count', yAxisLabel = 'Value', valueFormat = 'number' }) => {
  if (loading) return <div>Loading...</div>;
  if (!data?.length) return <div>No data</div>;

  const options: Highcharts.Options = {
    chart: { type: 'line', height: 300 },
    title: { text: undefined },
    credits: { enabled: false },
    xAxis: {
      categories: data.map(d => d.name),
      crosshair: true,
      labels: { style: { fontSize: '11px', color: '#42526E' } }
    },
    yAxis: {
      title: { text: yAxisLabel, style: { color: '#42526E', fontSize: '11px' } },
      labels: {
        style: { fontSize: '11px' },
        formatter() {
          const def = this.axis.defaultLabelFormatter.call(this);
          if (valueFormat === 'currency') return '$' + def;
          if (valueFormat === 'percent')  return def + '%';
          return def;
        },
      }
    },
    tooltip: {
      shared: true,
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormatter() {
        return `${seriesName}: <b>${formatChartValue(this.y ?? 0, valueFormat)}</b>`;
      },
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
          style: { fontSize: '10px', fontWeight: '500' },
          formatter() {
            return formatChartValue(this.y ?? 0, valueFormat);
          },
        },
        enableMouseTracking: true,
        marker: { radius: 4 },
        color: '#0052CC',
      }
    },
    legend: { enabled: false },
    series: [{
      type: 'line',
      name: seriesName,
      data: data.map(d => d.value),
    }]
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ChartLine;