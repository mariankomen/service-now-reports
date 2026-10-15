import React from 'react';
import {
  ResponsiveContainer, BarChart, LineChart, ComposedChart, PieChart, FunnelChart, Treemap,
  Bar, Line, Scatter, Pie, Funnel, Cell, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
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
const TEXT    = '#42526E';
const TICK    = { fontSize: 11, fill: TEXT };
const LABEL   = { fontSize: 10, fontWeight: 500, fill: '#172B4D' };
const TOTAL   = '__total';

const colorAt = (index: number) => PALETTE[index % PALETTE.length];

// Series values live under neutral keys so a series named like a row field
// ("name", "__total") cannot clash with it
const seriesKey = (index: number) => `s${index}`;

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
  const format = (value: unknown) => formatChartValue(Number(value), valueFormat);

  // Axis ticks stay short: 12500 -> 12.5K, with the unit of the value format
  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
  const formatTick = (value: unknown) => {
    const text = compact.format(Number(value));
    if (valueFormat === 'currency') return `$${text}`;
    if (valueFormat === 'percent')  return `${text}%`;
    return text;
  };

  // ─── Row per category, one column per series ──────────────────────────────
  const rows = model.categories.map((name, index) => {
    const row: Record<string, string | number> = { name };
    let total = 0;
    model.series.forEach((s, sIndex) => {
      const value = s.data[index] ?? 0;
      row[seriesKey(sIndex)] = value;
      total += value;
    });
    row[TOTAL] = total;
    return row;
  });

  // Charts without an x-axis show one slice/leaf per category
  const pointList = model.categories.map((name, index) => ({
    name,
    value: model.series[0]?.data[index] ?? 0,
  }));

  const tooltip = (
    <Tooltip
      formatter={(value: any, name: any) => [format(value), name]}
      labelStyle={{ fontWeight: 600, color: '#172B4D' }}
      contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: '#DFE1E6' }}
    />
  );

  const titleHeight = title ? 28 : 0;
  const chartHeight = height - titleHeight;

  let chart: React.ReactElement;

  if (def.seriesType === 'pie') {
    const sum = pointList.reduce((acc, p) => acc + p.value, 0) || 1;
    const share = (value: number) => ((value / sum) * 100).toFixed(1);

    chart = (
      <PieChart>
        <Tooltip
          formatter={(value: any, name: any) => [`${format(value)} (${share(Number(value))}%)`, name || seriesName]}
          contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: '#DFE1E6' }}
        />
        <Pie
          data={pointList}
          dataKey="value"
          nameKey="name"
          innerRadius="50%"
          outerRadius="75%"
          paddingAngle={1}
          label={({ name, value }: any) => `${name}: ${share(Number(value))}%`}
          labelLine
          style={{ fontSize: 11, fontWeight: 500 }}
        >
          {pointList.map((_, index) => <Cell key={index} fill={colorAt(index)} />)}
        </Pie>
      </PieChart>
    );

  } else if (def.seriesType === 'funnel') {
    // Funnels read top-down, so the widest step comes first
    const steps = pointList.slice().sort((a, b) => b.value - a.value);
    chart = (
      <FunnelChart margin={{ top: 10, right: 140, bottom: 10, left: 20 }}>
        <Tooltip
          formatter={(value: any) => [format(value), seriesName]}
          contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: '#DFE1E6' }}
        />
        <Funnel data={steps} dataKey="value" nameKey="name" isAnimationActive>
          {steps.map((_, index) => <Cell key={index} fill={colorAt(index)} />)}
          <LabelList position="right" dataKey="name" fill="#172B4D" stroke="none" style={{ fontSize: 11, fontWeight: 500 }} />
        </Funnel>
      </FunnelChart>
    );

  } else if (def.seriesType === 'treemap') {
    const leaves = pointList.map((p, index) => ({ ...p, fill: colorAt(index) }));
    chart = (
      <Treemap
        data={leaves}
        dataKey="value"
        nameKey="name"
        aspectRatio={4 / 3}
        stroke="#fff"
        content={<TreemapLeaf />}
      >
        <Tooltip
          formatter={(value: any, _name: any, item: any) => [format(value), item?.payload?.name ?? seriesName]}
          contentStyle={{ fontSize: 12, borderRadius: 4, borderColor: '#DFE1E6' }}
        />
      </Treemap>
    );

  } else {
    // ─── Category based charts: bar, column, line, scatter and their stacks ──
    const horizontal = def.seriesType === 'bar';
    const single     = !def.multiSeries;
    const lastIndex  = model.series.length - 1;

    // Data labels only stay readable while a single series is drawn
    const valueLabels = single && def.seriesType !== 'scatter';

    const longestCategory = model.categories.reduce((max, c) => Math.max(max, (c ?? '').length), 0);
    const categoryWidth   = Math.min(160, Math.max(60, longestCategory * 6 + 12));

    const categoryAxis = horizontal
      ? <YAxis type="category" dataKey="name" width={categoryWidth} tick={TICK} interval={0} />
      : <XAxis dataKey="name" tick={TICK} interval="preserveStartEnd" />;

    const valueAxis = horizontal
      ? <XAxis type="number" tick={TICK} tickFormatter={formatTick} />
      : (
        <YAxis
          type="number"
          tick={TICK}
          tickFormatter={formatTick}
          label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', style: { fill: TEXT, fontSize: 11, textAnchor: 'middle' } }}
        />
      );

    const common = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="#EBECF0" vertical={horizontal} horizontal={!horizontal} />
        {categoryAxis}
        {valueAxis}
        {tooltip}
        {!single && <Legend wrapperStyle={{ fontSize: 12 }} />}
      </>
    );

    const margin = { top: 20, right: horizontal ? 48 : 16, bottom: 4, left: horizontal ? 4 : 8 };

    if (def.seriesType === 'line') {
      chart = (
        <LineChart data={rows} margin={margin}>
          {common}
          {model.series.map((s, index) => (
            <Line
              key={s.name}
              type="linear"
              dataKey={seriesKey(index)}
              name={s.name}
              stroke={colorAt(index)}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 5 }}
            >
              {valueLabels && <LabelList dataKey={seriesKey(index)} position="top" formatter={format} style={LABEL} />}
            </Line>
          ))}
        </LineChart>
      );

    } else if (def.seriesType === 'scatter') {
      chart = (
        <ComposedChart data={rows} margin={margin}>
          {common}
          {model.series.map((s, index) => (
            <Scatter key={s.name} dataKey={seriesKey(index)} name={s.name} fill={colorAt(index)} />
          ))}
        </ComposedChart>
      );

    } else {
      chart = (
        <BarChart data={rows} layout={horizontal ? 'vertical' : 'horizontal'} margin={margin}>
          {common}
          {model.series.map((s, index) => {
            const isTop = index === lastIndex;
            // Rounded ends only on the outer segment of a stack
            const radius: [number, number, number, number] = horizontal ? [0, 3, 3, 0] : [3, 3, 0, 0];
            return (
              <Bar
                key={s.name}
                dataKey={seriesKey(index)}
                name={s.name}
                fill={colorAt(index)}
                stackId={def.stacked ? 'stack' : undefined}
                radius={!def.stacked || isTop ? radius : 0}
                maxBarSize={48}
              >
                {/* A single-series bar chart looks better with a colour per category */}
                {single && rows.map((_, rowIndex) => <Cell key={rowIndex} fill={colorAt(rowIndex)} />)}
                {valueLabels && (
                  <LabelList dataKey={seriesKey(index)} position={horizontal ? 'right' : 'top'} formatter={format} style={LABEL} />
                )}
                {def.stacked && isTop && (
                  <LabelList
                    dataKey={TOTAL}
                    position={horizontal ? 'right' : 'top'}
                    formatter={format}
                    style={{ ...LABEL, fontWeight: 600 }}
                  />
                )}
              </Bar>
            );
          })}
        </BarChart>
      );
    }
  }

  return (
    <div style={{ width: '100%', height }}>
      {title && (
        <div style={{ height: titleHeight, textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#172B4D', lineHeight: `${titleHeight}px` }}>
          {title}
        </div>
      )}
      <ResponsiveContainer width="100%" height={chartHeight}>
        {chart}
      </ResponsiveContainer>
    </div>
  );
};

// ─── Treemap leaf: coloured box with the category name when it fits ─────────
const TreemapLeaf: React.FC<any> = ({ x, y, width, height, name, fill, depth }) => {
  if (depth === 0) return null;
  const showLabel = width > 50 && height > 20;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke="#fff" strokeWidth={2} />
      {showLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={11}
          fontWeight={500}
        >
          {name}
        </text>
      )}
    </g>
  );
};

export default ChartRenderer;
