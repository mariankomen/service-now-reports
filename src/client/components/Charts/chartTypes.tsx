import React from 'react';

export type ChartType =
  | 'hbar' | 'bar' | 'stacked_bar' | 'stacked_column'
  | 'line' | 'donut' | 'funnel' | 'scatter' | 'treemap'
  | 'multi_line' | 'multi_column' | 'table';

export type ChartTypeDef = {
  id: ChartType;
  label: string;
  seriesType: string;      // Highcharts series type
  stacked?: boolean;       // series stack on top of each other
  multiSeries?: boolean;   // needs a "Split by" field to produce several series
  categorical?: boolean;   // uses an x-axis with categories
};

// Note on ids: "bar" is kept for the vertical column chart because existing
// saved reports already store it — renaming would change how they render.
export const CHART_TYPES: ChartTypeDef[] = [
  { id: 'hbar',           label: 'Bar',             seriesType: 'bar',     categorical: true },
  { id: 'bar',            label: 'Column',          seriesType: 'column',  categorical: true },
  { id: 'stacked_bar',    label: 'Stacked Bar',     seriesType: 'bar',     categorical: true, stacked: true, multiSeries: true },
  { id: 'stacked_column', label: 'Stacked Column',  seriesType: 'column',  categorical: true, stacked: true, multiSeries: true },
  { id: 'line',           label: 'Line',            seriesType: 'line',    categorical: true },
  { id: 'donut',          label: 'Donut',           seriesType: 'pie' },
  { id: 'funnel',         label: 'Funnel',          seriesType: 'funnel' },
  { id: 'scatter',        label: 'Scatter',         seriesType: 'scatter', categorical: true },
  { id: 'treemap',        label: 'Treemap',         seriesType: 'treemap' },
  { id: 'multi_line',     label: 'Multi Line',      seriesType: 'line',    categorical: true, multiSeries: true },
  { id: 'multi_column',   label: 'Multi Column',    seriesType: 'column',  categorical: true, multiSeries: true },
  { id: 'table',          label: 'Table',           seriesType: 'table' },
];

export const getChartTypeDef = (id?: string): ChartTypeDef =>
  CHART_TYPES.find(t => t.id === id) ?? CHART_TYPES[1];

export const isMultiSeriesChart = (id?: string): boolean => !!getChartTypeDef(id).multiSeries;

// ─── Icons ────────────────────────────────────────────────────────────────────
// Small hand-drawn glyphs keep stacked / multi variants visually distinct,
// which off-the-shelf icon sets do not offer

const svg = (children: React.ReactNode) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">{children}</svg>
);

const r = (x: number, y: number, w: number, h: number, fill: string) =>
  <rect key={`${x}-${y}-${w}-${h}-${fill}`} x={x} y={y} width={w} height={h} rx="1" fill={fill} />;

const A = 'currentColor';
const B = '#9BB8E8';

export const CHART_ICONS: Record<ChartType, React.ReactNode> = {
  hbar: svg([r(3, 4, 12, 3, A), r(3, 9, 8, 3, A), r(3, 14, 5, 3, A)]),
  bar: svg([r(4, 9, 3, 8, A), r(9, 5, 3, 12, A), r(14, 11, 3, 6, A)]),
  stacked_bar: svg([r(3, 4, 7, 3, A), r(10, 4, 5, 3, B), r(3, 9, 5, 3, A), r(8, 9, 6, 3, B), r(3, 14, 4, 3, A), r(7, 14, 4, 3, B)]),
  stacked_column: svg([r(4, 11, 3, 6, A), r(4, 7, 3, 4, B), r(9, 9, 3, 8, A), r(9, 4, 3, 5, B), r(14, 13, 3, 4, A), r(14, 9, 3, 4, B)]),
  line: svg(<path d="M3 14l4-5 4 3 6-7" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />),
  donut: svg([
    <circle key="o" cx="10" cy="10" r="6.5" stroke={A} strokeWidth="3" />,
    <path key="s" d="M10 3.5a6.5 6.5 0 016.5 6.5" stroke={B} strokeWidth="3" strokeLinecap="round" />,
  ]),
  funnel: svg(<path d="M3 4h14l-5 6v6l-4 2v-8z" fill={A} />),
  scatter: svg([
    <circle key="1" cx="6" cy="13" r="1.8" fill={A} />,
    <circle key="2" cx="10" cy="8" r="1.8" fill={A} />,
    <circle key="3" cx="14" cy="11" r="1.8" fill={A} />,
    <circle key="4" cx="7" cy="6" r="1.8" fill={B} />,
  ]),
  treemap: svg([r(3, 3, 9, 9, A), r(13, 3, 4, 4, B), r(13, 8, 4, 4, B), r(3, 13, 5, 4, B), r(9, 13, 8, 4, A)]),
  multi_line: svg([
    <path key="1" d="M3 15l4-4 4 2 6-6" stroke={A} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
    <path key="2" d="M3 9l4 3 4-5 6 3" stroke={B} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  ]),
  multi_column: svg([r(3, 8, 2.5, 9, A), r(6, 11, 2.5, 6, B), r(11, 5, 2.5, 12, A), r(14, 9, 2.5, 8, B)]),
  table: svg([
    r(3, 4, 14, 3, A), r(3, 8.5, 6, 3, B), r(11, 8.5, 6, 3, B), r(3, 13, 6, 3, B), r(11, 13, 6, 3, B),
  ]),
};
