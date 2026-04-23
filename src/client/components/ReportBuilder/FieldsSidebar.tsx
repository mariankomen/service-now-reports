import React, { useState } from 'react';

export type AvailableField = {
  id: string;
  label: string;
};

type FieldsSidebarProps = {
  availableFields: AvailableField[];
  selectedFields: string[];
  onToggleField: (fieldId: string) => void;
};

const FieldsSidebar: React.FC<FieldsSidebarProps> = ({ availableFields, selectedFields, onToggleField }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const filteredFields = availableFields.filter(f => 
    f.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={sidebarStyle}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={headerStyle}
      >
        <span style={{ fontWeight: '600', fontSize: '13px', color: '#42526E' }}>
          FIELDS ({availableFields.length})
        </span>
        <span style={{ fontSize: '10px', color: '#42526E' }}>
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {isExpanded && (
        <>
          <div style={{ padding: '10px', borderBottom: '1px solid #EBECF0' }}>
            <input 
              type="text" 
              placeholder="Search fields..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '5px 0' }}>
            {filteredFields.length > 0 ? (
              filteredFields.map(field => {
                const isSelected = selectedFields.includes(field.id);
                return (
                  <div 
                    key={field.id} 
                    onClick={() => onToggleField(field.id)}
                    style={{ 
                      ...rowStyle, 
                      backgroundColor: isSelected ? '#E9F2FF' : 'transparent',
                      color: isSelected ? '#0052cc' : '#172B4D'
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={isSelected} 
                      readOnly 
                      style={{ marginRight: '10px', cursor: 'pointer' }} 
                    />
                    <span style={labelStyle} title={field.id}>
                      {field.label}
                    </span>
                  </div>
                );
              })
            ) : (
              <div style={emptyTextStyle}>
                {availableFields.length === 0 
                  ? "No fields loaded. Run a preview to fetch data." 
                  : "No fields match your search."}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const sidebarStyle: React.CSSProperties = { 
  width: '260px', 
  borderRight: '1px solid #DFE1E6', 
  backgroundColor: '#FAFBFC', 
  display: 'flex', 
  flexDirection: 'column', 
  height: '100%', 
  flexShrink: 0 
};

const headerStyle: React.CSSProperties = { 
  padding: '12px 15px', 
  borderBottom: '1px solid #DFE1E6', 
  cursor: 'pointer', 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  backgroundColor: 'white' 
};

const searchInputStyle: React.CSSProperties = { 
  width: '100%', 
  padding: '6px 10px', 
  border: '1px solid #DFE1E6', 
  borderRadius: '3px', 
  fontSize: '13px', 
  boxSizing: 'border-box',
  outline: 'none'
};

const rowStyle: React.CSSProperties = { 
  padding: '8px 15px', 
  display: 'flex', 
  alignItems: 'center', 
  cursor: 'pointer', 
  fontSize: '13px',
  transition: 'background-color 0.1s ease'
};

const labelStyle: React.CSSProperties = { 
  whiteSpace: 'nowrap', 
  overflow: 'hidden', 
  textOverflow: 'ellipsis',
  userSelect: 'none'
};

const emptyTextStyle: React.CSSProperties = { 
  padding: '20px', 
  fontSize: '12px', 
  color: '#6B778C', 
  textAlign: 'center',
  lineHeight: '1.4'
};

export default FieldsSidebar;