import React, { useState, useEffect, useMemo, useRef } from 'react';
import FieldsSidebar from './FieldsSidebar';
import ConfigPanel from './ConfigPanel';
import ChartPreview from './ChartPreview';
import DataGrid, { DataRow } from '../DataGrid/DataGrid';
import type { ChartValueFormat } from '../Charts/chartFormat';
import type { ChartModel } from '../Charts/ChartRenderer';
import { isMultiSeriesChart, type ChartType as ChartTypeId } from '../Charts/chartTypes';
import ChartProperties from './ChartProperties';
import ReportService from '../../services/ServiceNow/report-service';
import { sobjectService } from '../../services';
import { tableService } from '../../services';
import './ReportBuilderStyles.css';
import { AiOutlineLeft, AiOutlineEdit } from 'react-icons/ai';
import { ExportButton } from '../ExportButton';
import { exportToCSV, exportToXLSX, exportToPDF } from '../../utils/exportService';
import { successToast, errorToast } from '../../utils/toast';
import {
  type FilterCondition,
  hasSalesforceConditions,
  evaluateConditions,
  buildDefaultLogic,
  buildEncodedQuery,
  normalizeFieldId,
} from '../../utils/filterBuilder';

export type { ChartType } from '../Charts/chartTypes';

// Labels for the Y-axis metric, also used as the series name of single-series charts
export const METRIC_LABELS: Record<string, string> = {
  count: 'Count', sum: 'Sum', avg: 'Average', max: 'Max', min: 'Min',
};

export type FilterConfig = {
  project: string;
  type: string;
  state: string;
  selectedFields: string[];
  showChart: boolean;
  groupBy: string[];
  chartType: ChartTypeId;
  chartSeriesBy?: string;   // "Split by" field for stacked / multi-series charts
  chartTitle?: string;
  groupRowsBy: string;
  sfObjectName?: string;
  snObjectName?: string;
  filterConditions?: FilterCondition[];
  filterLogic: string;
  filterQuery?: string;
  showOnlyRecordsWithSalesforce?: boolean;
  chartGroupBy?: string;
  description?: string;
  createdDate?: string;
  owner?: string;
  chartMetric?: 'count' | 'sum' | 'avg' | 'max' | 'min';
  chartValueField?: string;
  isPublic?: boolean;
  [key: string]: any;
};

export type FieldChoice = {
  label: string;
  value: string;
};

export type AvailableField = {
  id: string;
  label: string;
  type?: string;
  referenceTo?: string[];
  relationshipName?: string | null;
  choices?: FieldChoice[];      // picklist / choice list values for the filter builder
  referenceTable?: string;      // target table of a ServiceNow reference field
};

type ReportBuilderProps = {
  reportId: string;
  onBack: (folderId: string) => void;
  onSave: (filters: FilterConfig, reportId: string) => void;
  initialRunMode?: boolean;
};

const defaultFiltersBase: FilterConfig = {
  name: 'New Report',
  project: '',
  type: 'All',
  state: 'All',
  selectedFields: [],
  showChart: true,
  groupBy: [],
  chartType: 'donut',
  groupRowsBy: '',
  filterConditions: [],
  filterLogic: '',
  filterQuery: '',
  sfObjectName: 'account',
  snObjectName: 'incident',
  showOnlyRecordsWithSalesforce: false,
  folderId: null,
  chartGroupBy: 'SF.Id',
  chartSeriesBy: '',
  chartTitle: '',
  description: '',
  createdDate: '',
  owner: '',
  isPublic: false,
};

const PAGE_SIZE = 200;

// ─── Role helpers ─────────────────────────────────────────────────────────────
const canEdit  = (role?: string) => ['owner', 'manager', 'editor'].includes(role || '');
const isViewer = (role?: string) => role === 'viewer';

const ReportBuilder: React.FC<ReportBuilderProps> = ({ reportId, onBack, onSave, initialRunMode }) => {

  const [filters, setFilters]                   = useState<FilterConfig>({ ...defaultFiltersBase });
  const [userRole, setUserRole]                 = useState<string | undefined>(undefined);
  const [autoPreview, setAutoPreview]           = useState(false);
  const [reportIsRunning, setReportIsRunning]   = useState(initialRunMode ?? false);
  const [rawData, setRawData]                   = useState<DataRow[]>([]);
  const [serverTotal, setServerTotal]           = useState<number | null>(null);
  const [loading, setLoading]                   = useState(false);
  const [loadingStatus, setLoadingStatus]       = useState('');
  const [availableFields, setAvailableFields]   = useState<AvailableField[]>([]);
  const [lookupFields, setLookupFields]         = useState<AvailableField[]>([]);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [isEditingName, setIsEditingName]       = useState(false);

  const prevSelectedFields = useRef<string>(JSON.stringify([]));
  const prevFilterQuery    = useRef<string>('');
  const prevFilterConditions = useRef<string>(JSON.stringify([]));
  const prevShowOnlyWithSF = useRef<boolean>(false);

  const deepClone      = (obj: any) => JSON.parse(JSON.stringify(obj));
  const savedFiltersRef = useRef<FilterConfig>(deepClone(defaultFiltersBase));
  const nameInputRef    = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName) nameInputRef.current?.focus();
  }, [isEditingName]);

  // ─── Load report ────────────────────────────────────────────────────────────
  useEffect(() => {
    const getReport = async () => {
      try {
        const report = await ReportService.getReportById(reportId);
        setUserRole(report.userRole);

        if (isViewer(report.userRole)) {
          setReportIsRunning(true);
        }

        const savedConditions: FilterCondition[] = report.filterConditions ? JSON.parse(report.filterConditions) : [];
        const savedLogic = report.filterLogic || buildDefaultLogic(savedConditions);

        const loaded: FilterConfig = {
          ...defaultFiltersBase,
          name:                         report.name,
          sfObjectName:                 report.salesforceObject,
          snObjectName:                 report.serviceNowObject,
          selectedFields:               report.columns ? JSON.parse(report.columns) : [],
          groupBy:                      report.groupBy ? JSON.parse(report.groupBy) : [],
          showOnlyRecordsWithSalesforce: report.showOnlyRecordsWithSalesforce,
          folderId:                     report.folderId,
          chartGroupBy:                 report.chartGroupBy,
          chartType:                    (report.chartType as ChartTypeId) || 'bar',
          chartSeriesBy:                report.chartSeriesBy ?? '',
          chartTitle:                   report.chartTitle ?? '',
          chartMetric:                  (report.chartMetric as FilterConfig['chartMetric']) || 'count',
          chartValueField:              report.chartValueField ?? '',
          // Recompute the encoded query from the saved conditions — the stored
          // filter_query may be stale (e.g. contain SF fields from older versions)
          filterQuery:                  savedConditions.length ? buildEncodedQuery(savedConditions, savedLogic) : '',
          filterConditions:             savedConditions,
          filterLogic:                  report.filterLogic ?? '',
          description:                  report.description ?? '',
          createdDate:                  report.createdDate ?? '',
          owner:                        report.ownerName ?? '',
          showChart:                    report.showChart ?? false,
          isPublic:                     report.isPublic ?? false
        };

        setFilters(loaded);
        savedFiltersRef.current = deepClone(loaded);

        const usedFieldIds = [
          ...loaded.selectedFields,
          ...loaded.groupBy,
          ...(loaded.chartGroupBy ? [loaded.chartGroupBy] : []),
        ];

        // ─── Field metadata first — client-side filtering needs field types ──
        const fields = await getAvailableFields(loaded.sfObjectName, loaded.snObjectName, usedFieldIds);

        // ─── Run with the loaded config — state is not updated yet ──────────
        handleRun(loaded, fields);
      } catch (e) {
        console.error(e);
      }
    };

    const getAvailableFields = async (
      sfObject?: string,
      snObject?: string,
      usedFieldIds: string[] = []
    ): Promise<AvailableField[]> => {
      if (!sfObject || !snObject) return [];

      const availableSFFields = await sobjectService.getSObjectFields(sfObject);
      const availableFieldsMapped: AvailableField[] = availableSFFields.map(el => ({
        id: `SF.${el.apiname}`,
        label: el.label,
        type: el.type,
        referenceTo: el.referenceTo ?? [],
        relationshipName: el.relationshipName ?? null,
        choices: el.choices ?? [],
      })).sort((a, b) => a.label.localeCompare(b.label));

      const availableSNFields = await tableService.getTableFields(snObject);
      const availableSNFieldsMapped: AvailableField[] = availableSNFields.map(el => ({
        id: `SN.${el.element}`,
        label: el.column_label,
        type: el.type ?? 'string',
        choices: el.choices ?? [],
        referenceTable: el.referenceTable,
      })).sort((a, b) => a.label.localeCompare(b.label));

      const combined = availableFieldsMapped.concat(availableSNFieldsMapped);
      setAvailableFields(combined);

      // Lookup labels resolve in the background — they only affect display
      resolveLookupLabels(usedFieldIds, availableFieldsMapped);

      return combined;
    };

    // ─── Resolve "[object label]: [field label]" for saved lookup fields ────
    // Saved reports may reference child fields (SF.<relationship>.<apiname>)
    // whose labels are only known after describing the referenced object
    const resolveLookupLabels = async (fieldIds: string[], sfFields: AvailableField[]) => {
      const relationships: string[] = [];
      fieldIds.forEach(id => {
        const match = id.match(/^SF\.([^.]+)\./);
        if (match && !relationships.includes(match[1])) relationships.push(match[1]);
      });
      if (!relationships.length) return;

      const entries: AvailableField[] = [];
      await Promise.all(relationships.map(async rel => {
        const parent = sfFields.find(f => f.relationshipName === rel);
        if (!parent?.referenceTo?.length) return;
        await Promise.all(parent.referenceTo.map(async obj => {
          try {
            const [childFields, objLabel] = await Promise.all([
              sobjectService.getSObjectFields(obj),
              sobjectService.getObjectLabel(obj),
            ]);
            childFields.forEach(f => entries.push({
              id: `SF.${rel}.${f.apiname}`,
              label: `${objLabel}: ${f.label}`,
              type: f.type,
            }));
          } catch {
            // label falls back to the raw field id
          }
        }));
      }));
      registerLookupFields(entries);
    };

    getReport();
  }, [reportId]);

  // ─── Auto preview ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoPreview) return;

    const currentFields     = JSON.stringify(filters.selectedFields);
    const currentQuery      = filters.filterQuery ?? '';
    const currentConditions = JSON.stringify(filters.filterConditions);
    const currentShowOnly   = filters.showOnlyRecordsWithSalesforce ?? false;

    // ─── Only reload if data-affecting fields changed ─────────────────────
    const hasDataChange =
      currentFields     !== prevSelectedFields.current   ||
      currentQuery      !== prevFilterQuery.current      ||
      currentConditions !== prevFilterConditions.current ||
      currentShowOnly   !== prevShowOnlyWithSF.current;

    if (!hasDataChange) return;

    // ─── Update refs ──────────────────────────────────────────────────────
    prevSelectedFields.current   = currentFields;
    prevFilterQuery.current      = currentQuery;
    prevFilterConditions.current = currentConditions;
    prevShowOnlyWithSF.current   = currentShowOnly;

    const timeout = setTimeout(() => handleRun(filters), 300);
    return () => clearTimeout(timeout);

  }, [filters, autoPreview]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  // ─── Apply changes from the config panel, then save and run ───────────────
  // The patch carries the just-applied values — reading `filters` here would
  // use the previous render's state (React hasn't committed the update yet)
  const applyConfigAndRun = async (patch?: Partial<FilterConfig>) => {
    const next = patch ? { ...filters, ...patch } : filters;
    await handleSave(next);
    handleRun(next);
  };

  const handleSave = async (configOverride?: FilterConfig) => {
    const config = configOverride ?? filters;
    try {
      await onSave(config, reportId);
      savedFiltersRef.current = deepClone(config);
    } catch (e: any) {
      errorToast(e?.message || 'Failed to save report.');
    }
  };

  const handleBackClick = () => {
    if (isViewer(userRole)) {
      onBack(filters.folderId);
      return;
    }
    const hasChanges = JSON.stringify(filters) !== JSON.stringify(savedFiltersRef.current);
    if (hasChanges) {
      setShowUnsavedModal(true);
    } else {
      onBack(filters.folderId);
    }
  };

  const runIdRef = useRef(0);

  const handleRun = async (filtersOverride?: FilterConfig, fieldsOverride?: AvailableField[]) => {
    const runId = ++runIdRef.current;
    try {
      const activeFilters = filtersOverride ?? filters;

      if (!activeFilters.sfObjectName || !activeFilters.snObjectName) return;
      if (!activeFilters.selectedFields?.length) return;

      setLoading(true);
      setRawData([]);

      // ─── SF conditions are filtered client-side, so their fields (and the
      // SN fields needed to re-check mixed logic) must be present in the data ──
      const conditions      = activeFilters.filterConditions ?? [];
      const clientFiltering = hasSalesforceConditions(conditions);
      const extraFilterFields: string[] = [];
      if (clientFiltering) {
        conditions.forEach(c => {
          if (!c.field) return;
          const fieldId = normalizeFieldId(c.field);
          if (!activeFilters.selectedFields.includes(fieldId) && !extraFilterFields.includes(fieldId)) {
            extraFilterFields.push(fieldId);
          }
        });
      }
      const fetchFields = activeFilters.selectedFields.concat(extraFilterFields);

      let page = 1;
      let hasMore = true;
      let allItems: DataRow[] = [];
      let totalFromServer: number | null = null;

      while (hasMore) {
        if (runId !== runIdRef.current) return; // a newer run superseded this one
        const result = await ReportService.getReportData({
          sfObjectName:                  activeFilters.sfObjectName!,
          snObjectName:                  activeFilters.snObjectName!,
          selectedFields:                fetchFields,
          filterQuery:                   activeFilters.filterQuery,
          showOnlyRecordsWithSalesforce: activeFilters.showOnlyRecordsWithSalesforce,
          page,
          pageSize: PAGE_SIZE,
        });

        const items: DataRow[] = (result.items || []).map((item: Record<string, any>, index: number) => ({
          id: item['SF.Id'] ?? item['SN.sys_id'] ?? `${page}-${index}`,
          ...item,
        }));

        allItems = [...allItems, ...items];

        // ─── Update loading status so user knows progress ──────────────────
        const total = result.pagination?.total ?? '?';
        setLoadingStatus(`Loading ${allItems.length} of ${total} records...`);

        if (typeof result.pagination?.total === 'number') totalFromServer = result.pagination.total;
        hasMore = result.pagination?.hasMore ?? false;
        page++;
      }

      // ─── Apply SF / mixed filter logic client-side ────────────────────────
      if (clientFiltering) {
        const logic = activeFilters.filterLogic || buildDefaultLogic(conditions);
        // Field metadata drives numeric/date aware comparison
        const fieldsForEval = fieldsOverride ?? allFields;
        allItems = allItems.filter(row => evaluateConditions(row, conditions, logic, fieldsForEval));
      }

      // ─── All pages loaded — show everything at once ───────────────────────
      if (runId !== runIdRef.current) return;
      setRawData(allItems);
      setServerTotal(totalFromServer);

    } catch (e: any) {
      errorToast(e?.message || 'Failed to run report.');
    } finally {
      if (runId === runIdRef.current) {
        setLoading(false);
        setLoadingStatus('');
      }
    }
  };

  // ─── Merge lookup child field labels loaded from the sidebar ──────────────
  const registerLookupFields = (entries: AvailableField[]) => {
    setLookupFields(prev => {
      const known = prev.map(f => f.id);
      const fresh = entries.filter((f, i) =>
        !known.includes(f.id) && entries.findIndex(e => e.id === f.id) === i
      );
      return fresh.length ? prev.concat(fresh) : prev;
    });
  };

  // Full field list for label resolution (columns, grid headers, exports, chart)
  const allFields = useMemo(() => [...availableFields, ...lookupFields], [availableFields, lookupFields]);

  const toggleField = (fieldId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedFields: prev.selectedFields.includes(fieldId)
        ? prev.selectedFields.filter(f => f !== fieldId)
        : [...prev.selectedFields, fieldId],
    }));
  };

  // ─── Chart model ──────────────────────────────────────────────────────────
  // Categories come from the X-axis field. Multi-series charts additionally
  // split every category by the "Split by" field, producing one series each.
  const chartModel = useMemo<ChartModel>(() => {
    const empty: ChartModel = { categories: [], series: [] };
    if (!rawData.length) return empty;

    const groupField = filters.chartGroupBy;
    if (!groupField) return empty;

    const metric      = (filters.chartMetric as string) || 'count';
    const valueField  = filters.chartValueField ?? '';
    const needsField  = metric !== 'count';
    const splitField  = isMultiSeriesChart(filters.chartType) ? (filters.chartSeriesBy ?? '') : '';
    const metricLabel = METRIC_LABELS[metric] ?? 'Count';

    const categories: string[] = [];
    const seriesNames: string[] = [];
    const buckets: Record<string, Record<string, number[]>> = {};   // series -> category -> values

    rawData.forEach(item => {
      const category = String(item[groupField] ?? '(Blank)');
      const series   = splitField ? String(item[splitField] ?? '(Blank)') : metricLabel;

      if (!categories.includes(category)) categories.push(category);
      if (!seriesNames.includes(series)) seriesNames.push(series);

      if (!buckets[series]) buckets[series] = {};
      if (!buckets[series][category]) buckets[series][category] = [];

      if (needsField && valueField) {
        const num = parseFloat(item[valueField]);
        if (!isNaN(num)) buckets[series][category].push(num);
      } else {
        buckets[series][category].push(1); // count
      }
    });

    const aggregate = (values: number[]): number => {
      if (!values.length) return 0;
      let value = 0;
      if (metric === 'count') value = values.length;
      if (metric === 'sum')   value = values.reduce((a, b) => a + b, 0);
      if (metric === 'avg')   value = values.reduce((a, b) => a + b, 0) / values.length;
      if (metric === 'max')   value = Math.max.apply(null, values);
      if (metric === 'min')   value = Math.min.apply(null, values);
      return Math.round(value * 100) / 100;
    };

    return {
      categories,
      series: seriesNames.map(name => ({
        name,
        data: categories.map(category => aggregate(buckets[name]?.[category] ?? [])),
      })),
    };
  }, [
    rawData, filters.chartGroupBy, filters.chartSeriesBy,
    filters.chartMetric, filters.chartValueField, filters.chartType,
  ]);

  const readonly = isViewer(userRole);

  const seriesName  = METRIC_LABELS[(filters.chartMetric as string) ?? 'count'] ?? 'Count';
  const valueLabel  = allFields.find(f => f.id === filters.chartValueField)?.label ?? '';
  const yAxisLabel  = filters.chartMetric === 'count' ? 'Count' : `${seriesName}${valueLabel ? ` of ${valueLabel}` : ''}`;

  // ─── Value format for the chart, derived from the Y-axis value field type ──
  const chartValueFormat: ChartValueFormat = useMemo(() => {
    if (((filters.chartMetric as string) ?? 'count') === 'count') return 'number';
    const type = allFields.find(f => f.id === filters.chartValueField)?.type;
    if (type === 'currency' || type === 'currency2') return 'currency';
    if (type === 'percent') return 'percent';
    return 'number';
  }, [allFields, filters.chartValueField, filters.chartMetric]);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#FFFFFF' }}>

      {/* ── Header ── */}
      <div style={headerBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={handleBackClick} className="back-btn">
            <AiOutlineLeft size={14} /> Back
          </button>
          <div style={{ width: '1px', height: '24px', backgroundColor: '#DFE1E6' }} />

          {/* ── Report name — click to edit ── */}
          {!readonly && isEditingName ? (
            <input
              ref={nameInputRef}
              value={filters.name || ''}
              onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
              onBlur={() => setIsEditingName(false)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setIsEditingName(false); }}
              style={{
                fontSize: '18px', fontWeight: '600', color: '#172B4D',
                border: 'none', borderBottom: '2px solid #0052CC',
                outline: 'none', background: 'transparent',
                width: Math.max(200, (filters.name?.length ?? 0) * 11),
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '18px', fontWeight: '600', color: '#172B4D' }}>
                {filters?.name || 'New Report'}
              </span>
              {!readonly && (
                <AiOutlineEdit
                  size={16}
                  onClick={() => setIsEditingName(true)}
                  style={{ color: '#8993A4', cursor: 'pointer', flexShrink: 0 }}
                  title="Edit report name"
                />
              )}
            </div>
          )}

          {/* ── Read-only badge for viewers ── */}
          {readonly && (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#42526E', backgroundColor: '#F4F5F7', padding: '3px 8px', borderRadius: 10, border: '1px solid #DFE1E6' }}>
              View Only
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setFilters(f => ({ ...f, showChart: !f.showChart }))}
            style={{ ...iconToggleBtn, backgroundColor: filters.showChart ? '#e9f2ff' : '#fff' }}
            title="Toggle Chart"
          >
            📊
          </button>
          <div style={{ width: '1px', height: '24px', backgroundColor: '#DFE1E6', margin: '0 5px' }} />
          <ExportButton
            disabled={rawData.length === 0}
            onExportCSV={() => exportToCSV(rawData, filters.selectedFields, allFields, filters.name)}
            onExportXLSX={() => exportToXLSX(rawData, filters.selectedFields, allFields, filters.name)}
            onExportPDF={() => exportToPDF(rawData, filters.selectedFields, allFields, filters.name)}
          />
          <button onClick={() => handleRun(filters)} disabled={loading} className="secondaryBtnStyle">
            {loading ? 'Running...' : '▶ Run Preview'}
          </button>
          {!readonly && (
            <>
              <button onClick={() => handleSave()} className="primaryButtonStyle">Save</button>
              <button
                className="primaryButtonStyle"
                onClick={() => {
                  const next = !reportIsRunning;
                  setReportIsRunning(next);
                  // ─── Run report when switching to run mode ────────────────
                  if (next) handleRun(filters);
                }}
              >
                {reportIsRunning ? 'Edit Report' : 'Run Report'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Fields sidebar and config panel hidden for viewers and in run mode ── */}
        {!reportIsRunning && !readonly && (
          <>
            <FieldsSidebar
              availableFields={availableFields}
              selectedFields={filters.selectedFields || []}
              onToggleField={toggleField}
              onLookupFieldsLoaded={registerLookupFields}
            />
            <ConfigPanel
              filters={filters}
              setFilters={setFilters}
              onRun={applyConfigAndRun}
              availableFields={allFields}
              rawData={rawData}
              totalRecords={serverTotal ?? undefined}
              reportMeta={{
                createdDate: filters.createdDate,
                owner: filters.owner,
              }}
            />
          </>
        )}

        <div style={{ flex: 1, backgroundColor: '#F4F5F7', padding: '25px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* ── Loading overlay ── */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#DEEBFF', borderRadius: '4px', color: '#0052cc', fontSize: '13px' }}>
              ⏳ {'Loading...'}
            </div>
          )}

          {/* ── Chart ── */}
          {!loading && filters.showChart && (
            <div style={cardStyle}>
              {!readonly && (
                <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}>
                  <button onClick={() => setIsRightPanelOpen(!isRightPanelOpen)} style={gearBtnStyle}>⚙️</button>
                </div>
              )}
              <div style={cardHeaderStyle}><span>Chart Preview</span></div>
              <div style={{ width: '100%', height: '300px', minWidth: 0, position: 'relative' }}>
                <ChartPreview
                  model={chartModel}
                  loading={loading}
                  chartType={filters.chartType}
                  title={filters.chartTitle}
                  seriesName={seriesName}
                  yAxisLabel={yAxisLabel}
                  valueFormat={chartValueFormat}
                />
              </div>
            </div>
          )}

          {/* ── Data table ── */}
          {!loading && (
            <div id="report-table-container" style={cardStyle}>
              <div className="card-header">
                <span className="card-header-title">Results ({rawData.length})</span>
                <div
                  className="toggle-wrapper"
                  onClick={() => setAutoPreview(p => !p)}
                  title="Automatically re-fetch when filters change"
                >
                  <span className="toggle-label">
                    {autoPreview ? 'Auto Preview On' : 'Auto Preview Off'}
                  </span>
                  <div className={`toggle-track ${autoPreview ? 'active' : ''}`}>
                    <div className="toggle-thumb" />
                  </div>
                </div>
              </div>
              <div className="table-card-wrapper">
                <div style={{ minWidth: 0, width: '100%' }}>
                  <DataGrid
                    key={filters.groupBy.join(',')}
                    rows={rawData}
                    selectedFields={filters.selectedFields}
                    groupBy={filters.groupBy}
                    fields={allFields}
                    onGroupBy={field => setFilters(prev => ({ ...prev, groupBy: [...prev.groupBy, field] }))}
                    onRemoveColumn={field => setFilters(prev => ({
                      ...prev,
                      selectedFields: prev.selectedFields.filter(f => f !== field),
                      groupBy: prev.groupBy.filter(f => f !== field),
                    }))}
                    onUngroup={field => setFilters(prev => ({
                      ...prev,
                      groupBy: prev.groupBy.filter(f => f !== field),
                    }))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Chart Properties panel ── */}
        {isRightPanelOpen && !readonly && (
          <div style={rightPanelStyle}>
            <div style={rightPanelHeaderStyle}>
              <span style={{ fontWeight: 'bold' }}>Chart Properties</span>
              <button onClick={() => setIsRightPanelOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>
            <ChartProperties
              filters={filters}
              setFilters={setFilters}
              availableFields={allFields}
            />
          </div>
        )}
      </div>

      {/* ── Unsaved Changes Modal ── */}
      {showUnsavedModal && !readonly && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ color: '#FF8B00', fontSize: 20 }}>⚠</span>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#172B4D' }}>
                Unsaved Changes
              </h3>
            </div>
            <p style={{ margin: '0 0 24px 0', fontSize: 14, color: '#42526E', lineHeight: 1.5 }}>
              You have unsaved changes. Would you like to save before leaving?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowUnsavedModal(false)} style={modalCancelBtnStyle}>
                Cancel
              </button>
              <button
                onClick={() => { setShowUnsavedModal(false); onBack(filters.folderId); }}
                style={modalDiscardBtnStyle}
              >
                Discard & Close
              </button>
              <button
                onClick={async () => {
                  await handleSave();
                  setShowUnsavedModal(false);
                  onBack(filters.folderId);
                }}
                style={modalSaveBtnStyle}
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportBuilder;

// ─── Styles ───────────────────────────────────────────────────────────────────
const headerBarStyle: React.CSSProperties      = { height: '56px', borderBottom: '1px solid #DFE1E6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', backgroundColor: 'white', flexShrink: 0, zIndex: 10 };
const iconToggleBtn: React.CSSProperties       = { border: '1px solid #DFE1E6', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const cardStyle: React.CSSProperties          = { backgroundColor: 'white', borderRadius: '3px', boxShadow: '0 1px 2px rgba(9, 30, 66, 0.08)', padding: '20px', position: 'relative', width: '100%', boxSizing: 'border-box' };
const cardHeaderStyle: React.CSSProperties    = { fontSize: '14px', fontWeight: '600', color: '#172B4D', marginBottom: '15px' };
const gearBtnStyle: React.CSSProperties       = { background: 'white', border: '1px solid #DFE1E6', borderRadius: '4px', padding: '5px 8px', cursor: 'pointer', fontSize: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const rightPanelStyle: React.CSSProperties    = { width: '300px', borderLeft: '1px solid #DFE1E6', backgroundColor: 'white', display: 'flex', flexDirection: 'column', zIndex: 20 };
const rightPanelHeaderStyle: React.CSSProperties = { padding: '15px', borderBottom: '1px solid #DFE1E6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const modalOverlayStyle: React.CSSProperties  = { position: 'fixed', inset: 0, backgroundColor: 'rgba(9, 30, 66, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle: React.CSSProperties         = { backgroundColor: 'white', padding: '28px 32px', borderRadius: '8px', width: '420px', maxWidth: '90vw', boxShadow: '0 4px 24px rgba(9, 30, 66, 0.2)', fontFamily: 'sans-serif' };
const modalCancelBtnStyle: React.CSSProperties  = { padding: '8px 16px', backgroundColor: 'transparent', color: '#42526E', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 500, fontSize: 14 };
const modalDiscardBtnStyle: React.CSSProperties = { padding: '8px 16px', backgroundColor: 'white', color: '#DE350B', border: '1px solid #DE350B', borderRadius: 4, cursor: 'pointer', fontWeight: 500, fontSize: 14 };
const modalSaveBtnStyle: React.CSSProperties    = { padding: '8px 16px', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 14 };