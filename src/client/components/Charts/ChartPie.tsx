import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export interface ChartDataItem {
  name: string;
  value: number;
}

interface Props {
  data: ChartDataItem[];
  loading?: boolean;
  seriesName?: string;
}

const COLORS = ['#0052CC', '#00A1E0', '#62B136', '#FF8B00', '#8777D9', '#00C7E6', '#FF5630', '#36B37E'];

const ChartPie: React.FC<Props> = ({ data, loading = false, seriesName = 'Count' }) => {
  if (loading) return <div>Loading...</div>;
  if (!data?.length) return <div>No data</div>;

  const options: Highcharts.Options = {
    chart: { type: 'pie', height: 300 },
    title: { text: undefined },
    credits: { enabled: false },
    tooltip: {
      pointFormat: `<b>{point.name}</b><br/>${seriesName}: <b>{point.y}</b><br/>Share: <b>{point.percentage:.1f}%</b>`,
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