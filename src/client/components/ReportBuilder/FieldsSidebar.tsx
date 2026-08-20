import React, { useState } from 'react';
import {
  AiOutlineCaretDown,
  AiOutlineCaretRight,
  AiOutlineClose,
  AiOutlineCloud,
  AiOutlineDatabase,
  AiOutlinePartition,
  AiOutlineSearch,
  AiOutlineMenu,
} from 'react-icons/ai';
import { sobjectService } from '../../services/Salesforce';
import type { SalesforceSObjectField } from '../../services/Salesforce/sobject-service';
import { errorToast } from '../../utils/toast';

export type AvailableField = {
  id: string;
  label: string;
  type?: string;
  referenceTo?: string[];
  relationshipName?: string | null;
};

type RefFieldsState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'loaded'; byObject: Record<string, SalesforceSObjectField[]> };

type FieldsSidebarProps = {
  availableFields: AvailableField[];
  selectedFields: string[];
  onToggleField: (fieldId: string) => void;
  onLookupFieldsLoaded?: (fields: AvailableField[]) => void;
};

const FieldsSidebar: React.FC<FieldsSidebarProps> = ({ availableFields, selectedFields, onToggleField, onLookupFieldsLoaded }) => {
  const [searchTerm, setSearchTerm]             = useState('');
  const [isExpanded, setIsExpanded]             = useState(true);
  const [expandedSections, setExpandedSections] = useState({ 'Salesforce Fields': true, 'ServiceNow Fields': true });
  const [expandedRefs, setExpandedRefs]         = useState<Set<string>>(new Set());
  const [expandedRefObjects, setExpandedRefObjects] = useState<Set<string>>(new Set());
  const [refFields, setRefFields]               = useState<Record<string, RefFieldsState>>({});
  const [hoveredField, setHoveredField]         = useState<string | null>(null);
  const [closeHovered, setCloseHovered]         = useState(false);

  // ─── Load reference fields ────────────────────────────────────────────────
  const loadRefFields = async (field: AvailableField) => {
    const objects = field.referenceTo ?? [];
    if (!objects.length) return;
    setRefFields(prev => ({ ...prev, [field.id]: { status: 'loading' } }));
    try {
      const results = await Promise.all(
        objects.map(async obj => ({ obj, fields: await sobjectService.getSObjectFields(obj) }))
      );
      const byObject: Record<string, SalesforceSObjectField[]> = {};
      for (const { obj, fields } of results) {
        byObject[obj] = fields;
        if (obj === objects[0]) setExpandedRefObjects(prev => new Set(prev).add(`${field.id}::${obj}`));
      }
      setRefFields(prev => ({ ...prev, [field.id]: { status: 'loaded', byObject } }));

      // ─── Report child field labels up as "[object label]: [field label]" ──
      if (onLookupFieldsLoaded) {
        const relationshipName = field.relationshipName!;
        const entries: AvailableField[] = [];
        for (const { obj, fields } of results) {
          const objLabel = await sobjectService.getObjectLabel(obj);
          for (const childField of fields) {
            entries.push({
              id: `SF.${relationshipName}.${childField.apiname}`,
              label: `${objLabel}: ${childField.label}`,
              type: childField.type,
            });
          }
        }
        onLookupFieldsLoaded(entries);
      }
    } catch (e: any) {
      setRefFields(prev => ({ ...prev, [field.id]: { status: 'error', message: e.message ?? 'Failed to load' } }));
      errorToast(e?.message || 'Failed to load reference fields.');
    }
  };

  const toggleSection = (label: string) =>
    setExpandedSections(prev => ({ ...prev, [label]: !prev[label as keyof typeof prev] }));

  const toggleRef = (field: AvailableField, e: React.MouseEvent) => {
    e.stopPropagation();
    const isOpen = expandedRefs.has(field.id);
    setExpandedRefs(prev => {
      const next = new Set(prev);
      isOpen ? next.delete(field.id) : next.add(field.id);
      return next;
    });
    if (!isOpen && !refFields[field.id]) loadRefFields(field);
  };

  const toggleRefObject = (fieldId: string, obj: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const key = `${fieldId}::${obj}`;
    setExpandedRefObjects(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const isReference = (field: AvailableField) =>
    field.type === 'reference' && (field.referenceTo?.length ?? 0) > 0 && !!field.relationshipName;

  // ─── Render child fields ──────────────────────────────────────────────────
  const renderChildFields = (parentField: AvailableField) => {
    const state = refFields[parentField.id];
    const relationshipName = parentField.relationshipName!;

    if (!state || state.status === 'idle') return null;
    if (state.status === 'loading') return <div style={statusStyle}><span style={{ color: '#6B778C' }}>Loading…</span></div>;
    if (state.status === 'error')   return <div style={statusStyle}><span style={{ color: '#DE350B' }}>⚠ {state.message}</span></div>;

    return (
      <>
        {Object.entries(state.byObject).map(([obj, fields]) => {
          const objKey = `${parentField.id}::${obj}`;
          const isObjExpanded = expandedRefObjects.has(objKey);
          return (
            <div key={obj}>
              <div style={refObjectHeaderStyle} onClick={e => toggleRefObject(parentField.id, obj, e)}>
                <AiOutlineDatabase size={13} style={{ flexShrink: 0, color: '#5E6C84' }} />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{obj}</span>
                <span style={{ fontSize: 10, color: '#6B778C', marginRight: 4 }}>({fields.length})</span>
                {isObjExpanded ? <AiOutlineCaretDown size={10} /> : <AiOutlineCaretRight size={10} />}
              </div>
              {isObjExpanded && fields.map(childField => {
                const childId = `SF.${relationshipName}.${childField.apiname}`;
                const isSelected = selectedFields.includes(childId);
                return (
                  <div
                    key={childId}
                    onClick={() => onToggleField(childId)}
                    style={{
                      ...childRowStyle,
                      backgroundColor: isSelected ? '#E9F2FF' : 'transparent',
                      color: isSelected ? '#0052cc' : '#172B4D',
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = '#F4F5F7'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = isSelected ? '#E9F2FF' : 'transparent'; }}
                  >
                    <span style={{ color: '#C1C7D0', marginRight: 6, fontSize: 11 }}>└</span>
                    <input type="checkbox" checked={isSelected} readOnly style={{ marginRight: 8, cursor: 'pointer', flexShrink: 0, accentColor: '#0052CC' }} />
                    <span style={labelStyle}>{childField.label}</span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </>
    );
  };

  // ─── Render single field row ──────────────────────────────────────────────
  const renderField = (field: AvailableField) => {
    const isSelected    = selectedFields.includes(field.id);
    const isRef         = isReference(field);
    const isRefExpanded = expandedRefs.has(field.id);
    const isHovered     = hoveredField === field.id;

    return (
      <div key={field.id}>
        <div
          onClick={() => onToggleField(field.id)}
          onMouseEnter={() => setHoveredField(field.id)}
          onMouseLeave={() => setHoveredField(null)}
          style={{
            ...rowStyle,
            backgroundColor: isSelected ? '#E9F2FF' : isHovered ? '#F4F5F7' : 'transparent',
            color: isSelected ? '#0052CC' : '#172B4D',
            borderLeft: isSelected ? '3px solid #0052CC' : '3px solid transparent',
          }}
        >
          <input
            type="checkbox"
            checked={isSelected}
            readOnly
            style={{ marginRight: 8, cursor: 'pointer', flexShrink: 0, accentColor: '#0052CC' }}
          />
          <span style={labelStyle} title={field.id}>{field.label}</span>

          {isRef && (
            <span
              onClick={e => toggleRef(field, e)}
              title={`Lookup → ${field.referenceTo?.join(', ')}`}
              style={{
                display: 'flex', alignItems: 'center', flexShrink: 0, marginLeft: 4,
                cursor: 'pointer', padding: '2px 4px', borderRadius: 3,
                color: isRefExpanded ? '#0052cc' : '#8993A4',
                backgroundColor: isRefExpanded ? '#DEEBFF' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              <AiOutlinePartition size={12} style={{ display: 'block' }} />
              <span style={{ marginLeft: 2, fontSize: 9 }}>{isRefExpanded ? '▾' : '▸'}</span>
            </span>
          )}
        </div>

        {isRef && isRefExpanded && (
          <div style={{ borderLeft: '2px solid #DFE1E6', marginLeft: 24, marginBottom: 4 }}>
            {renderChildFields(field)}
          </div>
        )}
      </div>
    );
  };

  const fieldsList = [
    {
      sectionLabel: 'Salesforce Fields',
      fields: availableFields.filter(f => f.id.startsWith('SF.')).filter(f => f.label.toLowerCase().includes(searchTerm.toLowerCase())),
      isExpanded: expandedSections['Salesforce Fields'],
    },
    {
      sectionLabel: 'ServiceNow Fields',
      fields: availableFields.filter(f => f.id.startsWith('SN.')).filter(f => f.label.toLowerCase().includes(searchTerm.toLowerCase())),
      isExpanded: expandedSections['ServiceNow Fields'],
    },
  ];

  // ─── Collapsed tab ────────────────────────────────────────────────────────
  if (!isExpanded) {
    return (
      <div
        onClick={() => setIsExpanded(true)}
        title="Show Fields"
        style={{
          width: 28,
          flexShrink: 0,
          borderRight: '1px solid #DFE1E6',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 12,
          cursor: 'pointer',
          gap: 8,
        }}
      >
        <span style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontSize: 11,
          fontWeight: 600,
          color: '#42526E',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          userSelect: 'none',
        }}>
          Fields
        </span>
        <AiOutlineMenu size={13} style={{ color: '#8993A4' }} />
      </div>
    );
  }

  // ─── Expanded sidebar ─────────────────────────────────────────────────────
  return (
    <div style={sidebarStyle}>
      {/* ── Header ── */}
      <div style={headerStyle}>
        <span style={{ fontWeight: 600, fontSize: 12, color: '#42526E', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Fields <span style={{ color: '#8993A4', fontWeight: 400 }}>({availableFields.length})</span>
        </span>
        <button
          onClick={() => setIsExpanded(false)}
          title="Hide Fields"
          onMouseEnter={() => setCloseHovered(true)}
          onMouseLeave={() => setCloseHovered(false)}
          style={{
            border: 'none', background: 'none', cursor: 'pointer',
            color: closeHovered ? '#172B4D' : '#8993A4',
            display: 'flex', alignItems: 'center',
            padding: '2px', borderRadius: 3, transition: 'color 0.15s',
          }}
        >
          <AiOutlineClose size={14} />
        </button>
      </div>

      {/* ── Search ── */}
      <div style={{ padding: '8px 10px', borderBottom: '1px solid #EBECF0', position: 'relative' }}>
        <AiOutlineSearch size={13} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#8993A4', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Search fields..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ ...searchInputStyle, paddingLeft: 28 }}
        />
      </div>

      {/* ── Sections ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {fieldsList.map(section => (
          <div key={section.sectionLabel}>
            {/* ── Section header ── */}
            <div style={sectionStyle} onClick={() => toggleSection(section.sectionLabel)}>
              {/* ── Caret before label ── */}
              <span style={{ color: '#8993A4', display: 'flex', alignItems: 'center', marginRight: 6 }}>
                {section.isExpanded ? <AiOutlineCaretDown size={12} /> : <AiOutlineCaretRight size={12} />}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#42526E', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                {section.sectionLabel}
              </span>
              <span style={{ fontSize: 10, color: '#8993A4', marginLeft: 6 }}>({section.fields.length})</span>
            </div>

            {/* ── Fields with transition ── */}
            <div style={{
              maxHeight: section.isExpanded ? '2000px' : '0px',
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
            }}>
              {section.fields.length === 0 ? (
                <div style={{ padding: '8px 15px', fontSize: 12, color: '#8993A4', fontStyle: 'italic' }}>No fields found</div>
              ) : (
                section.fields.map(renderField)
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const sidebarStyle: React.CSSProperties = {
  width: 260,
  borderRight: '1px solid #DFE1E6',
  backgroundColor: '#fff',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  flexShrink: 0,
};

const headerStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid #DFE1E6',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#fff',
};

const searchInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 10px',
  border: '1px solid #DFE1E6',
  borderRadius: 4,
  fontSize: 12,
  boxSizing: 'border-box',
  outline: 'none',
  backgroundColor: '#fff',
  color: '#172B4D',
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 10px 6px',
  cursor: 'pointer',
  userSelect: 'none',
  borderBottom: '1px solid #EBECF0',
  backgroundColor: '#F4F5F7',
};

const rowStyle: React.CSSProperties = {
  padding: '6px 12px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  fontSize: 12,
  transition: 'background-color 0.1s, border-left-color 0.1s',
};

const labelStyle: React.CSSProperties = {
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  userSelect: 'none',
};

const refObjectHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  padding: '5px 10px 5px 8px',
  fontSize: 11,
  fontWeight: 600,
  color: '#42526E',
  backgroundColor: '#F4F5F7',
  cursor: 'pointer',
  userSelect: 'none',
  borderBottom: '1px solid #EBECF0',
};

const childRowStyle: React.CSSProperties = {
  padding: '5px 10px 5px 8px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  fontSize: 12,
  transition: 'background-color 0.1s',
  borderBottom: '1px solid #F4F5F7',
};

const statusStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: 11,
};

export default FieldsSidebar;