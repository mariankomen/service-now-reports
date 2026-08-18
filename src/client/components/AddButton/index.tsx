import { useState, useRef, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineFolder, AiOutlineFileText } from 'react-icons/ai';
import './style.css';
interface AddButtonProps {
  onAddFolder: () => void;
  onAddReport: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onAddFolder, onAddReport }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className='main-btn'
      >
        <AiOutlinePlus size={16} />
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #DFE1E6',
          borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          minWidth: 180,
          zIndex: 100,
          overflow: 'hidden',
          padding: '4px 0',
        }}>
          <div
            onClick={() => { setOpen(false); onAddFolder(); }}
            style={itemStyle}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F4F5F7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <AiOutlineFolder size={17} style={{ color: '#5E6C84', flexShrink: 0 }} />
            <span>New Folder</span>
          </div>

          <div
            onClick={() => { setOpen(false); onAddReport(); }}
            style={itemStyle}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F4F5F7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <AiOutlineFileText size={17} style={{ color: '#5E6C84', flexShrink: 0 }} />
            <span>New Report</span>
          </div>
        </div>
      )}
    </div>
  );
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 16px',
  cursor: 'pointer',
  fontSize: 14,
  color: '#172B4D',
  backgroundColor: 'transparent',
  whiteSpace: 'nowrap',
};

export default AddButton;