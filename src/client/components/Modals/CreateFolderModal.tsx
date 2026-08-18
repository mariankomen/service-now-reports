import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Folder } from '../../interfaces';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, parentId: string, description: string, isPublic: boolean) => void;
  folders: Folder[];
  initialValues?: {
    name: string;
    isPublic: boolean;
  };
  mode?: 'create' | 'edit';
}

const VISIBILITY_OPTIONS = [
  { label: 'Private', value: false },
  { label: 'Public',  value: true  },
];

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ isOpen, onClose, onCreate, initialValues, mode }) => {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [isPublic, setIsPublic] = useState(initialValues?.isPublic ?? false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name);
      setIsPublic(initialValues.isPublic);
    } else {
      setName('');
      setIsPublic(false);
    }
  }, [isOpen]);
  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = () => setDropdownOpen(false);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [dropdownOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(name, 'root', '', isPublic);
    setName('');
    setIsPublic(false);
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: 20, color: '#172B4D', fontWeight: 600 }}>
          {mode === 'edit' ? 'Edit Folder' : 'New Folder'}
        </h3>

        <form onSubmit={handleSubmit}>

          {/* ── Folder Name ── */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Folder Name</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
              style={inputStyle}
              placeholder="e.g. Sprint Reports"
            />
          </div>

          {/* ── Visibility custom dropdown ── */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Visibility</label>
            <div style={{ position: 'relative' }}>
              <div
                onClick={e => { e.stopPropagation(); setDropdownOpen(p => !p); }}
                style={{
                  ...inputStyle,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  userSelect: 'none',
                  border: dropdownOpen ? '1px solid #0052CC' : '1px solid #DFE1E6',
                }}
              >
                <span>{isPublic ? 'Public' : 'Private'}</span>
                <span style={{ fontSize: 12, color: '#42526E', transition: 'transform 0.15s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
              </div>

              {dropdownOpen && (
                <div style={dropdownStyle}>
                  {VISIBILITY_OPTIONS.map(opt => (
                    <div
                      key={opt.label}
                      onClick={e => { e.stopPropagation(); setIsPublic(opt.value); setDropdownOpen(false); }}
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
            Private folders are only visible to you. Public folders can be seen by all users.
          </p>

          {/* ── Actions ── */}
          <div style={actionsStyle}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" style={saveBtnStyle}>
              {mode === 'edit' ? 'Save' : 'Create'}
            </button>
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
  width: '30vw',
  maxWidth: '90vw',
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
  zIndex: 10,
  marginTop: 2,
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

export default CreateFolderModal;