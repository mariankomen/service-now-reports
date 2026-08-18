import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { type AvailableField } from '../ReportBuilder/ReportBuilder';
import './DataGrid.css';

export type DataRow = Record<string, any> & { id: string | number };

type SortDirection = 'asc' | 'desc' | null;
type PinDirection = 'left' | 'right' | null;

type ColumnState = {
  width: number;
  pin: PinDirection;
};

type SortState = {
  field: string;
  direction: SortDirection;
};

type SummarizeOption = 'sum' | 'avg' | 'max' | 'min' | 'median';

const SUMMARIZE_OPTIONS: { value: SummarizeOption; label: string }[] = [
  { value: 'sum',    label: 'Sum'     },
  { value: 'avg',    label: 'Average' },
  { value: 'max',    label: 'Max'     },
  { value: 'min',    label: 'Min'     },
  { value: 'median', label: 'Median'  },
];

const NUMERIC_TYPES = new Set([
  'integer', 'decimal', 'float', 'long', 'currency', 'currency2',
  'percent', 'double', 'number',
]);

type DataGridProps = {
  rows: DataRow[];
  selectedFields?: string[];
  groupBy?: string[];
  fields: AvailableField[];
  onGroupBy?: (field: string) => void;
  onRemoveColumn?: (field: string) => void;
  onUngroup?: (field: string) => void;
};

// ─── Grouping helpers ─────────────────────────────────────────────────────────

type FlatRow = {
  row: DataRow;
  rowIndex: number;
  isFirstInGroup: boolean;
  groupCellValues: (string | null)[];
  groupCellCounts: (number | null)[];
};

function flattenGroups(rows: DataRow[], groupByFields: string[]): FlatRow[] {
  if (!groupByFields.length) return [];

  const sorted = [...rows].sort((a, b) => {
    for (const field of groupByFields) {
      const cmp = String(a[field] ?? '').localeCompare(String(b[field] ?? ''));
      if (cmp !== 0) return cmp;
    }
    return 0;
  });

  const counts: Map<string, number>[] = groupByFields.map(() => new Map());
  for (const row of sorted) {
    const keys = groupByFields.map(f => String(row[f] ?? '(empty)'));
    for (let d = 0; d < groupByFields.length; d++) {
      const key = keys.slice(0, d + 1).join('||');
      counts[d].set(key, (counts[d].get(key) ?? 0) + 1);
    }
  }

  const result: FlatRow[] = [];
  let prevGroupKeys: string[] = [];
  let rowIndexInGroup = 0;

  for (let i = 0; i < sorted.length; i++) {
    const row = sorted[i];
    const currentGroupKeys = groupByFields.map(f => String(row[f] ?? '(empty)'));

    let changeDepth = groupByFields.length;
    for (let d = 0; d < groupByFields.length; d++) {
      if (currentGroupKeys[d] !== prevGroupKeys[d]) { changeDepth = d; break; }
    }

    const isFirstInGroup = changeDepth < groupByFields.length;
    if (isFirstInGroup) rowIndexInGroup = 0;

    result.push({
      row,
      rowIndex: rowIndexInGroup,
      isFirstInGroup,
      groupCellValues: groupByFields.map((_, d) => d >= changeDepth ? currentGroupKeys[d] : null),
      groupCellCounts: groupByFields.map((_, d) => {
        if (d < changeDepth) return null;
        return counts[d].get(currentGroupKeys.slice(0, d + 1).join('||')) ?? null;
      }),
    });

    prevGroupKeys = currentGroupKeys;
    rowIndexInGroup++;
  }

  return result;
}

// ─── Math helpers ─────────────────────────────────────────────────────────────

function getNumericValues(rows: DataRow[], field: string): number[] {
  return rows.map(r => parseFloat(r[field])).filter(v => !isNaN(v));
}

