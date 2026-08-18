import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineDownload, AiOutlineFileExcel, AiOutlineFilePdf, AiOutlineFileText } from 'react-icons/ai';

interface ExportButtonProps {
  onExportCSV: () => void;
  onExportXLSX: () => void;
  onExportPDF: () => void;
  disabled?: boolean;
}

const EXPORT_OPTIONS = [
  { id: 'csv',  label: 'Export as CSV',  icon: <AiOutlineFileText size={16} />,  color: '#172B4D' },
  { id: 'xlsx', label: 'Export as Excel', icon: <AiOutlineFileExcel size={16} />, color: '#172B4D' },
  { id: 'pdf',  label: 'Export as PDF',  icon: <AiOutlineFilePdf size={16} />,   color: '#172B4D' },
];

const ExportButton: React.FC<ExportButtonProps> = ({
  onExportCSV,
  onExportXLSX,
  onExportPDF,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [open]);

  const handlers: Record<string, () => void> = {
    csv:  onExportCSV,
    xlsx: onExportXLSX,
    pdf:  onExportPDF,
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => !disabled && setOpen(p => !p)}
        disabled={disabled}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          backgroundColor: 'white',
          color: disabled ? '#A5ADBA' : '#42526E',
          border: '1px solid #DFE1E6',
          borderRadius: '3px',
          padding: '6px 12px',
          fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: '13px',
        }}
        title="Export"
      >
        <AiOutlineDownload size={15} />
        Export
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #DFE1E6',
          borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: 180,
          zIndex: 100,
          overflow: 'hidden',
          padding: '4px 0',
        }}>
          {EXPORT_OPTIONS.map(opt => (
            <div
              key={opt.id}
              onClick={() => { handlers[opt.id](); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                fontSize: 13,
                color: opt.color,
                cursor: 'pointer',
                backgroundColor: 'transparent',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F4F5F7')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {opt.icon}
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExportButton;