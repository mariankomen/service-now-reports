import React, { useState, useEffect, useRef } from 'react';
import tableService, { type ReferenceRecord } from '../../services/ServiceNow/table-service';
import {
  type FilterCondition,
  type FilterFieldMeta,
  type FilterInputKind,
} from '../../utils/filterBuilder';

interface FilterValueInputProps {
  kind: FilterInputKind;
  field?: FilterFieldMeta;
  condition: FilterCondition;
  onChange: (patch: Partial<FilterCondition>) => void;
  style: React.CSSProperties;
}

const FilterValueInput: React.FC<FilterValueInputProps> = ({ kind, field, condition, onChange, style }) => {

  // ─── Choice list ───────────────────────────────────────────────────────────
  if (kind === 'choice') {
    return (
      <select
        value={condition.value}
        onChange={e => {
          const picked = field?.choices?.find(c => c.value === e.target.value);
          onChange({ value: e.target.value, displayValue: picked?.label ?? '' });
        }}
        style={style}
      >
        <option value="">Select value...</option>
        {field?.choices?.map(choice => (
          <option key={choice.value} value={choice.value}>{choice.label}</option>
        ))}
      </select>
    );
  }

  // ─── Reference record picker ───────────────────────────────────────────────
  if (kind === 'reference') {
    return (
      <ReferencePicker
        table={field?.referenceTable ?? ''}
        condition={condition}
        onChange={onChange}
        style={style}
      />
    );
  }

  // ─── Typed native inputs ───────────────────────────────────────────────────
  const inputType =
    kind === 'number'   ? 'number' :
    kind === 'date'     ? 'date' :
    kind === 'datetime' ? 'datetime-local' :
    kind === 'time'     ? 'time' : 'text';

  return (
    <input
      type={inputType}
      value={condition.value}
      onChange={e => onChange({ value: e.target.value, displayValue: '' })}
      placeholder={kind === 'number' ? '0' : 'Value...'}
      style={style}
    />
  );
};

// ─── Reference picker ────────────────────────────────────────────────────────
// Searches the referenced table and stores the sys_id as the value, keeping the
// record name as displayValue so client-side filtering can match display values

interface ReferencePickerProps {
  table: string;
  condition: FilterCondition;
  onChange: (patch: Partial<FilterCondition>) => void;
  style: React.CSSProperties;
}

const ReferencePicker: React.FC<ReferencePickerProps> = ({ table, condition, onChange, style }) => {
  const [term, setTerm]         = useState('');
  const [records, setRecords]   = useState<ReferenceRecord[]>([]);
  const [isOpen, setIsOpen]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const labelLoaded = useRef('');

  // ─── Resolve the label of an already saved sys_id ────────────────────────
  useEffect(() => {
    if (!table || !condition.value || condition.displayValue) return;
    if (labelLoaded.current === condition.value) return;
    labelLoaded.current = condition.value;

    let cancelled = false;
    tableService.getReferenceRecordLabel(table, condition.value).then(label => {
      if (!cancelled && label) onChange({ displayValue: label });
    });
    return () => { cancelled = true; };
  }, [table, condition.value, condition.displayValue]);

  // ─── Debounced search while the dropdown is open ─────────────────────────
  useEffect(() => {
    if (!isOpen || !table) return;

    let cancelled = false;
    setLoading(true);
    const timeout = setTimeout(() => {
      tableService.searchReferenceRecords(table, term)
        .then(found => { if (!cancelled) setRecords(found); })
        .catch(() => { if (!cancelled) setRecords([]); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 250);

    return () => { cancelled = true; clearTimeout(timeout); };
  }, [term, isOpen, table]);

  useEffect(() => () => { if (blurTimeout.current) clearTimeout(blurTimeout.current); }, []);

  const selectRecord = (record: ReferenceRecord) => {
    labelLoaded.current = record.sys_id;
    onChange({ value: record.sys_id, displayValue: record.label });
    setTerm('');
    setIsOpen(false);
  };

  const shownValue = isOpen ? term : (condition.displayValue || condition.value || '');

  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 120 }}>
      <input
        type="text"
        value={shownValue}
        onChange={e => { setTerm(e.target.value); setIsOpen(true); }}
        onFocus={() => { setTerm(''); setIsOpen(true); }}
        onBlur={() => {
          blurTimeout.current = setTimeout(() => setIsOpen(false), 150);
        }}
        placeholder="Search record..."
        style={{ ...style, width: '100%', boxSizing: 'border-box' }}
      />

      {condition.value && !isOpen && (
        <button
          onMouseDown={e => { e.preventDefault(); onChange({ value: '', displayValue: '' }); }}
          title="Clear"
          style={clearBtnStyle}
        >
          ✕
        </button>
      )}

      {isOpen && (
        <div style={dropdownStyle}>
          {loading && <div style={dropdownHintStyle}>Searching…</div>}
          {!loading && records.length === 0 && <div style={dropdownHintStyle}>No records found</div>}
          {!loading && records.map(record => (
            <div
              key={record.sys_id}
              onMouseDown={e => { e.preventDefault(); selectRecord(record); }}
              style={dropdownItemStyle}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F4F5F7'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              {record.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  zIndex: 30,
  marginTop: 2,
  maxHeight: 200,
  overflowY: 'auto',
  backgroundColor: 'white',
  border: '1px solid #DFE1E6',
  borderRadius: 4,
  boxShadow: '0 4px 8px rgba(9, 30, 66, 0.15)',
};

const dropdownItemStyle: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: 12,
  color: '#172B4D',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const dropdownHintStyle: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: 12,
  color: '#8993A4',
  fontStyle: 'italic',
};

const clearBtnStyle: React.CSSProperties = {
  position: 'absolute',
  right: 4,
  top: '50%',
  transform: 'translateY(-50%)',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: '#8993A4',
  fontSize: 11,
  padding: '2px 4px',
  lineHeight: 1,
};

export default FilterValueInput;
