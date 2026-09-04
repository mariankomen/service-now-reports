export type ChartValueFormat = 'number' | 'currency' | 'percent';

export const formatChartValue = (value: number, format: ChartValueFormat = 'number'): string => {
  if (value == null || isNaN(value)) return '';
  if (format === 'currency') return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (format === 'percent') return value.toLocaleString('en-US', { maximumFractionDigits: 2 }) + '%';
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
};
