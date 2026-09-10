import React from 'react';
// The ESM build is required: optional series types (funnel, treemap) only
// register themselves against this instance when imported this way.
import Highcharts from 'highcharts/esm/highcharts.js';
import 'highcharts/esm/modules/funnel.js';
import 'highcharts/esm/modules/treemap.js';
import HighchartsReact from 'highcharts-react-official';
import { formatChartValue, type ChartValueFormat } from './chartFormat';
import { getChartTypeDef, type ChartType } from './chartTypes';

export type ChartSeries = {
  name: string;
  data: number[];
};

export type ChartModel = {
  categories: string[];
  series: ChartSeries[];
};

interface ChartRendererProps {
  model: ChartModel;
  chartType: ChartType;
  title?: string;
  seriesName?: string;
  yAxisLabel?: string;
  valueFormat?: ChartValueFormat;
  height?: number;
}

const PALETTE = ['#0052CC', '#00A1E0', '#62B136', '#FF8B00', '#8777D9', '#00C7E6', '#FF5630', '#36B37E'];

const ChartRenderer: React.FC<ChartRendererProps> = ({
  model,
  chartType,
  title,
  seriesName = 'Count',
  yAxisLabel = 'Value',
  valueFormat = 'number',
  height = 300,
}) => {
  const def = getChartTypeDef(chartType);
  const format = (value: number) => formatChartValue(value, valueFormat);

  // Charts without an x-axis show one slice/leaf per category
  const pointList = model.categories.map((name, index) => ({
    name,
    y: model.series[0]?.data[index] ?? 0,
  }));

  const baseOptions: Highcharts.Options = {
    chart: { type: def.seriesType, height },
    title: title ? { text: title, style: { fontSize: '14px', fontWeight: '600', color: '#172B4D' } } : { text: undefined },
    credits: { enabled: false },
    colors: PALETTE,
    legend: { enabled: !!def.multiSeries },
  };

  let options: Highcharts.Options;

  if (def.seriesType === 'pie') {
    options = {
      ...baseOptions,
      tooltip: {
        pointFormatter(this: any) {
          return `<b>${this.name}</b><br/>${seriesName}: <b>${format(this.y ?? 0)}</b><br/>Share: <b>${(this.percentage ?? 0).toFixed(1)}%</b>`;
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
        },
      },
      series: [{ type: 'pie', name: seriesName, data: pointList }] as any,
    };

  } else if (def.seriesType === 'funnel') {
    options = {
      ...baseOptions,
      tooltip: {
        pointFormatter(this: any) {
          return `${seriesName}: <b>${format(this.y ?? 0)}</b>`;
        },
      },
      plotOptions: {
        funnel: {
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            style: { fontSize: '11px', fontWeight: '500' },
            softConnector: true,
          },
          center: ['40%', '50%'],
          neckWidth: '30%',
          neckHeight: '25%',
          width: '70%',
        },
      } as any,
      // Funnels read top-down, so the widest step comes first
      series: [{
        type: 'funnel',
        name: seriesName,
        data: pointList.slice().sort((a, b) => b.y - a.y),
      }] as any,
    };

  } else if (def.seriesType === 'treemap') {
    options = {
      ...baseOptions,
      tooltip: {
        pointFormatter(this: any) {
          return `<b>${this.name}</b><br/>${seriesName}: <b>${format(this.value ?? 0)}</b>`;
        },
      },
      series: [{
        type: 'treemap',
        layoutAlgorithm: 'squarified',
        name: seriesName,
        colorByPoint: true,
        dataLabels: { enabled: true, style: { fontSize: '11px', fontWeight: '500', textOutline: 'none' } },
        data: model.categories.map((name, index) => ({
          name,
          value: model.series[0]?.data[index] ?? 0,
        })),
      }] as any,
    };

  } else {
    // ─── Category based charts: bar, column, line, scatter and their stacks ──
    options = {
      ...baseOptions,
      xAxis: {
        categories: model.categories,
        crosshair: true,
        labels: { style: { fontSize: '11px', color: '#42526E' } },
      },
      yAxis: {
        min: 0,
        title: { text: yAxisLabel, style: { color: '#42526E', fontSize: '11px' } },
        labels: {
          style: { fontSize: '11px' },
          formatter(this: any) {
            const text = this.axis.defaultLabelFormatter.call(this);
            if (valueFormat === 'currency') return `$${text}`;
            if (valueFormat === 'percent')  return `${text}%`;
            return text;
          },
        },
        stackLabels: def.stacked ? { enabled: true, style: { fontSize: '10px', fontWeight: '600' } } : undefined,
      },
      tooltip: {
        shared: !def.multiSeries,
        headerFormat: '<b>{point.key}</b><br/>',
        pointFormatter(this: any) {
          return `${this.series.name}: <b>${format(this.y ?? 0)}</b><br/>`;
        },
      },
      plotOptions: {
        series: {
          stacking: def.stacked ? 'normal' : undefined,
          borderWidth: 0,
          marker: def.seriesType === 'scatter' ? { radius: 5 } : { radius: 4 },
          // Data labels only stay readable while a single series is drawn
          dataLabels: {
            enabled: !def.multiSeries && def.seriesType !== 'scatter',
            style: { fontSize: '10px', fontWeight: '500' },
            formatter(this: any) {
              return format(this.y ?? 0);
            },
          },
        },
        column: { borderRadius: 3 },
        bar: { borderRadius: 3 },
      },
      series: model.series.map((s, index) => ({
        type: def.seriesType,
        name: s.name,
        data: s.data,
        // A single-series bar chart looks better with a colour per category
        colorByPoint: !def.multiSeries && (def.seriesType === 'column' || def.seriesType === 'bar'),
        color: def.multiSeries ? PALETTE[index % PALETTE.length] : undefined,
      })) as any,
    };
  }

  return (
    <div style={{ width: '100%', height }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ChartRenderer;
