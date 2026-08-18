import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: 'report' | 'folder';
}

const CONTENT = {
  report: {
    title: 'Delete Report',
    message: 'Are you sure you want to delete this report? This action cannot be undone.',
  },
  folder: {
    title: 'Delete Folder',
    message: 'Are you sure you want to delete this folder? Reports in this folder will be moved to the root level.',
  },
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemType,
}) => {
  if (!isOpen) return null;

  const { title, message } = CONTENT[itemType];

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ color: '#CA3521', fontSize: 20, lineHeight: 1 }}>◈</span>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#172B4D' }}>
            {title}
          </h3>
        </div>

        {/* ── Message ── */}
        <p style={{ margin: '0 0 24px 0', fontSize: 14, color: '#42526E', lineHeight: 1.5 }}>
          {message}
        </p>

        {/* ── Actions ── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button type="button" onClick={onClose} style={cancelBtnStyle}>
            Cancel
          </button>
          <button type="button" onClick={() => { onConfirm(); onClose(); }} style={deleteBtnStyle}>
            Delete
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
  padding: '24px 28px',
  borderRadius: '4px',
  width: '520px',
  maxWidth: '90vw',
  boxShadow: '0 4px 24px rgba(9, 30, 66, 0.2)',
};

const cancelBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: 'transparent',
  color: '#42526E',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: 14,
};

const deleteBtnStyle: React.CSSProperties = {
  padding: '8px 16px',
  backgroundColor: '#CA3521',
  color: 'white',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 14,
};

export default ConfirmDeleteModal;