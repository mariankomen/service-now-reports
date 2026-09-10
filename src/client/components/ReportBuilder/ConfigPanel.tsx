import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { type FilterConfig, type AvailableField } from './ReportBuilder';
import { FilterCondition, buildEncodedQuery, getOperatorsForType } from '../../utils/filterBuilder';
import FilterBuilder from '../FilterBuilder/FilterBuilder';
import { validateFilterQuery } from '../../utils/validateFilterQuery';
import {
  AiOutlineFileText,
  AiOutlineLink,
  AiOutlineBarChart,
  AiOutlineEdit,
  AiOutlineSetting,
  AiOutlineEye,
} from 'react-icons/ai';

interface ConfigPanelProps {
  filters: FilterConfig;
  setFilters: React.Dispatch<React.SetStateAction<FilterConfig>>;
  onRun: (patch?: Partial<FilterConfig>) => void;
  availableFields: AvailableField[];
  rawData?: any[];        // ← for live statistics
  totalRecords?: number;  // ← full record count from the server (ignores the SF-only toggle)
  reportMeta?: {          // ← extra info from report record
    createdDate?: string;
    owner?: string;
    description?: string;
  };
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  filters, setFilters, onRun, availableFields, rawData = [], totalRecords, reportMeta = {}
}) => {
  const [activeTab, setActiveTab] = useState('outline');
  const groupBy = filters.groupBy ?? [];

  const availableGroupBy = useMemo(() =>
    filters.selectedFields.filter(field => !groupBy.includes(field)),
    [filters.selectedFields, groupBy]
  );

  // ─── Live stats ───────────────────────────────────────────────────────────
  // Total comes from the server (full count), so the numbers stay the same
  // whether or not "Show only records with Salesforce data" is enabled
  const stats = useMemo(() => {
    const total    = totalRecords ?? rawData.length;
    const linked   = rawData.filter(r => Object.keys(r).some(k => k.startsWith('SF.') && r[k] != null && r[k] !== '-')).length;
    const unlinked = Math.max(total - linked, 0);
    return { total, linked, unlinked };
  }, [rawData, totalRecords]);

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleAddGroupBy = (field: string) => {
    setFilters(prev => ({ ...prev, groupBy: [...groupBy, field] }));
  };

  const handleRemoveGroupBy = (field: string) => {
    setFilters(prev => ({ ...prev, groupBy: groupBy.filter(f => f !== field) }));
  };

  const handleGroupDragEnd = (result: any) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) return;
    const items = Array.from(groupBy);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    setFilters(prev => ({ ...prev, groupBy: items }));
  };

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

  const getFieldLabel = (id: string) => availableFields.find(f => f.id === id)?.label || id;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={sidebarStyle}>
      {/* ── Tabs ── */}
      <div style={tabsContainerStyle}>
        {['Outline', 'Filters', 'Settings'].map(tab => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{
              ...tabStyle,
              color: activeTab === tab.toLowerCase() ? '#0052cc' : '#42526E',
              borderBottom: activeTab === tab.toLowerCase() ? '2px solid #0052cc' : '2px solid transparent',
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>

        {/* ── Outline Tab ── */}
        {activeTab === 'outline' && (
          <div style={{ padding: '15px' }}>
            <div style={sectionTitleStyle}>∨ GROUP ROWS</div>
            <div>
              <select
                onChange={e => handleAddGroupBy(e.target.value)}
                style={{ ...itemCardStyle, width: '100%', backgroundColor: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #DFE1E6', zIndex: 'auto' }}
                value=""
              >
                <option value="" disabled>+ Add grouping field...</option>
                {availableGroupBy.map(f => (
                  <option key={f} value={f}>{getFieldLabel(f)}</option>
                ))}
              </select>

              <DragDropContext onDragEnd={handleGroupDragEnd}>
                <Droppable droppableId="groupby-list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 5 }}>
                      {groupBy.map((f, index) => (
                        <Draggable key={f} draggableId={`group-${f}`} index={index}>
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
                                justifyContent: 'space-between',
                                fontSize: '13px',
                              }}
                            >
                              <div {...provided.dragHandleProps} style={handleStyle}>⋮⋮</div>
                              <span style={{ flex: 1, fontSize: 13, color: '#172B4D', fontWeight: 500 }}>{getFieldLabel(f)}</span>
                              <button onClick={() => handleRemoveGroupBy(f)} style={removeBtnStyle}>✕</button>
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
                            <span style={{ flex: 1, fontSize: 13, color: '#172B4D', fontWeight: 500 }}>{getFieldLabel(fieldId)}</span>
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

        {/* ── Filters Tab ── */}
        {activeTab === 'filters' && (
          <div style={{ padding: 15, display: 'flex', flexDirection: 'column', gap: 15 }}>
            <FilterBuilder
              conditions={filters.filterConditions ?? []}
              logic={filters.filterLogic ?? ''}
              availableFields={availableFields}
              onApply={(conditions, logic, encodedQuery) => {
                const patch = {
                  filterConditions: conditions,
                  filterLogic: logic,
                  filterQuery: encodedQuery,
                };
                setFilters(prev => ({ ...prev, ...patch }));
                onRun(patch);
              }}
            />
            <div style={{ borderTop: '1px solid #DFE1E6', paddingTop: 12 }}>
              <label style={labelStyle}>Show only records with Salesforce records</label>
              <input
                type="checkbox"
                checked={filters.showOnlyRecordsWithSalesforce}
                onChange={e => setFilters(prev => ({ ...prev, showOnlyRecordsWithSalesforce: e.target.checked }))}
              />
            </div>
          </div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === 'settings' && (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Report Info ── */}
            <div>
              <div style={sectionTitleStyle}>
                <AiOutlineFileText size={12} style={{ marginRight: 5 }} /> REPORT INFO
              </div>
              <div style={infoCard}>
                <InfoRow label="Report Name" value={filters.name || '—'} />
                <InfoRow label="Created"     value={reportMeta.createdDate ? new Date(reportMeta.createdDate).toLocaleDateString() : '—'} />
                <InfoRow label="Owner"       value={reportMeta.owner || '—'} />
              </div>
            </div>

            {/* ── Data Sources ── */}
            <div>
              <div style={sectionTitleStyle}>
                <AiOutlineLink size={12} style={{ marginRight: 5 }} /> DATA SOURCES
              </div>
              <div style={infoCard}>
                <InfoRow label="Salesforce Object" value={filters.sfObjectName || '—'} badge={{ color: '#00A1E0', bg: '#E6F6FD' }} />
                <InfoRow label="ServiceNow Table"  value={filters.snObjectName || '—'} badge={{ color: '#62B136', bg: '#EBF5E1' }} />
                <InfoRow label="Selected Fields"   value={String(filters.selectedFields?.length || 0)} />
                <InfoRow label="Active Filters"    value={String(filters.filterConditions?.length || 0)} />
                <InfoRow label="Grouped By"        value={String(filters.groupBy?.length || 0) + (filters.groupBy?.length ? ` (${filters.groupBy.map(f => getFieldLabel(f)).join(', ')})` : '')} />
              </div>
            </div>

            {/* ── Live Statistics ── */}
            {rawData.length > 0 && (
              <div>
                <div style={sectionTitleStyle}>
                  <AiOutlineBarChart size={12} style={{ marginRight: 5 }} /> CURRENT RESULTS
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <StatCard label="Total"    value={stats.total}    color="#0052CC" bg="#E9F2FF" />
                  <StatCard label="Linked"   value={stats.linked}   color="#006644" bg="#E3FCEF" />
                  <StatCard label="Unlinked" value={stats.unlinked} color="#42526E" bg="#F4F5F7" />
                </div>
              </div>
            )}

            {/* ── Description ── */}
            <div>
              <div style={sectionTitleStyle}>
                <AiOutlineEdit size={12} style={{ marginRight: 5 }} /> DESCRIPTION
              </div>
              <textarea
                value={filters.description || ''}
                onChange={e => setFilters(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add a description for this report..."
                style={{
                  width: '100%', height: 100, padding: 10,
                  border: '1px solid #DFE1E6', borderRadius: 4,
                  fontSize: 12, color: '#172B4D', resize: 'vertical',
                  boxSizing: 'border-box', outline: 'none',
                  fontFamily: 'inherit', lineHeight: 1.5,
                }}
              />
            </div>

            {/* ── Visibility ── */}
            <div>
              <div style={sectionTitleStyle}>
                <AiOutlineEye size={12} style={{ marginRight: 5 }} /> VISIBILITY
              </div>
              <select
                value={filters.isPublic ? 'public' : 'private'}
                onChange={e => setFilters(prev => ({ ...prev, isPublic: e.target.value === 'public' }))}
                style={{
                  width: '100%', padding: '8px 10px',
                  border: '1px solid #DFE1E6', borderRadius: 4,
                  fontSize: 13, color: '#172B4D', backgroundColor: '#FAFBFC',
                  outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
                }}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <p style={{ fontSize: 11, color: '#6B778C', margin: '6px 0 0 0', lineHeight: 1.4 }}>
                Private reports are only visible to you. Public reports can be seen by all users.
              </p>
            </div>

            {/* ── Data Settings ── */}
            <div>
              <div style={sectionTitleStyle}>
                <AiOutlineSetting size={12} style={{ marginRight: 5 }} /> DATA SETTINGS
              </div>
              <div style={infoCard}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={!!filters.showOnlyRecordsWithSalesforce}
                    onChange={e => setFilters(prev => ({ ...prev, showOnlyRecordsWithSalesforce: e.target.checked }))}
                    style={{ accentColor: '#0052CC', width: 14, height: 14 }}
                  />
                  <span style={{ fontSize: 12, color: '#172B4D' }}>Show only records with Salesforce data</span>
                </label>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const InfoRow: React.FC<{ label: string; value: string; badge?: { color: string; bg: string } }> = ({ label, value, badge }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F4F5F7' }}>
    <span style={{ fontSize: 11, color: '#6B778C', fontWeight: 500 }}>{label}</span>
    {badge ? (
      <span style={{ fontSize: 11, fontWeight: 600, color: badge.color, backgroundColor: badge.bg, padding: '2px 8px', borderRadius: 10 }}>
        {value}
      </span>
    ) : (
      <span style={{ fontSize: 12, color: '#172B4D', fontWeight: 500, maxWidth: 160, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </span>
    )}
  </div>
);

const StatCard: React.FC<{ label: string; value: number; color: string; bg: string }> = ({ label, value, color, bg }) => (
  <div style={{ flex: 1, backgroundColor: bg, borderRadius: 6, padding: '10px 8px', textAlign: 'center' }}>
    <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
    <div style={{ fontSize: 10, color, fontWeight: 500, marginTop: 2 }}>{label}</div>
  </div>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const sidebarStyle: React.CSSProperties       = { width: 300, borderRight: '1px solid #DFE1E6', backgroundColor: 'white', display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0 };
const tabsContainerStyle: React.CSSProperties = { display: 'flex', borderBottom: '1px solid #DFE1E6', backgroundColor: '#FAFBFC' };
const tabStyle: React.CSSProperties           = { flex: 1, textAlign: 'center', padding: '12px 0', cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'color 0.15s' };
const sectionTitleStyle: React.CSSProperties  = { fontSize: 10, fontWeight: 700, color: '#5E6C84', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, display: 'flex', alignItems: 'center' };
const itemCardStyle: React.CSSProperties      = { display: 'flex', alignItems: 'center', borderRadius: 3, padding: '8px 10px', userSelect: 'none' };
const handleStyle: React.CSSProperties        = { cursor: 'grab', color: '#B3BAC5', marginRight: 10, fontSize: 16 };
const removeBtnStyle: React.CSSProperties     = { border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, color: '#BF2600' };
const labelStyle: React.CSSProperties         = { fontSize: 12, fontWeight: 600, color: '#42526E' };
const infoCard: React.CSSProperties           = { backgroundColor: '#FAFBFC', border: '1px solid #EBECF0', borderRadius: 6, padding: '4px 12px' };

export default ConfigPanel;