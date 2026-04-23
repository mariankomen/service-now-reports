import React, { useState, useEffect, useMemo } from 'react';
import FieldsSidebar from './FieldsSidebar';
import ConfigPanel from './ConfigPanel';
import ChartPreview from './ChartPreview';
import DataGrid, { DataRow } from './DataGrid';
import ChartProperties from './ChartProperties';
import { runReport } from '../../services/ServiceNow/ServiceNowApi';

export type ChartType = 'donut' | 'bar' | 'line' | 'table';

export type FilterConfig = {
  project: string;
  type: string;
  state: string;
  selectedFields: string[];
  showChart: boolean;
  groupBy: string;
  chartType: ChartType;
  groupRowsBy: string;
  [key: string]: any;
};

export type AvailableField = {
  id: string;
  label: string;
};

type ReportBuilderProps = {
  report?: { name?: string; config?: Partial<FilterConfig> };
  onBack: () => void;
  onSave: (filters: FilterConfig) => void;
};

const ReportBuilder: React.FC<ReportBuilderProps> = ({ report, onBack, onSave }) => {
  const [filters, setFilters] = useState<FilterConfig>({
    project: 'Peeklogic Azure Project',
    type: 'All',
    state: 'All',
    selectedFields: ['System.Id', 'System.Title', 'System.State', 'System.AssignedTo'],
    showChart: true,
    groupBy: 'System.State',
    chartType: 'donut',
    groupRowsBy: '',
    ...(report?.config && typeof report.config === 'object' ? report.config : {}),
  });

  const [rawData, setRawData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [availableFields, setAvailableFields] = useState<AvailableField[]>([]);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  useEffect(() => {
    handleRun();
  }, []);

  const handleRun = async () => {
    setLoading(true);
    setRawData([]);

    const result = await runReport(filters, (status: string) => setLoadingStatus(status));
    const items: DataRow[] = (result.items || []).map((item: Record<string, any>, index: number) => ({
      id: item.id ?? index, // ensure every row has an id
      ...item
    }));
    setRawData(items);

    const allKeys = new Set<string>();
    items.forEach(item => Object.keys(item).forEach(key => allKeys.add(key)));
    const fieldsList: AvailableField[] = Array.from(allKeys)
      .map(key => ({ id: key, label: key.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || key }))
      .sort((a, b) => a.label.localeCompare(b.label));

    setAvailableFields(fieldsList);
    setLoading(false);
  };

  const toggleField = (fieldId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedFields: prev.selectedFields.includes(fieldId)
        ? prev.selectedFields.filter(f => f !== fieldId)
        : [...prev.selectedFields, fieldId]
    }));
  };

  const chartData = useMemo(() => {
    if (!rawData.length) return [];
    const groupField = filters.groupBy || 'System.State';
    const statsMap: Record<string, number> = {};
    rawData.forEach(item => {
      const val = item[groupField] ?? '(Blank)';
      statsMap[val] = (statsMap[val] || 0) + 1;
    });
    return Object.keys(statsMap).map(key => ({ name: key, value: statsMap[key] }));
  }, [rawData, filters.groupBy]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div style={headerBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onBack} style={backBtnStyle}>← Back</button>
          <div style={{ width: '1px', height: '24px', backgroundColor: '#DFE1E6' }}></div>
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#172B4D' }}>
            {report?.name || 'New Report'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setFilters(f => ({ ...f, showChart: !f.showChart }))}
            style={{ ...iconToggleBtn, backgroundColor: filters.showChart ? '#e9f2ff' : '#fff' }}
            title="Toggle Chart"
          >
            📊
          </button>
          <div style={{ width: '1px', height: '24px', backgroundColor: '#DFE1E6', margin: '0 5px' }}></div>
          <button onClick={handleRun} disabled={loading} style={secondaryBtnStyle}>
            {loading ? 'Running...' : '▶ Run Preview'}
          </button>
          <button onClick={() => onSave(filters)} style={primaryBtnStyle}>Save</button>
          <button style={runReportBtnStyle}>Run Report</button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <FieldsSidebar
          availableFields={availableFields}
          selectedFields={filters.selectedFields || []}
          onToggleField={toggleField}
        />

        <ConfigPanel
          filters={filters}
          setFilters={setFilters}
          onRun={handleRun}
          availableFields={availableFields}
        />

        <div style={{ flex: 1, backgroundColor: '#F4F5F7', padding: '25px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#DEEBFF', borderRadius: '4px', color: '#0052cc', fontSize: '13px' }}>
              ⏳ {loadingStatus}
            </div>
          )}

          {!loading && filters.showChart && (
            <div style={cardStyle}>
              <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
                <button
                  onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                  style={gearBtnStyle}
                >
                  ⚙️
                </button>
              </div>
              <div style={cardHeaderStyle}>
                <span>Chart Preview</span>
              </div>
              <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ChartPreview data={chartData} loading={loading} chartType={filters.chartType} />
              </div>
            </div>
          )}

          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <span>Results ({rawData.length})</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <DataGrid rows={rawData} selectedFields={filters.selectedFields} />
            </div>
          </div>
        </div>

        {isRightPanelOpen && (
          <div style={rightPanelStyle}>
            <div style={rightPanelHeaderStyle}>
              <span style={{ fontWeight: 'bold' }}>Chart Properties</span>
              <button onClick={() => setIsRightPanelOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>
            <ChartProperties
              filters={filters}
              setFilters={setFilters}
              availableFields={availableFields}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportBuilder;

// ------------------ Styles ------------------
const headerBarStyle: React.CSSProperties = { height: '56px', borderBottom: '1px solid #DFE1E6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', backgroundColor: 'white', flexShrink: 0, zIndex: 10 };
const backBtnStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#0052cc', cursor: 'pointer', fontSize: '14px', fontWeight: '500' };
const primaryBtnStyle: React.CSSProperties = { backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '3px', padding: '6px 12px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' };
const secondaryBtnStyle: React.CSSProperties = { backgroundColor: 'white', color: '#42526E', border: '1px solid #DFE1E6', borderRadius: '3px', padding: '6px 12px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' };
const runReportBtnStyle: React.CSSProperties = { backgroundColor: '#fff', color: '#172B4D', border: '1px solid #DFE1E6', borderRadius: '3px', padding: '6px 12px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' };
const iconToggleBtn: React.CSSProperties = { border: '1px solid #DFE1E6', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const cardStyle: React.CSSProperties = { backgroundColor: 'white', borderRadius: '3px', boxShadow: '0 1px 2px rgba(9, 30, 66, 0.08)', padding: '20px', position: 'relative' };
const cardHeaderStyle: React.CSSProperties = { fontSize: '14px', fontWeight: '600', color: '#172B4D', marginBottom: '15px' };
const gearBtnStyle: React.CSSProperties = { background: 'white', border: '1px solid #DFE1E6', borderRadius: '4px', padding: '5px 8px', cursor: 'pointer', fontSize: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const rightPanelStyle: React.CSSProperties = { width: '300px', borderLeft: '1px solid #DFE1E6', backgroundColor: 'white', display: 'flex', flexDirection: 'column', zIndex: 20 };
const rightPanelHeaderStyle: React.CSSProperties = { padding: '15px', borderBottom: '1px solid #DFE1E6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };