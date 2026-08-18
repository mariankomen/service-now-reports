import React, { useState, useEffect, useRef } from 'react';
import type { Folder } from '../../interfaces';
import folderService from '../../services/ServiceNow/folder-service';

interface MoveToFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (folderId: string) => void;
  reportName: string;
}

const ROOT_OPTION = { id: 'root', name: 'No Folder (Root)' };

const MoveToFolderModal: React.FC<MoveToFolderModalProps> = ({
  isOpen,
  onClose,
  onMove,
  reportName,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<{ id: string; name: string }>(ROOT_OPTION);
  const [folders, setFolders]               = useState<Folder[]>([]);
  const [loading, setLoading]               = useState(false);
  const [dropdownOpen, setDropdownOpen]     = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load folders on open
  useEffect(() => {
    if (!isOpen) { setSelectedFolder(ROOT_OPTION); return; }
    const load = async () => {
      setLoading(true);
      try {
        const data = await folderService.getAll();
        setFolders(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  if (!isOpen) return null;

  const allOptions = [ROOT_OPTION, ...folders.map(f => ({ id: f.id, name: f.name }))];

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* ── Header ── */}
        <h3 style={{ margin: '0 0 8px 0', fontSize: 20, color: '#172B4D', fontWeight: 600 }}>
          Move Report to Folder
        </h3>
        <p style={{ fontSize: 13, color: '#6B778C', margin: '0 0 24px 0' }}>
          Select a folder to move <strong style={{ color: '#172B4D' }}>{reportName}</strong> to:
        </p>

        {/* ── Folder dropdown ── */}
        <div style={{ marginBottom: 28 }}>
          <label style={labelStyle}>Destination Folder</label>
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            {/* Trigger */}
            <div
              onClick={() => !loading && setDropdownOpen(p => !p)}
              style={{
                ...inputStyle,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: loading ? 'not-allowed' : 'pointer',
                userSelect: 'none',
                border: dropdownOpen ? '2px solid #0052CC' : '1px solid #DFE1E6',
                color: '#172B4D',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <span>{loading ? 'Loading folders...' : selectedFolder.name}</span>
              <span style={{
                fontSize: 12, color: '#42526E',
                transition: 'transform 0.15s',
                transform: dropdownOpen ? 'rotate(180deg)' : 'none',
              }}>▾</span>
            </div>

            {/* Dropdown options */}
            {dropdownOpen && (
              <div style={dropdownStyle}>
                {allOptions.map(opt => (
                  <div
                    key={opt.id}
                    onClick={() => { setSelectedFolder(opt); setDropdownOpen(false); }}
                    style={{
                      ...optionStyle,
                      backgroundColor: selectedFolder.id === opt.id ? '#E9F2FF' : 'white',
                      color: selectedFolder.id === opt.id ? '#0052CC' : '#172B4D',
                      fontWeight: selectedFolder.id === opt.id ? 500 : 400,
                    }}
                    onMouseEnter={e => {
                      if (selectedFolder.id !== opt.id)
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#F4F5F7';
                    }}
                    onMouseLeave={e => {
                      if (selectedFolder.id !== opt.id)
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                    }}
                  >
                    {opt.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Actions ── */}
        <div style={actionsStyle}>
          <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button
            type="button"
            onClick={() => { onMove(selectedFolder.id); onClose(); }}
            style={saveBtnStyle}
          >
            Move
          </button>
        </div>
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
  fontFamily: 'sans-serif',
  padding: '32px',
  borderRadius: '4px',
  width: '520px',
  maxWidth: '90vw',
  boxShadow: '0 4px 24px rgba(9, 30, 66, 0.2)',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13,
  fontWeight: 600, color: '#172B4D', marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  borderRadius: 4, border: '1px solid #DFE1E6',
  backgroundColor: '#fff', fontSize: 14,
  boxSizing: 'border-box', outline: 'none',
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute', top: '100%', left: 0, right: 0,
  backgroundColor: 'white',
  border: '1px solid #DFE1E6',
  borderRadius: 4,
  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  zIndex: 10, marginTop: 2,
  overflow: 'hidden',
  maxHeight: 220,
  overflowY: 'auto',
};

const optionStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: 14,
  cursor: 'pointer',
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

export default MoveToFolderModal;