import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Folder, Report } from '../../interfaces';
import type { ReportListItem } from '../../interfaces';
import './styles.css';
import {
  AiFillFolder,
  AiOutlinePlayCircle,
  AiOutlineEdit,
  AiOutlineStar,
  AiFillStar,
  AiOutlineFolderOpen,
  AiOutlineShareAlt,
  AiOutlineDelete,
} from 'react-icons/ai';
import AddButton from '../AddButton';
import { ShareModal } from '../Modals';
import ReportService from '../../services/ServiceNow/report-service';
import { errorToast } from '../../utils/toast';

interface ReportListProps {
  reports: ReportListItem[];
  folderName: string;
  onOpenReport: (report: Report | Folder, isFolder: boolean) => void;
  openCreateFolderModal: () => void;
  openCreateReportModal: () => void;
  onRunReport: (report: ReportListItem) => void;
  onEditReport: (report: ReportListItem) => void;
  onEditFolder: (folder: ReportListItem) => void;
  onMoveReport: (report: ReportListItem) => void;
  onDeleteItem: (item: ReportListItem) => void;
}

type MenuPosition = { top: number; left: number };

type MenuItem =
  | { divider: true }
  | { id: string; label: string; icon: React.ReactNode; color: string; onClick?: () => void };

// ─── Role pill ────────────────────────────────────────────────────────────────

const RolePill: React.FC<{ role: string }> = ({ role }) => (
  <span className={`role-pill ${role}`}>{role}</span>
);

// ─── Visibility pill ──────────────────────────────────────────────────────────

const VisibilityPill: React.FC<{ isPublic?: boolean }> = ({ isPublic }) => (
  <span className={`visibility-pill ${isPublic ? 'public' : 'private'}`}>
    {isPublic ? 'Public' : 'Private'}
  </span>
);

// ─── Sort header ──────────────────────────────────────────────────────────────

