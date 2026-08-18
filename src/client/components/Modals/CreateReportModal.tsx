import React, { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { sobjectService } from '../../services';
import { tableService } from '../../services';

interface Folder {
  id: string;
  name: string;
}

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, folderId: string, description: string, salesforceObjectName: string, serviceNowTableName: string, isPublic: boolean) => void;
  folders: Folder[];
}

interface PicklistOption {
  label: string;
  apiname: string;
}

const VISIBILITY_OPTIONS = [
  { label: 'Private', value: false },
  { label: 'Public',  value: true  },
];

// ─── Reusable searchable dropdown ────────────────────────────────────────────

interface SearchableDropdownProps {
  options: PicklistOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({ options, value, onChange, placeholder }) => {
  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.apiname === value);
  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!open) { setSearch(''); return; }
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen(p => !p)}
        style={{
          ...inputStyle,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer', userSelect: 'none',
          border: open ? '1px solid #0052CC' : '1px solid #DFE1E6',
          color: selected ? '#172B4D' : '#8993A4',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
          {selected ? selected.label : placeholder ?? 'Select...'}
        </span>
        <span style={{
          fontSize: 12, color: '#42526E', marginLeft: 8, flexShrink: 0,
          transition: 'transform 0.15s',
          transform: open ? 'rotate(180deg)' : 'none',
        }}>▾</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div style={dropdownStyle}>
          {/* Search input */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid #EBECF0' }}>
            <input
              autoFocus
              value={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                width: '100%', padding: '6px 10px', fontSize: 13,
                border: '1px solid #DFE1E6', borderRadius: 3,
                outline: 'none', boxSizing: 'border-box',
              }}
              onClick={e => e.stopPropagation()}
            />
          </div>

          {/* Options */}
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '10px 14px', fontSize: 13, color: '#6B778C' }}>No results</div>
            ) : filtered.map(opt => (
              <div
                key={opt.apiname}
                onClick={() => { onChange(opt.apiname); setOpen(false); }}
                style={{
                  ...dropdownItemStyle,
                  backgroundColor: value === opt.apiname ? '#E9F2FF' : 'white',
                  color: value === opt.apiname ? '#0052CC' : '#172B4D',
                  fontWeight: value === opt.apiname ? 500 : 400,
                }}
                onMouseEnter={e => {
                  if (value !== opt.apiname)
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#F4F5F7';
                }}
                onMouseLeave={e => {
                  if (value !== opt.apiname)
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main modal ───────────────────────────────────────────────────────────────

const CreateReportModal: React.FC<CreateReportModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [error, setError]                       = useState('');
  const [name, setName]                         = useState('');
  const [description, setDescription]           = useState('');
  const [salesforceObjectName, setSFObject]     = useState('');
  const [serviceNowTableName, setSNTable]       = useState('');
  const [isPublic, setIsPublic]                 = useState(false);
  const [visibilityOpen, setVisibilityOpen]     = useState(false);
  const [salesforceSobjects, setSFObjects]      = useState<PicklistOption[]>([]);
  const [serviceNowTables, setSNTables]         = useState<PicklistOption[]>([]);
  const visibilityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getSalesforceObjects = async () => {
      try {
        const sobjects = await sobjectService.getAllSobjects();
        setSFObjects(sobjects.map(el => ({ label: `${el.label} (${el.apiname})`, apiname: el.apiname })));
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    };
    const getServiceNowTables = async () => {
      try {
        const tables = await tableService.getAllTables();
        setSNTables(tables.map(el => ({ label: `${el.label} (${el.name})`, apiname: el.name })));
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    };
    getSalesforceObjects();
    getServiceNowTables();
  }, []);

  // Close visibility dropdown on outside click
  useEffect(() => {
    if (!visibilityOpen) return;
    const handler = (e: MouseEvent) => {
      if (visibilityRef.current && !visibilityRef.current.contains(e.target as Node))
        setVisibilityOpen(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [visibilityOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(name, 'root', description, salesforceObjectName, serviceNowTableName, isPublic);
    setName('');
    setDescription('');
    setSFObject('');
    setSNTable('');
    setIsPublic(false);
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: 20, color: '#172B4D', fontWeight: 600 }}>
          New Report
        </h3>

        {error && (
          <div style={{ marginBottom: 16, padding: '10px 12px', backgroundColor: '#FFEBE6', borderRadius: 4, fontSize: 13, color: '#DE350B' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ── Report Name ── */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Report Name</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
              style={inputStyle}
              placeholder="e.g. Bugs by Priority"
            />
          </div>

          {/* ── Description ── */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              style={{ ...inputStyle, height: 80, resize: 'vertical', fontFamily: 'sans-serif' }}
              placeholder="Optional description"
            />
          </div>

          {/* ── Salesforce Object ── */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Salesforce Object</label>
            <SearchableDropdown
              options={salesforceSobjects}
              value={salesforceObjectName}
              onChange={setSFObject}
              placeholder="Select Salesforce object..."
            />
          </div>

          {/* ── ServiceNow Table ── */}
          <div style={fieldStyle}>
            <label style={labelStyle}>ServiceNow Table</label>
            <SearchableDropdown
              options={serviceNowTables}
              value={serviceNowTableName}
              onChange={setSNTable}
              placeholder="Select ServiceNow table..."
            />
          </div>

          {/* ── Visibility ── */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Visibility</label>
            <div ref={visibilityRef} style={{ position: 'relative' }}>
              <div
                onClick={() => setVisibilityOpen(p => !p)}
                style={{
                  ...inputStyle,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer', userSelect: 'none',
                  border: visibilityOpen ? '1px solid #0052CC' : '1px solid #DFE1E6',
                }}
              >
                <span>{isPublic ? 'Public' : 'Private'}</span>
                <span style={{
                  fontSize: 12, color: '#42526E',
                  transition: 'transform 0.15s',
                  transform: visibilityOpen ? 'rotate(180deg)' : 'none',
                }}>▾</span>
              </div>

              {visibilityOpen && (
                <div style={dropdownStyle}>
                  {VISIBILITY_OPTIONS.map(opt => (
                    <div
                      key={opt.label}
                      onClick={() => { setIsPublic(opt.value); setVisibilityOpen(false); }}
                      style={{
                        ...dropdownItemStyle,
                        backgroundColor: isPublic === opt.value ? '#E9F2FF' : 'white',
                        color: isPublic === opt.value ? '#0052CC' : '#172B4D',
                        fontWeight: isPublic === opt.value ? 500 : 400,
                      }}
                      onMouseEnter={e => {
                        if (isPublic !== opt.value)
                          (e.currentTarget as HTMLElement).style.backgroundColor = '#F4F5F7';
                      }}
                      onMouseLeave={e => {
                        if (isPublic !== opt.value)
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Hint ── */}
          <p style={hintStyle}>
            Private reports are only visible to you. Public reports can be seen by all users.
          </p>

          {/* ── Actions ── */}
          <div style={actionsStyle}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" style={saveBtnStyle}>Create & Configure</button>
          </div>

        </form>
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const overlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(9, 30, 66, 0.4)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '24px',
  borderRadius: '4px',
  width: '480px',
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 4px 24px rgba(9, 30, 66, 0.2)',
};

const fieldStyle: React.CSSProperties = { marginBottom: 18 };

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13,
  fontWeight: 600, color: '#172B4D', marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  borderRadius: 4, border: '1px solid #DFE1E6',
  backgroundColor: '#fff', fontSize: 14,
  boxSizing: 'border-box', color: '#172B4D',
  outline: 'none',
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute', top: '100%', left: 0, right: 0,
  backgroundColor: 'white',
  border: '1px solid #DFE1E6',
  borderRadius: 4,
  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  zIndex: 10, marginTop: 2,
  overflow: 'hidden',
};

const dropdownItemStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: 14,
  cursor: 'pointer',
};

const hintStyle: React.CSSProperties = {
  fontSize: 12, color: '#6B778C',
  margin: '0 0 24px 0', lineHeight: 1.5,
};

const actionsStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'flex-end', gap: 8,
};

const saveBtnStyle: React.CSSProperties = {
  padding: '8px 16px', backgroundColor: '#0052CC',
  color: 'white', border: 'none', borderRadius: 4,
  cursor: 'pointer', fontWeight: 600, fontSize: 14,
};

const cancelBtnStyle: React.CSSProperties = {
  padding: '8px 16px', backgroundColor: 'transparent',
  color: '#42526E', border: 'none', borderRadius: 4,
  cursor: 'pointer', fontWeight: 500, fontSize: 14,
};

export default CreateReportModal;