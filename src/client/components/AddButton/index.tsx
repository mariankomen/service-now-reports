import { useState, useRef, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

interface AddButtonProps {
  onAddFolder: () => void;
  onAddReport: () => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onAddFolder, onAddReport}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
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
      {/* Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          width: 32,
          height: 32,
          borderRadius: '5px',
          border: 'none',
          background: 'rgb(45 47 49)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <AiOutlinePlus size={18} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 0,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: 6,
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            width: 150,
            zIndex: 100,
          }}
        >
          <div
            onClick={() => {
              setOpen(false);
              onAddFolder();
            }}
            style={{
              padding: '10px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
          >
            Add Folder
          </div>

          <div
            onClick={() => {
              setOpen(false);
              onAddReport();
            }}
            style={{
              padding: '10px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
          >
            Add Report
          </div>
        </div>
      )}
    </div>
  );
}

export default AddButton;