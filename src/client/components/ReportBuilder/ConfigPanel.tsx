import React, {useState} from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export interface FilterConfig {
  project: string;
  type: string;
  state: string;
  selectedFields: string[];
  showChart: boolean;
  groupBy: string;
  chartType: 'donut' | 'bar' | 'line' | 'table';
  groupRowsBy: string;
  [key: string]: any;
}

export interface AvailableField {
  id: string;
  label: string;
}

interface ConfigPanelProps {
  filters: FilterConfig;
  setFilters: React.Dispatch<React.SetStateAction<FilterConfig>>;
  onRun: () => void;
  availableFields: AvailableField[];
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ filters, setFilters, onRun, availableFields }) => {
    const [activeTab, setActiveTab] = useState('outline');

  const handleOnDragEnd = (result: any) => {
    const { destination, source } = result;
    if (!destination || (destination.index === source.index && destination.droppableId === source.droppableId)) return;

    const items = Array.from(filters.selectedFields || []);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    setFilters({ ...filters, selectedFields: items });
  };

  const removeField = (fieldId: string) => {
    setFilters({ ...filters, selectedFields: filters.selectedFields.filter(f => f !== fieldId) });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getFieldLabel = (id: string) => availableFields.find(f => f.id === id)?.label || id;

  return (
    <div style={sidebarStyle}>
      {/* Tabs */}
      <div style={tabsContainerStyle}>
        {['Outline', 'Filters', 'Settings'].map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase() as 'outline' | 'filters' | 'settings')}
            style={{
              ...tabStyle,
              color: activeTab === tab.toLowerCase() ? '#0052cc' : '#42526E',
              borderBottom: activeTab === tab.toLowerCase() ? '2px solid #0052cc' : 'none',
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Outline Tab */}
        {activeTab === 'outline' && (
          <div style={{ padding: '15px' }}>
            <div style={sectionTitleStyle}>∨ GROUP ROWS</div>
            <div style={addPlaceholderStyle}>+ Add grouping field...</div>

            <div style={{ ...sectionTitleStyle, marginTop: '25px' }}>
              ∨ COLUMNS ({filters.selectedFields?.length || 0})
            </div>

            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="columns-list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {filters.selectedFields?.map((fieldId, index) => (
                      <Draggable key={fieldId} draggableId={fieldId} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...itemCardStyle,
                              ...provided.draggableProps.style,
                              backgroundColor: snapshot.isDragging ? '#E9F2FF' : 'white',
                              boxShadow: snapshot.isDragging ? '0 5px 10px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
                              border: snapshot.isDragging ? '1px solid #0052cc' : '1px solid #DFE1E6',
                              zIndex: snapshot.isDragging ? 9999 : 'auto',
                            }}
                          >
                            <div {...provided.dragHandleProps} style={handleStyle}>⋮⋮</div>
                            <span style={{ flex: 1, fontSize: 13, color: '#172B4D', fontWeight: 500 }}>
                              {getFieldLabel(fieldId)}
                            </span>
                            <button onClick={() => removeField(fieldId)} style={removeBtnStyle}>✕</button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

        {/* Filters Tab */}
        {activeTab === 'filters' && (
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Project</label>
              <input type="text" name="project" value={filters.project} onChange={handleFilterChange} style={inputStyle} />
            </div>
            <button onClick={onRun} style={runBtnStyle}>Apply Filters & Run</button>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div style={{ padding: 20, fontSize: 13 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 5 }}>REPORT INFO</div>
            <div style={{ marginBottom: 10 }}><strong>Project:</strong> {filters.project}</div>
            <div style={{ marginBottom: 10 }}><strong>Last Run:</strong> {new Date().toLocaleTimeString()}</div>
            <div style={{ fontWeight: 'bold', marginBottom: 5 }}>DESCRIPTION</div>
            <textarea style={{ width: '100%', height: 80, padding: 8, border: '1px solid #ddd', borderRadius: 4 }} placeholder="No description provided." />
          </div>
        )}
      </div>
    </div>
  );
};

/* --- Styles --- */
const sidebarStyle: React.CSSProperties = { width: 300, borderRight: '1px solid #DFE1E6', backgroundColor: 'white', display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0 };
const tabsContainerStyle: React.CSSProperties = { display: 'flex', borderBottom: '1px solid #DFE1E6', backgroundColor: '#FAFBFC' };
const tabStyle: React.CSSProperties = { flex: 1, textAlign: 'center', padding: '12px 0', cursor: 'pointer', fontSize: 13, fontWeight: 600 };
const sectionTitleStyle: React.CSSProperties = { fontSize: 11, fontWeight: 'bold', color: '#5E6C84', textTransform: 'uppercase', marginBottom: 10 };
const addPlaceholderStyle: React.CSSProperties = { padding: 8, border: '1px dashed #ccc', borderRadius: 4, color: '#0052cc', fontSize: 12, textAlign: 'center', cursor: 'pointer' };
const itemCardStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', borderRadius: 3, padding: '8px 10px', userSelect: 'none' };
const handleStyle: React.CSSProperties = { cursor: 'grab', color: '#B3BAC5', marginRight: 10, fontSize: 16 };
const removeBtnStyle: React.CSSProperties = { border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, color: '#BF2600' };
const formGroupStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 5 };
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#42526E' };
const inputStyle: React.CSSProperties = { padding: 8, border: '1px solid #DFE1E6', borderRadius: 3, fontSize: 13 };
const runBtnStyle: React.CSSProperties = { marginTop: 10, padding: 8, backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: 3, fontWeight: 'bold', cursor: 'pointer' };

export default ConfigPanel;