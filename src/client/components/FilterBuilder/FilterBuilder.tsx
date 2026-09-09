import React, { useState, useEffect } from 'react';
import { type AvailableField } from '../ReportBuilder/ReportBuilder';
import {
  type FilterCondition,
  getOperatorsForField,
  getInputKind,
  findField,
  buildDefaultLogic,
  buildEncodedQuery,
  normalizeFieldId,
} from '../../utils/filterBuilder';
import FilterValueInput from './FilterValueInput';

// ─── Unique id helper ─────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8);

interface FilterBuilderProps {
  conditions: FilterCondition[];
  logic: string;
  availableFields: AvailableField[];
  onApply: (conditions: FilterCondition[], logic: string, encodedQuery: string) => void;
}

const FilterBuilder: React.FC<FilterBuilderProps> = ({
  conditions: initialConditions,
  logic: initialLogic,
  availableFields,
  onApply,
}) => {
  const [conditions, setConditions] = useState<FilterCondition[]>(initialConditions);
  const [localLogic, setLocalLogic]   = useState(initialLogic || buildDefaultLogic(initialConditions));
  const [editLogic, setEditLogic]     = useState(false);
  const [logicError, setLogicError]   = useState('');

  const sfFields = availableFields.filter(f => f.id.startsWith('SF.'));
  const snFields = availableFields.filter(f => f.id.startsWith('SN.'));

  // Sync when report loads (initialConditions/logic changes from outside)
  useEffect(() => {
    setConditions(initialConditions);
    setLocalLogic(initialLogic || buildDefaultLogic(initialConditions));
  }, [initialConditions.length, initialLogic]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  // The default operator depends on the field type — booleans, choices and
  // references do not offer the plain "=" that other types start with
  const defaultOperatorFor = (fieldId: string): string =>
    getOperatorsForField(findField(availableFields, fieldId))[0]?.value ?? '=';

  const addCondition = () => {
    const firstField = snFields[0] ?? sfFields[0];
    const newCondition: FilterCondition = {
      id: uid(),
      field: firstField ? firstField.id : '',
      operator: firstField ? defaultOperatorFor(firstField.id) : '=',
      value: '',
    };
    const newConditions = [...conditions, newCondition];
    setConditions(newConditions);
    if (!editLogic) {
      setLocalLogic(buildDefaultLogic(newConditions));
    }
  };

  const removeCondition = (id: string) => {
    const newConditions = conditions.filter(c => c.id !== id);
    setConditions(newConditions);
    if (!editLogic) {
      setLocalLogic(buildDefaultLogic(newConditions));
    }
  };

  const updateCondition = (id: string, patch: Partial<FilterCondition>) => {
    setConditions(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, ...patch };

      if (patch.operator && getInputKind(findField(availableFields, updated.field), patch.operator) === 'none') {
        updated.value = '';
        updated.displayValue = '';
      }
      if (patch.field) {
        updated.operator = defaultOperatorFor(patch.field);
        updated.value = '';
        updated.displayValue = '';
      }
      return updated;
    }));
  };

  const handleLogicChange = (val: string) => {
    setLocalLogic(val);
    const nums = val.match(/\d+/g)?.map(Number) ?? [];
    const invalid = nums.filter(n => n < 1 || n > conditions.length);
    if (invalid.length) {
      setLogicError(`Condition ${invalid.join(', ')} doesn't exist.`);
    } else {
      setLogicError('');
    }
  };

  const handleApply = () => {
    if (logicError) return;
    const encoded = buildEncodedQuery(conditions, localLogic);
    onApply(conditions, localLogic, encoded);
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── Conditions ── */}
      {conditions.length === 0 ? (
        <div style={emptyStyle}>
          No filters added. Click "+ Add condition" to start.
        </div>
      ) : (
        conditions.map((condition, index) => {
          const field     = findField(availableFields, condition.field);
          const operators = getOperatorsForField(field);
          const inputKind = getInputKind(field, condition.operator);

          // A saved operator may no longer be offered for this field type —
          // keep it in the list so the selection stays visible until changed
          const operatorOptions = operators.some(o => o.value === condition.operator)
            ? operators
            : operators.concat([{ label: condition.operator, value: condition.operator }]);

          return (
            <div key={condition.id} style={conditionRowStyle}>
              {/* ── Number badge ── */}
              <span style={badgeStyle}>{index + 1}</span>

              {/* ── Field ── */}
              <select
                value={condition.field ? normalizeFieldId(condition.field) : ''}
                onChange={e => updateCondition(condition.id, { field: e.target.value })}
                style={selectStyle}
              >
                <option value="">Select field...</option>
                {sfFields.length > 0 && (
                  <optgroup label="Salesforce Fields">
                    {sfFields.map(f => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </optgroup>
                )}
                {snFields.length > 0 && (
                  <optgroup label="ServiceNow Fields">
                    {snFields.map(f => (
                      <option key={f.id} value={f.id}>{f.label}</option>
                    ))}
                  </optgroup>
                )}
              </select>

              {/* ── Operator ── */}
              <select
                value={condition.operator}
                onChange={e => updateCondition(condition.id, { operator: e.target.value })}
                style={{ ...selectStyle, minWidth: 130 }}
              >
                {operatorOptions.map(op => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>

              {/* ── Value — input type follows the field type ── */}
              {inputKind !== 'none' && (
                <FilterValueInput
                  kind={inputKind}
                  field={field}
                  condition={condition}
                  onChange={patch => updateCondition(condition.id, patch)}
                  style={inputStyle}
                />
              )}

              {/* ── Remove ── */}
              <button
                onClick={() => removeCondition(condition.id)}
                style={removeBtnStyle}
                title="Remove"
              >
                ✕
              </button>
            </div>
          );
        })
      )}

      {/* ── Add condition ── */}
      <button onClick={addCondition} style={addBtnStyle}>
        + Add condition
      </button>

      {/* ── Filter logic ── */}
      {conditions.length > 1 && (
        <div style={{ marginTop: 4 }}>
          <label style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={editLogic}
              onChange={e => {
                setEditLogic(e.target.checked);
                if (!e.target.checked) {
                  const def = buildDefaultLogic(conditions);
                  setLocalLogic(def);
                  setLogicError('');
                }
              }}
              style={{ marginRight: 6 }}
            />
            Edit filter logic
          </label>

          {editLogic ? (
            <div style={{ marginTop: 8 }}>
              <input
                type="text"
                value={localLogic}
                onChange={e => handleLogicChange(e.target.value)}
                style={{
                  ...inputStyle,
                  width: '100%',
                  fontFamily: 'monospace',
                  border: logicError ? '1px solid #DE350B' : '1px solid #DFE1E6',
                  boxSizing: 'border-box',
                }}
                placeholder="e.g. 1 AND (2 OR 3)"
              />
              {logicError ? (
                <span style={{ fontSize: 11, color: '#DE350B', marginTop: 4, display: 'block' }}>
                  ⚠ {logicError}
                </span>
              ) : (
                <span style={{ fontSize: 11, color: '#6B778C', marginTop: 4, display: 'block' }}>
                  Use AND / OR and parentheses. e.g. 1 AND (2 OR 3)
                </span>
              )}
            </div>
          ) : (
            <div style={{ marginTop: 6, fontSize: 12, color: '#6B778C' }}>
              Logic: <code style={{ backgroundColor: '#F4F5F7', padding: '2px 6px', borderRadius: 3 }}>
                {localLogic}
              </code>
            </div>
          )}
        </div>
      )}

      {/* ── Apply button ── */}
      <button
        onClick={handleApply}
        disabled={conditions.some(c => !c.field) || !!logicError}
        style={{
          ...applyBtnStyle,
          marginTop: 8,
          opacity: (conditions.some(c => !c.field) || !!logicError) ? 0.5 : 1,
          cursor: (conditions.some(c => !c.field) || !!logicError) ? 'not-allowed' : 'pointer',
        }}
      >
        Apply Filters & Run
      </button>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const conditionRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  flexWrap: 'wrap',
};

const badgeStyle: React.CSSProperties = {
  minWidth: 22,
  height: 22,
  borderRadius: '50%',
  backgroundColor: '#DFE1E6',
  color: '#42526E',
  fontSize: 11,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

const selectStyle: React.CSSProperties = {
  padding: '6px 8px',
  border: '1px solid #DFE1E6',
  borderRadius: 4,
  fontSize: 12,
  color: '#172B4D',
  backgroundColor: 'white',
  outline: 'none',
  flex: 1,
  minWidth: 100,
};

const inputStyle: React.CSSProperties = {
  padding: '6px 8px',
  border: '1px solid #DFE1E6',
  borderRadius: 4,
  fontSize: 12,
  color: '#172B4D',
  backgroundColor: 'white',
  outline: 'none',
  flex: 1,
  minWidth: 80,
};

const removeBtnStyle: React.CSSProperties = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: '#DE350B',
  fontSize: 13,
  padding: '2px 4px',
  flexShrink: 0,
};

const addBtnStyle: React.CSSProperties = {
  padding: '7px 12px',
  backgroundColor: 'transparent',
  color: '#0052CC',
  border: '1px dashed #0052CC',
  borderRadius: 4,
  fontSize: 13,
  cursor: 'pointer',
  fontWeight: 500,
  textAlign: 'left',
};

const applyBtnStyle: React.CSSProperties = {
  padding: '8px 12px',
  backgroundColor: '#0052CC',
  color: 'white',
  border: 'none',
  borderRadius: 4,
  fontWeight: 600,
  fontSize: 13,
};

const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  fontSize: 12,
  color: '#42526E',
  cursor: 'pointer',
  userSelect: 'none',
};

const emptyStyle: React.CSSProperties = {
  padding: '16px',
  textAlign: 'center',
  color: '#6B778C',
  fontSize: 13,
  border: '1px dashed #DFE1E6',
  borderRadius: 4,
};

export default FilterBuilder;