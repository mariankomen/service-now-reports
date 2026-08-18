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
  yAxisLabel?: string;
}

const ChartBar: React.FC<Props> = ({ data, loading = false, seriesName = 'Count', yAxisLabel = 'Value' }) => {
  if (loading) return <div>Loading...</div>;
  if (!data?.length) return <div>No data</div>;

  const options: Highcharts.Options = {
    chart: { type: 'column', height: 300 },
    title: { text: undefined },
    credits: { enabled: false },
    xAxis: {
      categories: data.map(d => d.name),
      crosshair: true,
      labels: { style: { fontSize: '11px', color: '#42526E' } }
    },
    yAxis: {
      min: 0,
      title: { text: yAxisLabel, style: { color: '#42526E', fontSize: '11px' } },
      labels: { style: { fontSize: '11px' } }
    },
    tooltip: {
      shared: true,
      headerFormat: '<b>{point.key}</b><br/>',
      pointFormat: `${seriesName}: <b>{point.y}</b>`,
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        borderRadius: 3,
        dataLabels: { enabled: true, style: { fontSize: '10px', fontWeight: '500' } },
        colors: ['#0052CC', '#00A1E0', '#62B136', '#FF8B00', '#8777D9', '#00C7E6'],
        colorByPoint: true,
      }
    },
    legend: { enabled: false },
    series: [{
      type: 'column',
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

export default ChartBar;