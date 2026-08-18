import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import type { AvailableField } from '../components/ReportBuilder/ReportBuilder';
import type { DataRow } from '../components/DataGrid/DataGrid';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getHeaderLabel = (key: string, fields: AvailableField[]): string =>
  fields.find(f => f.id === key)?.label ??
  key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() ??
  key;

const buildRows = (rows: DataRow[], columns: string[], fields: AvailableField[]) => {
  const headers = columns.map(c => getHeaderLabel(c, fields));
  const data = rows.map(row =>
    columns.map(col => {
      const val = row[col];
      if (val == null) return '';
      if (typeof val === 'boolean') return val ? 'Yes' : 'No';
      return String(val);
    })
  );
  return { headers, data };
};

// ─── CSV ─────────────────────────────────────────────────────────────────────

export const exportToCSV = (
  rows: DataRow[],
  columns: string[],
  fields: AvailableField[],
  filename = 'report'
): void => {
  const { headers, data } = buildRows(rows, columns, fields);

  const escape = (val: string) =>
    val.includes(',') || val.includes('"') || val.includes('\n')
      ? `"${val.replace(/"/g, '""')}"`
      : val;

  const csv = [
    headers.map(escape).join(','),
    ...data.map(row => row.map(escape).join(',')),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `${filename}.csv`);
};

// ─── XLSX ─────────────────────────────────────────────────────────────────────

export const exportToXLSX = (
  rows: DataRow[],
  columns: string[],
  fields: AvailableField[],
  filename = 'report'
): void => {
  const { headers, data } = buildRows(rows, columns, fields);

  const wsData = [headers, ...data];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // ── Style header row bold ──
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!ws[cellRef]) continue;
    ws[cellRef].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'FAFBFC' } },
    };
  }

  // ── Auto column widths ──
  ws['!cols'] = headers.map((h, i) => {
    const maxLen = Math.max(
      h.length,
      ...data.map(row => (row[i] ?? '').length)
    );
    return { wch: Math.min(maxLen + 2, 40) };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

// ─── PDF ─────────────────────────────────────────────────────────────────────

export const exportToPDF = (
  rows: DataRow[],
  columns: string[],
  fields: AvailableField[],
  filename = 'report'
): void => {
  const { headers, data } = buildRows(rows, columns, fields);

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a3' });

  autoTable(pdf, {
    head: [headers],
    body: data,
    styles: {
      fontSize: 7,
      cellPadding: 3,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [0, 82, 204],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 7,
    },
    alternateRowStyles: {
      fillColor: [250, 251, 252],
    },
    margin: { top: 20, left: 10, right: 10, bottom: 20 },
    tableWidth: 'auto',
    columnStyles: Object.fromEntries(
      headers.map((_, i) => [i, { cellWidth: 'auto', minCellWidth: 40 }])
    ),
    didDrawPage: (hookData) => {
      // ── Page number footer ──
      const pageCount = (pdf as any).internal.getNumberOfPages();
      pdf.setFontSize(7);
      pdf.setTextColor(150);
      pdf.text(
        `Page ${hookData.pageNumber} of ${pageCount}`,
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    },
  });

  pdf.save(`${filename}.pdf`);
};

// ─── Download helper ─────────────────────────────────────────────────────────

const triggerDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};