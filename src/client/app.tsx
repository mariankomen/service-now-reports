import { useState, useMemo, useRef } from 'react';
import { CreateFolderModal } from './components/Modals';
import { CreateReportModal } from './components/Modals';
import { MoveToFolderModal } from './components/Modals';
import { ConfirmDeleteModal } from './components/Modals';
import ReportList from './components/ReportList';
import Sidebar from './components/Sidebar';
import { type FolderType, useFolders } from './hooks/useFolders';
import { type ReportType, useReports } from './hooks/useReports';
import { useCounts } from './hooks/useCounts';
import { type ReportListItem } from './interfaces';
import type { Report } from './interfaces';
import ReportBuilder from './components/ReportBuilder/ReportBuilder';
import AuthScreen from './components/AuthScreen';
import toast, { Toaster } from 'react-hot-toast';
import ReportService from './services/ServiceNow/report-service';
import { successToast, errorToast } from './utils/toast';
import { addToRecent } from './utils/recent';

const VALID_TABS = ['connection', 'main', 'support', 'privacy'];

export default function App() {
	const urlParams = new URLSearchParams(window.location.search);
    const initialTab = VALID_TABS.includes(urlParams.get('tab') || '')
        ? urlParams.get('tab')!
        : 'connection';

	const [authorized, setAuthorized]         = useState(false);
	const [viewMode, setViewMode]             = useState('list');
	const [activeReportId, setActiveReportId] = useState<string>('');
	const [activeTabId, setActiveTabId]       = useState('recentreports');
	const [activeTabName, setActiveTabName]   = useState('Recent');
	const [openInRunMode, setOpenInRunMode]   = useState(false);
	const [moveReportItem, setMoveReportItem] = useState<ReportListItem | null>(null);
	const [deleteItem, setDeleteItem] = useState<ReportListItem | null>(null);

	// ─── List context to restore on Back from the report builder ──────────────
	const lastListContextRef = useRef<{ id: string; name: string }>({ id: 'recentreports', name: 'Recent' });
	const rememberListContext = () => {
		lastListContextRef.current = { id: activeTabId, name: activeTabName };
	};

	// ─── Modals ───────────────────────────────────────────────────────────────
	const [isFolderModalOpen, setFolderModalOpen]   = useState(false);
	const [isReportModalOpen, setReportModalOpen]   = useState(false);
	const [editFolderItem, setEditFolderItem]       = useState<ReportListItem | null>(null);

	// ─── Tab type detection ───────────────────────────────────────────────────
	const isFolderType = [
		'rootfolders', 'createdbymefolders', 'sharedwithmefolders', 'publicfolders'
	].includes(activeTabId);

	const isReportType = [
		'rootreports', 'createdbymereports', 'sharedwithmereports',
		'publicreports', 'favorites', 'recentreports', 'privatereports'
	].includes(activeTabId);

	// ─── Data hooks ───────────────────────────────────────────────────────────
	const { folders, createFolder, refreshFolders, updateFolder, deleteFolder } = useFolders({
		type: isFolderType ? activeTabId as FolderType : undefined,
		folderId: isFolderType ? undefined : activeTabId,
	});

	const { reports, createReport, refreshReports, deleteReport } = useReports({
		type: isReportType ? activeTabId as ReportType : undefined,
		folderId: isReportType ? undefined : activeTabId,
	});

	// ─── Sidebar item counts ──────────────────────────────────────────────────
	const { counts, refreshCounts } = useCounts();

	// ─── List items ───────────────────────────────────────────────────────────
	const listViewItems: ReportListItem[] = useMemo(() => {
		const folderItems: ReportListItem[] = folders.map(f => ({
			id: f.id,
			name: f.name,
			description: f.description ?? '',
			folderName: f.name,
			createdDate: f.createdDate ?? '',
			isFolder: true,
			userRole: f.userRole,
			isPublic: f.isPublic,
		}));

		const reportItems: ReportListItem[] = reports.map(r => ({
			id: r.id,
			name: r.name,
			description: r.description ?? '',
			folderName: '',
			createdDate: r.createdDate ?? '',
			isFolder: false,
			salesforceObject: r.salesforceObject,
			serviceNowObject: r.serviceNowObject,
			userRole: r.userRole,
			isPublic: r.isPublic,
		}));

		return [...folderItems, ...reportItems];
	}, [folders, reports]);

	// ─── Handlers ─────────────────────────────────────────────────────────────

	const handleCreateFolder = async (name: string, parentId: string, description: string, isPublic: boolean) => {
		try {
    		await createFolder({ name, parent_folder_id: parentId, description, is_public: isPublic });
			refreshCounts();
		} catch (e: any) {
			errorToast(e?.message || 'Failed to create folder.');
		}
	};

	const handleCreateReport = async (name: string, parentId: string, description: string, salesforceObjectName: string, serviceNowTableName: string, isPublic: boolean) => {
		try {
			const result = await createReport({ name, folderid: parentId, description, salesforceObjectName, serviceNowTableName, isPublic });
			refreshCounts();
			rememberListContext();
			setActiveReportId(result.sys_id);
			setOpenInRunMode(false);
			setViewMode('builder');
		} catch (e: any) {
			errorToast(e?.message || 'Failed to create report.');
		}
	};

	const handleEditFolder = async (name: string, _parentId: string, _description: string, isPublic: boolean) => {
		if (!editFolderItem) return;
		try {
			await updateFolder({ id: editFolderItem.id, name, is_public: isPublic });
			refreshCounts();
			successToast('Folder updated successfully.');
			setEditFolderItem(null);
		} catch (e: any) {
			errorToast(e?.message || 'Failed to update folder.');
		}
	};

	const handleSidebarNavigate = async (id: string, name: string, isFolder: boolean) => {
		if (isFolder) {
			setActiveTabId(id);
			setActiveTabName(name);
		} else {
			const report = reports.find(r => r.id === id);
			addToRecent({
				id,
				name,
				salesforceObject: report?.salesforceObject,
				serviceNowObject: report?.serviceNowObject,
				openedAt: new Date().toISOString(),
			});
			refreshCounts();   // opening a report changes the Recent list
			rememberListContext();
			setActiveTabId(id);
			setActiveTabName(name);
			setViewMode('builder');
			setActiveReportId(id);
		}
	};

	const handleDelete = async () => {
		if (!deleteItem) return;
		try {
			if (deleteItem.isFolder) {
				await deleteFolder(deleteItem.id);
				successToast('Folder deleted successfully.');
			} else {
				await deleteReport(deleteItem.id);
				successToast('Report deleted successfully.');
			}
			refreshCounts();
			setDeleteItem(null);
		} catch (e: any) {
			errorToast(e?.message || 'Failed to delete.');
		}
	};
	const handleRunReport = (report: ReportListItem) => {
		rememberListContext();
		setOpenInRunMode(true);
		setActiveReportId(report.id);
		setViewMode('builder');
	};

	const handleEditReport = (report: ReportListItem) => {
		rememberListContext();
		setOpenInRunMode(false);
		setActiveReportId(report.id);
		setViewMode('builder');
	};

	const handleBackToExplorer = (_folderId: string) => {
		const ctx = lastListContextRef.current;
		setActiveTabId(ctx.id);
		setActiveTabName(ctx.name);
		setViewMode('list');
		setActiveReportId('');
		setOpenInRunMode(false);
		refreshFolders();
		refreshReports();   // name / visibility may have changed in the builder
		refreshCounts();
	};

	const handleSaveReportConfig = async (newConfig: any, reportId: string) => {
		const report: Report = {
			id: reportId,
			name: newConfig.name,
			folderId: 'root',
			description: newConfig.description,
			columns: JSON.stringify(newConfig.selectedFields),
			showChart: newConfig.showChart,
			chartType: newConfig.chartType,
			chartSeriesBy: newConfig?.chartSeriesBy ?? '',
			chartTitle: newConfig?.chartTitle ?? '',
			chartMetric: newConfig?.chartMetric ?? 'count',
			chartValueField: newConfig?.chartValueField ?? '',
			groupBy: JSON.stringify(newConfig?.groupBy),
			showOnlyRecordsWithSalesforce: newConfig?.showOnlyRecordsWithSalesforce,
			chartGroupBy: newConfig?.chartGroupBy,
			filterQuery: newConfig?.filterQuery,
			filterConditions: JSON.stringify(newConfig?.filterConditions ?? []),
			filterLogic: newConfig?.filterLogic ?? '',
			isPublic: newConfig?.isPublic,
		};
		if (!reportId) return;
		try {
			await ReportService.updateReportById(reportId, report);
			refreshCounts();   // visibility change moves the report between Public/Private
			successToast('Report settings updated successfully.');
		} catch (e: any) {
			errorToast(e?.message || 'Failed to save report.');
		}
	};

	const handleMoveReport = async (folderId: string) => {
		if (!moveReportItem) return;
		try {
			await ReportService.updateReportById(moveReportItem.id, { 
				id: moveReportItem.id,
				folderid: folderId 
			} as any);
			successToast('Report moved successfully.');
			setMoveReportItem(null);
			refreshReports();
			refreshCounts();
		} catch (e: any) {
			errorToast(e?.message || 'Failed to move report.');
		}
	};

	return (
		<>
			<div><Toaster position="top-right" /></div>
			{!authorized || ['connection', 'support', 'privacy'].includes(initialTab) ? (
				<AuthScreen onAuthorized={() => setAuthorized(true)} />
			) : (
				<div style={{ width: '100%', height: '100%', display: 'flex', fontFamily: 'sans-serif' }}>

					{viewMode === 'list' && (
						<Sidebar
							activeTabId={activeTabId}
							counts={counts}
							onNavigate={(id, name) => handleSidebarNavigate(id, name, true)}
							onOpenFolderModal={() => setFolderModalOpen(true)}
						/>
					)}

					<div style={{ width: '100%' }}>
						{viewMode === 'list' ? (
							<ReportList
								reports={listViewItems}
								folderName={activeTabName}
								onOpenReport={({ id, name }, isFolder) => handleSidebarNavigate(id, name, isFolder)}
								openCreateFolderModal={() => setFolderModalOpen(true)}
								openCreateReportModal={() => setReportModalOpen(true)}
								onRunReport={handleRunReport}
								onEditReport={handleEditReport}
								onEditFolder={setEditFolderItem}
								onFavoritesChange={refreshCounts}
								onMoveReport={setMoveReportItem}
								onDeleteItem={setDeleteItem}
							/>
						) : (
							<ReportBuilder
								reportId={activeReportId ?? undefined}
								onBack={handleBackToExplorer}
								onSave={handleSaveReportConfig}
								initialRunMode={openInRunMode}
							/>
						)}
					</div>

					{/* ── Create folder modal ── */}
					<CreateFolderModal
						isOpen={isFolderModalOpen}
						onClose={() => setFolderModalOpen(false)}
						onCreate={handleCreateFolder}
						folders={folders}
					/>

					{/* ── Edit folder modal ── */}
					<CreateFolderModal
						isOpen={!!editFolderItem}
						onClose={() => setEditFolderItem(null)}
						onCreate={handleEditFolder}
						folders={folders}
						mode="edit"
						initialValues={editFolderItem ? {
							name: editFolderItem.name,
							isPublic: editFolderItem.isPublic ?? false,
						} : undefined}
					/>

					{/* ── Create report modal ── */}
					<CreateReportModal
						isOpen={isReportModalOpen}
						onClose={() => setReportModalOpen(false)}
						onCreate={handleCreateReport}
						folders={folders}
					/>

					<MoveToFolderModal
						isOpen={!!moveReportItem}
						onClose={() => setMoveReportItem(null)}
						onMove={handleMoveReport}
						reportName={moveReportItem?.name ?? ''}
					/>

					<ConfirmDeleteModal
						isOpen={!!deleteItem}
						onClose={() => setDeleteItem(null)}
						onConfirm={handleDelete}
						itemType={deleteItem?.isFolder ? 'folder' : 'report'}
					/>
				</div>
			)}
		</>
	);
}