function calcSummary(values: number[], op: SummarizeOption): number | null {
  if (!values.length) return null;
  switch (op) {
    case 'sum':    return values.reduce((a, b) => a + b, 0);
    case 'avg':    return values.reduce((a, b) => a + b, 0) / values.length;
    case 'max':    return Math.max(...values);
    case 'min':    return Math.min(...values);
    case 'median': {
      const s = [...values].sort((a, b) => a - b);
      const m = Math.floor(s.length / 2);
      return s.length % 2 !== 0 ? s[m] : (s[m - 1] + s[m]) / 2;
    }
  }
}

const DEFAULT_COL_WIDTH = 150;

// ─── Main component ───────────────────────────────────────────────────────────

const DataGrid: React.FC<DataGridProps> = ({
  rows, selectedFields, groupBy = [], fields,
  onGroupBy, onRemoveColumn, onUngroup,
}) => {
  const columns = selectedFields?.length ? selectedFields : ['SF.Id', 'SN.sys_id'];

  const [sort, setSort]                   = useState<SortState>({ field: '', direction: null });
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [colStates, setColStates]         = useState<Record<string, ColumnState>>(() =>
    Object.fromEntries(columns.map(c => [c, { width: DEFAULT_COL_WIDTH, pin: null }]))
  );
  const [openMenuCol, setOpenMenuCol]         = useState<string | null>(null);
  const [menuPosition, setMenuPosition]       = useState<{ top: number; left: number } | null>(null);
  const [hoveredSubmenu, setHoveredSubmenu]   = useState<string | null>(null);
  const [showSubtotals, setShowSubtotals]     = useState(true);
  const [showGrandTotal, setShowGrandTotal]   = useState(true);
  const [summarize, setSummarize]             = useState<Record<string, SummarizeOption[]>>({});
  const [submenuPosition, setSubmenuPosition] = useState<{ top: number; left: number } | null>(null);

  const resizingRef       = useRef<{ field: string; startX: number; startWidth: number } | null>(null);
  const summarizeItemRef  = useRef<HTMLDivElement>(null);
  const submenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Compute displayRows synchronously on every render ────────────────────
  // This ensures sort/filter is always in sync with state — no async lag
  const displayRows = (() => {
    let result = rows.filter(row =>
      Object.entries(columnFilters).every(([field, value]) =>
        !value || String(row[field] ?? '').toLowerCase().includes(value.toLowerCase())
      )
    );

    if (sort.field && sort.direction) {
      result = [...result].sort((a, b) => {
        const av = a[sort.field], bv = b[sort.field];
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp = typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
        return sort.direction === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  })();

  // ─── Submenu handlers ─────────────────────────────────────────────────────
  const openSubmenu = (key: string) => {
    if (submenuTimeoutRef.current) clearTimeout(submenuTimeoutRef.current);
    if (summarizeItemRef.current) {
      const rect = summarizeItemRef.current.getBoundingClientRect();
      setSubmenuPosition({ top: rect.top + window.scrollY, left: rect.right + window.scrollX });
    }
    setHoveredSubmenu(key);
  };

  const closeSubmenu = () => {
    submenuTimeoutRef.current = setTimeout(() => setHoveredSubmenu(null), 150);
  };

  const keepSubmenu = () => {
    if (submenuTimeoutRef.current) clearTimeout(submenuTimeoutRef.current);
  };

  // ─── Sorting ──────────────────────────────────────────────────────────────
  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field
        ? prev.direction === 'asc' ? 'desc' : prev.direction === 'desc' ? null : 'asc'
        : 'asc',
    }));
  };

  // ─── Resizing ─────────────────────────────────────────────────────────────
  const startResize = (field: string, e: React.MouseEvent) => {
    e.preventDefault();
    resizingRef.current = { field, startX: e.clientX, startWidth: colStates[field]?.width ?? DEFAULT_COL_WIDTH };
    const onMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      setColStates(prev => ({
        ...prev,
        [resizingRef.current!.field]: {
          ...prev[resizingRef.current!.field],
          width: Math.max(60, resizingRef.current!.startWidth + e.clientX - resizingRef.current!.startX),
        },
      }));
    };
    const onUp = () => {
      resizingRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ─── Pinning ──────────────────────────────────────────────────────────────
  const pinColumn = (field: string, direction: PinDirection) => {
    setColStates(prev => ({ ...prev, [field]: { ...prev[field], pin: direction } }));
    closeMenu();
  };

  const closeMenu = () => {
    setOpenMenuCol(null);
    setMenuPosition(null);
    setHoveredSubmenu(null);
    if (submenuTimeoutRef.current) clearTimeout(submenuTimeoutRef.current);
  };

  // ─── Column ordering ──────────────────────────────────────────────────────
  const orderedColumns = [
    ...columns.filter(c => colStates[c]?.pin === 'left'),
    ...columns.filter(c => !colStates[c]?.pin),
    ...columns.filter(c => colStates[c]?.pin === 'right'),
  ];

  const getPinnedOffset = (field: string, direction: PinDirection, columnList: string[]): number => {
    if (!direction) return 0;
    const pinned = columnList.filter(c => colStates[c]?.pin === direction);
    const idx = pinned.indexOf(field);
    if (direction === 'left') return pinned.slice(0, idx).reduce((s, c) => s + (colStates[c]?.width ?? DEFAULT_COL_WIDTH), 0);
    return pinned.slice(idx + 1).reduce((s, c) => s + (colStates[c]?.width ?? DEFAULT_COL_WIDTH), 0);
  };

  // ─── Field helpers ────────────────────────────────────────────────────────
  const getFieldType   = (key: string) => fields?.find(f => f.id === key)?.type;
  const isNumericField = (key: string) => NUMERIC_TYPES.has(getFieldType(key) ?? '');

  const formatCurrency = (value: any) => {
    const num = parseFloat(value);
    return isNaN(num) ? String(value) : '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatNumeric = (value: number, fieldKey: string): string => {
    const type = getFieldType(fieldKey);
    if (type === 'currency' || type === 'currency2') return formatCurrency(value);
    if (type === 'percent') return value.toFixed(2) + '%';
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  };

  const formatValue = (key: string, value: any): string => {
    if (value == null) return '-';
    const type = getFieldType(key);
    if (type === 'currency' || type === 'currency2') return formatCurrency(value);
    if (type === 'percent') {
      const num = parseFloat(value);
      return isNaN(num) ? String(value) : num.toFixed(2) + '%';
    }
    if (key.includes('Date') && typeof value === 'string') {
      try { return new Date(value).toLocaleDateString(); } catch { return value; }
    }
    return String(value);
  };

  const getHeaderLabel = (key: string) =>
    fields?.find(f => f.id === key)?.label ?? key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() ?? key;

  const numericAlign = (key: string): React.CSSProperties =>
    isNumericField(key) ? { textAlign: 'right' } : {};

  // ─── Summarize helpers ────────────────────────────────────────────────────
  const toggleSummarize = (field: string, op: SummarizeOption) => {
    setSummarize(prev => {
      const current = prev[field] ?? (isNumericField(field) ? ['sum'] : []);
      const next = current.includes(op) ? current.filter(o => o !== op) : [...current, op];
      return { ...prev, [field]: next };
    });
  };

  const getSummarizeOps = (field: string): SummarizeOption[] =>
    summarize[field] ?? (isNumericField(field) ? ['sum'] : []);

  const renderSummaryCell = (field: string, groupRows: DataRow[]): React.ReactNode => {
    const ops = getSummarizeOps(field);
    if (!ops.length || !isNumericField(field)) return null;
    const values = getNumericValues(groupRows, field);
    const lines = ops.map(op => {
      const val = calcSummary(values, op);
      if (val === null) return null;
      const label = op === 'sum' ? 'Sum:' : op === 'avg' ? 'Avg:' : op === 'max' ? 'Max:' : op === 'min' ? 'Min:' : 'Median:';
      return <div key={op} style={{ lineHeight: 1.5 }}>{label} {formatNumeric(val, field)}</div>;
    }).filter(Boolean);
    return lines.length ? <div style={{ textAlign: 'right' }}>{lines}</div> : null;
  };

  if (!rows?.length) return <div className="dg-empty">No records found</div>;

  const isGrouped      = groupBy.length > 0;
  const groupColumns   = groupBy.filter(c => orderedColumns.includes(c));
  const displayColumns = [...groupColumns, ...orderedColumns.filter(c => !groupBy.includes(c))];
  const activeColumns  = isGrouped ? displayColumns : orderedColumns;
  const flatRows       = isGrouped ? flattenGroups(displayRows, groupBy) : [];

  // ─── Build group rows map for subtotals ───────────────────────────────────
  const buildGroupRows = () => {
    const map: Map<string, DataRow[]> = new Map();
    for (const fr of flatRows) {
      const key = groupBy.map(f => String(fr.row[f] ?? '(empty)')).join('||');
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(fr.row);
    }
    return Array.from(map.values());
  };
  const groupRowsData = isGrouped ? buildGroupRows() : [];

  // ─── Render grouped rows ──────────────────────────────────────────────────
  const renderGroupedRows = () => {
    const output: React.ReactNode[] = [];
    let groupIdx = 0;

    for (let i = 0; i < flatRows.length; i++) {
      const { row, rowIndex, groupCellValues, groupCellCounts } = flatRows[i];
      const isLastInGroup = i === flatRows.length - 1 || flatRows[i + 1].isFirstInGroup;

      output.push(
        <tr key={`row-${row.id ?? i}`} className={rowIndex % 2 === 0 ? 'dg-row-even' : 'dg-row-odd'}>
          {displayColumns.map(field => {
            const pin      = colStates[field]?.pin;
            const offset   = getPinnedOffset(field, pin, displayColumns);
            const gIdx     = groupBy.indexOf(field);
            const isGroup  = gIdx !== -1;
            const rawValue = groupCellValues[gIdx];
            const count    = groupCellCounts?.[gIdx];
            const display  = rawValue === null ? null : rawValue === '(empty)' ? '-' : rawValue;

            return (
              <td
                key={field}
                className={[
                  'dg-td',
                  isGroup ? 'dg-td-group' : '',
                  isLastInGroup ? (showSubtotals ? 'dg-td-group-last' : 'dg-td-group-separator') : '',
                  pin === 'left' ? 'dg-td-pin-left' : pin === 'right' ? 'dg-td-pin-right' : '',
                ].filter(Boolean).join(' ')}
                style={{
                  position: pin ? 'sticky' : undefined,
                  left: pin === 'left' ? offset : undefined,
                  right: pin === 'right' ? offset : undefined,
                  zIndex: pin ? 1 : undefined,
                  backgroundColor: isGroup ? undefined : pin ? (rowIndex % 2 === 0 ? '#F5F7FF' : '#EEF2FF') : undefined,
                  color: isGroup ? (rawValue !== null ? undefined : 'transparent') : undefined,
                  ...(!isGroup ? numericAlign(field) : {}),
                }}
              >
                {isGroup
                  ? display !== null ? (
                    <span>
                      {display}
                      {count !== null && (
                        <span style={{ marginLeft: 6, fontSize: 11, color: '#8993A4', fontWeight: 400 }}>({count})</span>
                      )}
                    </span>
                  ) : ''
                  : field.includes('State')
                    ? <span style={getStatusStyle(row[field])}>{row[field]}</span>
                    : formatValue(field, row[field])
                }
              </td>
            );
          })}
        </tr>
      );

      if (isLastInGroup && showSubtotals && groupRowsData[groupIdx]) {
        const gRows = groupRowsData[groupIdx];
        output.push(
          <tr key={`subtotal-${groupIdx}`} className="dg-subtotal-row">
            {displayColumns.map((field, fi) => {
              const isGroup = groupBy.includes(field);
              const pin     = colStates[field]?.pin;
              const offset  = getPinnedOffset(field, pin, displayColumns);
              return (
                <td
                  key={field}
                  className={['dg-td', isGroup ? 'dg-td-group' : ''].filter(Boolean).join(' ')}
                  style={{
                    position: pin ? 'sticky' : undefined,
                    left: pin === 'left' ? offset : undefined,
                    right: pin === 'right' ? offset : undefined,
                    zIndex: pin ? 1 : undefined,
                  }}
                >
                  {fi === 0 ? <strong>Subtotal</strong> : isGroup ? '' : renderSummaryCell(field, gRows)}
                </td>
              );
            })}
          </tr>
        );
        groupIdx++;
      }
    }
    return output;
  };

  // ─── Flat rows ────────────────────────────────────────────────────────────
  const renderFlatRows = () =>
    displayRows.map((row, i) => (
      <tr key={`${row.id ?? i}`} className={i % 2 === 0 ? 'dg-row-even' : 'dg-row-odd'}>
        {orderedColumns.map(field => {
          const pin    = colStates[field]?.pin;
          const offset = getPinnedOffset(field, pin, orderedColumns);
          return (
            <td
              key={field}
              className={['dg-td', pin === 'left' ? 'dg-td-pin-left' : pin === 'right' ? 'dg-td-pin-right' : ''].filter(Boolean).join(' ')}
              style={{
                position: pin ? 'sticky' : undefined,
                left: pin === 'left' ? offset : undefined,
                right: pin === 'right' ? offset : undefined,
                zIndex: pin ? 1 : undefined,
                backgroundColor: pin ? (i % 2 === 0 ? '#F5F7FF' : '#EEF2FF') : undefined,
                ...numericAlign(field),
              }}
            >
              {field.includes('State') ? <span style={getStatusStyle(row[field])}>{row[field]}</span> : formatValue(field, row[field])}
            </td>
          );
        })}
      </tr>
    ));

  // ─── Grand Total row ──────────────────────────────────────────────────────
  const renderGrandTotal = () => {
    if (!showGrandTotal || !isGrouped) return null;
    return (
      <tr className="dg-grand-total-row">
        {activeColumns.map((field, fi) => {
          const isGroup = groupBy.includes(field);
          const pin     = colStates[field]?.pin;
          const offset  = getPinnedOffset(field, pin, activeColumns);
          return (
            <td
              key={field}
              className={['dg-td', isGroup ? 'dg-td-group' : ''].filter(Boolean).join(' ')}
              style={{
                position: pin ? 'sticky' : undefined,
                left: pin === 'left' ? offset : undefined,
                right: pin === 'right' ? offset : undefined,
                zIndex: pin ? 1 : undefined,
              }}
            >
              {fi === 0 ? <strong>Grand Total</strong> : isGroup ? '' : renderSummaryCell(field, displayRows)}
            </td>
          );
        })}
      </tr>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', overflow: 'auto', width: '100%', flex: 1 }} onClick={closeMenu}>
        <table
          className="dg-table"
          style={{ width: activeColumns.reduce((s, c) => s + (colStates[c]?.width ?? DEFAULT_COL_WIDTH), 0) }}
        >
          <colgroup>
            {activeColumns.map(field => <col key={field} style={{ width: colStates[field]?.width ?? DEFAULT_COL_WIDTH }} />)}
          </colgroup>

          <thead>
            <tr>
              {activeColumns.map(field => {
                const pin    = colStates[field]?.pin;
                const offset = getPinnedOffset(field, pin, activeColumns);
                return (
                  <th
                    key={field}
                    className={['dg-th', pin ? 'pinned' : '', isNumericField(field) ? 'dg-th-numeric' : ''].filter(Boolean).join(' ')}
                    style={{
                      width: colStates[field]?.width ?? DEFAULT_COL_WIDTH,
                      position: 'sticky', top: 0,
                      left: pin === 'left' ? offset : undefined,
                      right: pin === 'right' ? offset : undefined,
                      zIndex: pin ? 4 : 3,
                      boxShadow: pin === 'left' ? '2px 0 4px rgba(0,0,0,0.08)' : pin === 'right' ? '-2px 0 4px rgba(0,0,0,0.08)' : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
                      <span
                        onClick={() => handleSort(field)}
                        style={{ flex: 1, cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {getHeaderLabel(field)}
                        {sort.field === field && sort.direction === 'asc' && ' ↑'}
                        {sort.field === field && sort.direction === 'desc' && ' ↓'}
                      </span>
                      <span
                        onClick={e => {
                          e.stopPropagation();
                          if (openMenuCol === field) { closeMenu(); return; }
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
                          setOpenMenuCol(field);
                        }}
                        style={{ cursor: 'pointer', color: '#5E6C84', fontSize: 10, padding: '0 2px' }}
                      >⋮</span>
                    </div>
                    <div className="dg-resize-handle" onMouseDown={e => startResize(field, e)} />
                  </th>
                );
              })}
            </tr>

            <tr>
              {activeColumns.map(field => {
                const pin    = colStates[field]?.pin;
                const offset = getPinnedOffset(field, pin, activeColumns);
                return (
                  <th
                    key={field}
                    className={['dg-th-filter', pin ? 'pinned' : ''].filter(Boolean).join(' ')}
                    style={{
                      position: 'sticky', top: 37,
                      left: pin === 'left' ? offset : undefined,
                      right: pin === 'right' ? offset : undefined,
                      zIndex: pin ? 4 : 3,
                    }}
                  >
                    <input
                      className="dg-filter-input"
                      value={columnFilters[field] ?? ''}
                      onChange={e => setColumnFilters(prev => ({ ...prev, [field]: e.target.value }))}
                      placeholder="Filter..."
                    />
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {isGrouped ? (
              <>
                {renderGroupedRows()}
                {flatRows.length === 0 && (
                  <tr><td colSpan={activeColumns.length} className="dg-empty">No records match your filters</td></tr>
                )}
              </>
            ) : (
              <>
                {renderFlatRows()}
                {displayRows.length === 0 && (
                  <tr><td colSpan={activeColumns.length} className="dg-empty">No records match your filters</td></tr>
                )}
              </>
            )}
            {renderGrandTotal()}
          </tbody>
        </table>
      </div>

      {isGrouped && (
        <div className="dg-toolbar">
          <Toggle label="Subtotals"   checked={showSubtotals}   onChange={setShowSubtotals} />
          <Toggle label="Grand Total" checked={showGrandTotal}  onChange={setShowGrandTotal} />
        </div>
      )}

      {openMenuCol && menuPosition && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={closeMenu} />
          <div
            onClick={e => e.stopPropagation()}
            className="dg-menu"
            style={{ position: 'absolute', top: menuPosition.top, left: menuPosition.left, zIndex: 1000 }}
          >
            <div className="dg-menu-section-label">Sort</div>
            <div className="dg-menu-item" onClick={() => { setSort({ field: openMenuCol, direction: 'asc' }); closeMenu(); }}>
              <span className="dg-menu-icon">↑</span> Sort Ascending
            </div>
            <div className="dg-menu-item" onClick={() => { setSort({ field: openMenuCol, direction: 'desc' }); closeMenu(); }}>
              <span className="dg-menu-icon">↓</span> Sort Descending
            </div>

            <div className="dg-menu-divider" />

            <div className="dg-menu-section-label">Pin</div>
            {colStates[openMenuCol]?.pin !== 'left'  && <div className="dg-menu-item" onClick={() => pinColumn(openMenuCol, 'left')}><span className="dg-menu-icon">⇤</span> Pin Left</div>}
            {colStates[openMenuCol]?.pin !== 'right' && <div className="dg-menu-item" onClick={() => pinColumn(openMenuCol, 'right')}><span className="dg-menu-icon">⇥</span> Pin Right</div>}
            {colStates[openMenuCol]?.pin && <div className="dg-menu-item" onClick={() => pinColumn(openMenuCol, null)}><span className="dg-menu-icon">✕</span> Unpin</div>}

            {isNumericField(openMenuCol) && (
              <>
                <div className="dg-menu-divider" />
                <div
                  ref={summarizeItemRef}
                  className="dg-menu-item summarize"
                  onMouseEnter={() => openSubmenu('summarize')}
                  onMouseLeave={closeSubmenu}
                >
                  <span><span className="dg-menu-icon">∑</span> Summarize</span>
                  <span style={{ color: '#5E6C84', fontSize: 10 }}>▶</span>
                </div>
              </>
            )}

            {onGroupBy && !groupBy.includes(openMenuCol) && (
              <>
                <div className="dg-menu-divider" />
                <div className="dg-menu-section-label">Group</div>
                <div className="dg-menu-item" onClick={() => { onGroupBy(openMenuCol); closeMenu(); }}><span className="dg-menu-icon">▤</span> Group by This Field</div>
              </>
            )}
            {onUngroup && groupBy.includes(openMenuCol) && (
              <>
                <div className="dg-menu-divider" />
                <div className="dg-menu-section-label">Group</div>
                <div className="dg-menu-item" onClick={() => { onUngroup(openMenuCol); closeMenu(); }}><span className="dg-menu-icon">▤</span> Ungroup This Field</div>
              </>
            )}

            {onRemoveColumn && (
              <>
                <div className="dg-menu-divider" />
                <div className="dg-menu-item danger" onClick={() => { onRemoveColumn(openMenuCol); closeMenu(); }}><span className="dg-menu-icon">✕</span> Remove Column</div>
              </>
            )}
          </div>
        </>,
        document.body
      )}

      {hoveredSubmenu === 'summarize' && submenuPosition && openMenuCol && createPortal(
        <div
          className="dg-submenu"
          style={{ position: 'absolute', top: submenuPosition.top, left: submenuPosition.left, zIndex: 1001 }}
          onMouseEnter={keepSubmenu}
          onMouseLeave={closeSubmenu}
        >
          {SUMMARIZE_OPTIONS.map(opt => {
            const checked = getSummarizeOps(openMenuCol).includes(opt.value);
            return (
              <div
                key={opt.value}
                className={`dg-submenu-item${checked ? ' checked' : ''}`}
                onClick={e => { e.stopPropagation(); toggleSummarize(openMenuCol, opt.value); }}
              >
                <span style={{ width: 14, fontWeight: 700 }}>{checked ? '✓' : ''}</span>
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
};

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className="dg-toggle-label">
    <div className="dg-toggle-track" onClick={() => onChange(!checked)} style={{ backgroundColor: checked ? '#0052CC' : '#DFE1E6' }}>
      <div className="dg-toggle-thumb" style={{ left: checked ? 18 : 2 }} />
    </div>
    {label}
  </label>
);

const getStatusStyle = (state: string | undefined): React.CSSProperties => {
  const base: React.CSSProperties = { padding: '2px 6px', borderRadius: '3px', fontSize: '11px', fontWeight: 'bold' };
  if (!state) return base;
  if (['New', 'To Do', 'Design'].includes(state))         return { ...base, backgroundColor: '#DFE1E6', color: '#42526E' };
  if (['Active', 'Doing', 'In Progress'].includes(state)) return { ...base, backgroundColor: '#DEEBFF', color: '#0052CC' };
  if (['Closed', 'Done', 'Resolved'].includes(state))     return { ...base, backgroundColor: '#E3FCEF', color: '#006644' };
  return { ...base, backgroundColor: '#EBECF0' };
};

export default DataGrid;