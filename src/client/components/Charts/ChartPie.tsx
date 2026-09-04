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
  valueFormat?: ChartValueFormat;
}

const COLORS = ['#0052CC', '#00A1E0', '#62B136', '#FF8B00', '#8777D9', '#00C7E6', '#FF5630', '#36B37E'];

const ChartPie: React.FC<Props> = ({ data, loading = false, seriesName = 'Count', valueFormat = 'number' }) => {
  if (loading) return <div>Loading...</div>;
  if (!data?.length) return <div>No data</div>;

  const options: Highcharts.Options = {
    chart: { type: 'pie', height: 300 },
    title: { text: undefined },
    credits: { enabled: false },
    tooltip: {
      pointFormatter() {
        return `<b>${this.name}</b><br/>${seriesName}: <b>${formatChartValue(this.y ?? 0, valueFormat)}</b><br/>Share: <b>${(this.percentage ?? 0).toFixed(1)}%</b>`;
      },
    },
    plotOptions: {
      pie: {
        innerSize: '60%',
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.percentage:.1f}%',
          style: { fontSize: '11px', fontWeight: '500' },
          distance: 15,
        },
        colors: COLORS,
      }
    },
    series: [{
      type: 'pie',
      name: seriesName,
      data: data.map(d => ({ name: d.name, y: d.value })),
    }]
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ChartPie;