import React, { useState, useEffect, useRef } from 'react';
import tableService from '../../services/ServiceNow/table-service';
import { sobjectService } from '../../services/Salesforce';
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

// Waits for the user to pause typing so intermediate keystrokes do not trigger requests
const SEARCH_DEBOUNCE_MS = 1000;

// ─── Reference sources ────────────────────────────────────────────────────────
// ServiceNow references and Salesforce lookups share one picker; only the way
// records are searched and labelled differs

type PickerRecord = {
  id: string;      // ServiceNow sys_id or Salesforce record Id
  label: string;
};

type ReferenceSource = {
  key: string;
  search: (term: string) => Promise<PickerRecord[]>;
  resolveLabel: (id: string) => Promise<string>;
};

const buildReferenceSource = (field?: FilterFieldMeta): ReferenceSource | null => {
  const table = field?.referenceTable;
  if (table) {
    return {
      key: `sn:${table}`,
      search: term => tableService.searchReferenceRecords(table, term)
        .then(found => found.map(r => ({ id: r.sys_id, label: r.label }))),
      resolveLabel: id => tableService.getReferenceRecordLabel(table, id),
    };
  }

  const objects = field?.referenceTo ?? [];
  if (objects.length) {
    return {
      key: `sf:${objects.join(',')}`,
      search: term => sobjectService.searchReferenceRecords(objects, term),
      resolveLabel: id => sobjectService.getReferenceRecordLabel(objects, id),
    };
  }

  return null;
};

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
    const source = buildReferenceSource(field);
    if (source) {
      return (
        <ReferencePicker
          source={source}
          condition={condition}
          onChange={onChange}
          style={style}
        />
      );
    }
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
// Stores the record id as the value and keeps the record name as displayValue,
// so the query uses the id while client-side filtering can match either

interface ReferencePickerProps {
  source: ReferenceSource;
  condition: FilterCondition;
  onChange: (patch: Partial<FilterCondition>) => void;
  style: React.CSSProperties;
}

const ReferencePicker: React.FC<ReferencePickerProps> = ({ source, condition, onChange, style }) => {
  const [term, setTerm]         = useState('');
  const [records, setRecords]   = useState<PickerRecord[]>([]);
  const [isOpen, setIsOpen]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const labelLoaded = useRef('');

  // The source object is rebuilt on every render; effects key off `source.key`
  const sourceRef = useRef(source);
  sourceRef.current = source;

  // ─── Resolve the label of an already saved id ────────────────────────────
  useEffect(() => {
    if (!condition.value || condition.displayValue) return;
    if (labelLoaded.current === condition.value) return;
    labelLoaded.current = condition.value;

    let cancelled = false;
    sourceRef.current.resolveLabel(condition.value).then(label => {
      if (!cancelled && label) onChange({ displayValue: label });
    });
    return () => { cancelled = true; };
  }, [source.key, condition.value, condition.displayValue]);

  const trimmedTerm = term.trim();

  // ─── Debounced search while the dropdown is open ─────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    setLoading(true);
    // The initial list on opening loads right away — only typing is debounced
    const timeout = setTimeout(() => {
      sourceRef.current.search(trimmedTerm)
        .then(found => { if (!cancelled) setRecords(found); })
        .catch(() => { if (!cancelled) setRecords([]); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, trimmedTerm ? SEARCH_DEBOUNCE_MS : 0);

    return () => { cancelled = true; clearTimeout(timeout); };
  }, [trimmedTerm, isOpen, source.key]);

  useEffect(() => () => { if (blurTimeout.current) clearTimeout(blurTimeout.current); }, []);

  const selectRecord = (record: PickerRecord) => {
    labelLoaded.current = record.id;
    onChange({ value: record.id, displayValue: record.label });
    setTerm('');
    setIsOpen(false);
  };

  // The raw id is never shown — while a saved record's name loads, a placeholder stands in
  const shownValue  = isOpen ? term : (condition.displayValue || '');
  const placeholder = !isOpen && condition.value && !condition.displayValue ? 'Loading…' : 'Search record...';

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
              key={record.id}
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