const SortHeader: React.FC<{
  label: string;
  field: string;
  sortField: string;
  sortDir: 'asc' | 'desc';
  onSort: (field: string) => void;
  style?: React.CSSProperties;
}> = ({ label, field, sortField, sortDir, onSort, style }) => (
  <th
    onClick={() => onSort(field)}
    style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', ...style }}
  >
    {label}
    <span style={{ marginLeft: 4, color: sortField === field ? '#0052CC' : '#C1C7D0', fontSize: 11 }}>
      {sortField === field ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  </th>
);

// ─── Main component ───────────────────────────────────────────────────────────

const ReportList: React.FC<ReportListProps> = ({
  reports,
  folderName,
  onOpenReport,
  openCreateFolderModal,
  openCreateReportModal,
  onRunReport,
  onEditFolder,
  onEditReport,
  onMoveReport,
  onDeleteItem,
}) => {
  console.log(reports)
  const [openMenuId, setOpenMenuId]         = useState<string | null>(null);
  const [menuPosition, setMenuPosition]     = useState<MenuPosition | null>(null);
  const [shareModalItem, setShareModalItem] = useState<ReportListItem | null>(null);
  const [favorites, setFavorites]           = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm]         = useState('');
  const [filterSF, setFilterSF]             = useState('');
  const [filterSN, setFilterSN]             = useState('');
  const [sfDropdownOpen, setSFDropdownOpen] = useState(false);
  const [snDropdownOpen, setSNDropdownOpen] = useState(false);
  const [sortField, setSortField]           = useState<string>('');
  const [sortDir, setSortDir]               = useState<'asc' | 'desc'>('asc');
  const sfDropdownRef = useRef<HTMLDivElement>(null);
  const snDropdownRef = useRef<HTMLDivElement>(null);

  // ─── Sort handler ─────────────────────────────────────────────────────────
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // ─── Filter options ───────────────────────────────────────────────────────
  const sfOptionsMap: Record<string, boolean> = {};
  const snOptionsMap: Record<string, boolean> = {};
  for (let i = 0; i < reports.length; i++) {
    const r = reports[i];
    if (!r.isFolder) {
      if (r.salesforceObject) sfOptionsMap[r.salesforceObject] = true;
      if (r.serviceNowObject) snOptionsMap[r.serviceNowObject] = true;
    }
  }
  const sfOptions = Object.keys(sfOptionsMap).sort();
  const snOptions = Object.keys(snOptionsMap).sort();

  // ─── Filter ───────────────────────────────────────────────────────────────
  const filteredReports = reports.filter(r => {
    const matchesSearch = !searchTerm ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSF = !filterSF || r.salesforceObject === filterSF;
    const matchesSN = !filterSN || r.serviceNowObject === filterSN;
    return matchesSearch && matchesSF && matchesSN;
  });

  // ─── Sort ─────────────────────────────────────────────────────────────────
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (!sortField) return 0;
    const av = (a as any)[sortField] ?? '';
    const bv = (b as any)[sortField] ?? '';
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const hasOnlyFolders = sortedReports.length > 0 && sortedReports.every(r => r.isFolder);

  // ─── Close dropdowns on outside click ────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sfDropdownRef.current && !sfDropdownRef.current.contains(e.target as Node)) setSFDropdownOpen(false);
      if (snDropdownRef.current && !snDropdownRef.current.contains(e.target as Node)) setSNDropdownOpen(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  // ─── Load favorites ───────────────────────────────────────────────────────
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const ids = await ReportService.getFavorites();
        setFavorites(new Set(ids));
      } catch (e) {
        console.error(e);
      }
    };
    loadFavorites();
  }, []);

  // ─── Toggle favorite ──────────────────────────────────────────────────────
  const handleToggleFavorite = async (report: ReportListItem) => {
    const isFav = favorites.has(report.id);
    try {
      if (isFav) {
        setFavorites(prev => { const next = new Set(prev); next.delete(report.id); return next; });
        await ReportService.removeFromFavorites(report.id);
      } else {
        setFavorites(prev => new Set(prev).add(report.id));
        await ReportService.addToFavorites(report.id);
      }
    } catch (e: any) {
      if (isFav) setFavorites(prev => new Set(prev).add(report.id));
      else setFavorites(prev => { const next = new Set(prev); next.delete(report.id); return next; });
      errorToast(e?.message || 'Failed to update favorites.');
    }
  };

  // ─── Menu items ───────────────────────────────────────────────────────────
  const getMenuItems = (report: ReportListItem): MenuItem[] => [
    ...(!report.isFolder ? [{
      id: 'run', label: 'Run',
      icon: <AiOutlinePlayCircle size={18} />, color: '#172B4D',
      onClick: () => onRunReport(report),
    }] : []),
    {
      id: 'edit', label: 'Edit',
      icon: <AiOutlineEdit size={18} />, color: '#172B4D',
      onClick: () => report.isFolder ? onEditFolder(report) : onEditReport(report),
    },
    { divider: true },
    ...(!report.isFolder ? [{
      id: 'favorites',
      label: favorites.has(report.id) ? 'Remove from Favorites' : 'Add to Favorites',
      icon: favorites.has(report.id) ? <AiFillStar size={18} /> : <AiOutlineStar size={18} />,
      color: favorites.has(report.id) ? '#FF8B00' : '#172B4D',
      onClick: () => handleToggleFavorite(report),
    }] : []),
    ...(!report.isFolder ? [{
      id: 'move', label: 'Move to Folder',
      icon: <AiOutlineFolderOpen size={18} />, color: '#172B4D',
      onClick: () => onMoveReport(report),
    }] : []),
    ...((report.userRole === 'owner' || report.userRole === 'manager') ? [{
      id: 'share', label: 'Share',
      icon: <AiOutlineShareAlt size={18} />, color: '#172B4D',
      onClick: () => setShareModalItem(report),
    }] : []),
    { divider: true },
    {
      id: 'delete', label: 'Delete',
      icon: <AiOutlineDelete size={18} />, color: '#AE2E24',
      onClick: () => onDeleteItem(report),
    },
  ];

  // ─── Menu open/close ──────────────────────────────────────────────────────
  const openMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (openMenuId === id) { closeMenu(); return; }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right - 210 + window.scrollX,
    });
    setOpenMenuId(id);
  };

  const closeMenu = () => {
    setOpenMenuId(null);
    setMenuPosition(null);
  };

  useEffect(() => {
    if (!openMenuId) return;
    const handler = () => closeMenu();
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [openMenuId]);

  const handleNavigate = (item: ReportListItem) => onOpenReport(item, item.isFolder);

  const sortProps = { sortField, sortDir, onSort: handleSort };

  return (
    <div className="main" style={{ padding: '24px', height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#172B4D' }}>{folderName}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>

          {/* ── Search ── */}
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search..."
            style={filterInputStyle}
          />

          {/* ── ServiceNow Table filter ── */}
          {snOptions.length > 0 && (
            <div ref={snDropdownRef} style={{ position: 'relative' }}>
              <div
                onClick={() => { setSNDropdownOpen(p => !p); setSFDropdownOpen(false); }}
                style={{
                  ...filterSelectStyle,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                  border: snDropdownOpen ? '1px solid #0052CC' : '1px solid #DFE1E6',
                  minWidth: 160,
                }}
              >
                <span style={{ color: filterSN ? '#172B4D' : '#8993A4' }}>
                  {filterSN || 'All SN Tables'}
                </span>
                <span style={{ fontSize: 11, color: '#42526E', transition: 'transform 0.15s', transform: snDropdownOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
              </div>
              {snDropdownOpen && (
                <div style={filterDropdownStyle}>
                  {['', ...snOptions].map(opt => (
                    <div
                      key={opt || '__all_sn__'}
                      onClick={() => { setFilterSN(opt); setSNDropdownOpen(false); }}
                      style={{
                        ...filterDropdownItemStyle,
                        backgroundColor: filterSN === opt ? '#E9F2FF' : 'white',
                        color: filterSN === opt ? '#0052CC' : '#172B4D',
                        fontWeight: filterSN === opt ? 500 : 400,
                      }}
                      onMouseEnter={e => { if (filterSN !== opt) (e.currentTarget as HTMLElement).style.backgroundColor = '#F4F5F7'; }}
                      onMouseLeave={e => { if (filterSN !== opt) (e.currentTarget as HTMLElement).style.backgroundColor = filterSN === opt ? '#E9F2FF' : 'white'; }}
                    >
                      {opt || 'All SN Tables'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Salesforce Object filter ── */}
          {sfOptions.length > 0 && (
            <div ref={sfDropdownRef} style={{ position: 'relative' }}>
              <div
                onClick={() => { setSFDropdownOpen(p => !p); setSNDropdownOpen(false); }}
                style={{
                  ...filterSelectStyle,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                  border: sfDropdownOpen ? '1px solid #0052CC' : '1px solid #DFE1E6',
                  minWidth: 160,
                }}
              >
                <span style={{ color: filterSF ? '#172B4D' : '#8993A4' }}>
                  {filterSF || 'All SF Objects'}
                </span>
                <span style={{ fontSize: 11, color: '#42526E', transition: 'transform 0.15s', transform: sfDropdownOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
              </div>
              {sfDropdownOpen && (
                <div style={filterDropdownStyle}>
                  {['', ...sfOptions].map(opt => (
                    <div
                      key={opt || '__all_sf__'}
                      onClick={() => { setFilterSF(opt); setSFDropdownOpen(false); }}
                      style={{
                        ...filterDropdownItemStyle,
                        backgroundColor: filterSF === opt ? '#E9F2FF' : 'white',
                        color: filterSF === opt ? '#0052CC' : '#172B4D',
                        fontWeight: filterSF === opt ? 500 : 400,
                      }}
                      onMouseEnter={e => { if (filterSF !== opt) (e.currentTarget as HTMLElement).style.backgroundColor = '#F4F5F7'; }}
                      onMouseLeave={e => { if (filterSF !== opt) (e.currentTarget as HTMLElement).style.backgroundColor = filterSF === opt ? '#E9F2FF' : 'white'; }}
                    >
                      {opt || 'All SF Objects'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <AddButton
            onAddFolder={openCreateFolderModal}
            onAddReport={openCreateReportModal}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <table className="report-table">
        <thead>
          <tr>
            <SortHeader label="Name" field="name" {...sortProps} />
            {!hasOnlyFolders && <SortHeader label="Salesforce Object" field="salesforceObject" {...sortProps} />}
            {!hasOnlyFolders && <SortHeader label="ServiceNow Table" field="serviceNowObject" {...sortProps} />}
            <SortHeader label="Description" field="description" {...sortProps} />
            <SortHeader label="Visibility" field="isPublic" {...sortProps} />
            <SortHeader label="Your Access" field="userRole" {...sortProps} />
            <SortHeader label="Created Date" field="createdDate" {...sortProps} />

            <th className="actions-col"></th>
          </tr>
        </thead>
        <tbody>
          {sortedReports.length > 0 ? sortedReports.map(report => (
            <tr key={report.id} >
              <td>
                <span
                  onClick={() => handleNavigate(report)}
                  style={{ color: '#0052cc', cursor: 'pointer', fontWeight: 500 }}
                >
                  {report.isFolder ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <AiFillFolder size={15} />
                      <span>{report.name}</span>
                    </div>
                  ) : (
                    <span>{report.name}</span>
                  )}
                </span>
              </td>
              {!hasOnlyFolders && <td>{report.salesforceObject ?? ''}</td>}
              {!hasOnlyFolders && <td>{report.serviceNowObject ?? ''}</td>}
              <td>{report.description ?? ''}</td>
              <td><VisibilityPill isPublic={report.isPublic} /></td>
              <td>{report.userRole && <RolePill role={report.userRole} />}</td>
              <td>{report.createdDate ? new Date(report.createdDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</td>

              <td className="actions-col">
                <button className="dots-btn" onClick={e => openMenu(e, report.id)} title="Actions">
                  •••
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={hasOnlyFolders ? 6 : 8} style={{ padding: '30px', textAlign: 'center', color: '#6B778C' }}>
                No reports found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ── Context menu portal ── */}
      {openMenuId && menuPosition && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={closeMenu} />
          <div
            className="context-menu"
            style={{ top: menuPosition.top, left: menuPosition.left }}
            onClick={e => e.stopPropagation()}
          >
            {getMenuItems(sortedReports.find(r => r.id === openMenuId)!).map((item, i) =>
              'divider' in item ? (
                <div key={`divider-${i}`} className="context-menu-divider" />
              ) : (
                <div
                  key={item.id}
                  className={`context-menu-item${item.id === 'delete' ? ' danger' : ''}`}
                  style={{ color: item.color }}
                  onClick={() => { item.onClick?.(); closeMenu(); }}
                >
                  {item.icon}
                  {item.label}
                </div>
              )
            )}
          </div>
        </>,
        document.body
      )}

      {/* ── Share modal ── */}
      <ShareModal
        isOpen={!!shareModalItem}
        onClose={() => setShareModalItem(null)}
        itemId={shareModalItem?.id ?? ''}
        itemType={shareModalItem?.isFolder ? 'folder' : 'report'}
        itemName={shareModalItem?.name ?? ''}
      />
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const filterInputStyle: React.CSSProperties = {
  padding: '7px 10px',
  border: '1px solid #DFE1E6',
  borderRadius: 4,
  fontSize: 13,
  color: '#172B4D',
  outline: 'none',
  width: 200,
  backgroundColor: 'white',
};

const filterSelectStyle: React.CSSProperties = {
  padding: '7px 10px',
  borderRadius: 4,
  fontSize: 13,
  color: '#172B4D',
  outline: 'none',
  backgroundColor: 'white',
  cursor: 'pointer',
  userSelect: 'none',
};

const filterDropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  backgroundColor: 'white',
  border: '1px solid #DFE1E6',
  borderRadius: 4,
  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  zIndex: 200,
  minWidth: '100%',
  maxHeight: 220,
  overflowY: 'auto',
};

const filterDropdownItemStyle: React.CSSProperties = {
  padding: '9px 14px',
  fontSize: 13,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

export default ReportList;