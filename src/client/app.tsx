import { useState, useMemo } from 'react';
import { CreateFolderModal } from './components/Modals';
import { CreateReportModal } from './components/Modals';
import ReportList from './components/ReportList';
import Sidebar from './components/Sidebar';
import {type FolderType, useFolders } from './hooks/useFolders';
import {type ReportType, useReports } from './hooks/useReports';
import  { type ReportListItem } from './interfaces';
import ReportBuilder from './components/ReportBuilder/ReportBuilder';
import {type FilterConfig} from './components/ReportBuilder/ReportBuilder'
import AuthScreen from './components/AuthScreen';
import toast, { Toaster } from 'react-hot-toast';


export default function App() {
	const [authorized, setAuthorized] = useState(false);
	const [viewMode, setViewMode] = useState('list'); 
	const [activeReport, setActiveReport] = useState<
	{ name?: string; config?: Partial<FilterConfig> } | null
	>(null);
	const [activeTabId, setActiveTabId] = useState('recentreports');
	const [activeTabName, setActiveTabName] = useState('Recent');
	const isFolderType = [
		'rootfolders',
		'createdbymefolders',
		'sharedwithmefolders',
		'publicfolders'
	].includes(activeTabId);
	const isReportType = [
		'rootreports',
		'createdbymereports',
		'sharedwithmereports',
		'publicreports'
	].includes(activeTabId);

	const { folders, createFolder, refreshFolders } = useFolders({
		type: isFolderType ? activeTabId as FolderType: undefined,
		folderId: isFolderType ? undefined : activeTabId
	});
	const { reports, createReport, refreshReports } = useReports({
		type: isReportType ? activeTabId as ReportType: undefined,
		folderId: isReportType ? undefined : activeTabId
	});
	// const [reports, setReports] = useState<Report[]>([]);

	const listViewItems: ReportListItem[] = useMemo(() => {
		const folderItems: ReportListItem[] = folders.map(f => ({
			id: f.id,
			name: f.name,
			description: f.description ?? '',
			folderName: f.name,
			createdDate: f.createdDate ?? '', // folders may not have createdAt
			isFolder: true,
		}));

		const reportItems: ReportListItem[] = reports.map(r => ({
			id: r.id,
			name: r.name,
			description: r.description ?? '',
			folderName: '',
			createdDate: r.createdDate ?? '',
			isFolder: false,
		}));
		const data = [...folderItems, ...reportItems];
		return data;
	}, [folders, reports]);

	

	const [isFolderModalOpen, setFolderModalOpen] = useState(false);
	const [isReportModalOpen, setReportModalOpen] = useState(false);
	
	const handleCreateFolder = async (name: string, parentId: string, description: string) => {
		await createFolder({ name, parent_folder_id: parentId, description });
	};
	const handleCreateReport = async (name: string, parentId: string, description: string) => {
		await createReport({ name, folderid: parentId, description });
		setViewMode('builder');
	};
	const handleSidebarNavigate = async (id : string, name : string) => {
		setActiveTabId(id);
		setActiveTabName(name);
	}
	const handleOpenReport = async (report: ReportListItem) => {
		const reportId = report.id;
		
	}
	const handleBackToExplorer = () => {
		setViewMode('list');
		setActiveReport(null);
	};

	const handleSaveReportConfig = async (newConfig: any) => {
		if (!activeReport) return;
		// const newTree = updateReportInTree(tree, activeReport.id, newConfig);
		// setTree(newTree);
		// await saveReportsTree(newTree);
		// alert('Report saved!');
	};

	return (
		<>
			<div><Toaster position="top-right"/></div>
			Hi1121212123
			{!authorized ? (
				<AuthScreen onAuthorized={() => setAuthorized(true)}/>
			) : (
				<div style={{ width: '100%', display: 'flex', fontFamily: 'sans-serif' }}>
			
				{viewMode === 'list' && (
					<Sidebar
						activeTabId={activeTabId}
						onNavigate={(id, name) => handleSidebarNavigate(id, name)}
						onOpenFolderModal={() => setFolderModalOpen(true)}
					/>
				)}
				

				<div style={{ width: '100%' }}>
					{viewMode === 'list' ? (
					<ReportList
						reports={listViewItems}
						folderName={activeTabName}
						onOpenReport={({id, name}) => handleSidebarNavigate(id, name)}
						openCreateFolderModal={() => setFolderModalOpen(true)}
						openCreateReportModal={() => setReportModalOpen(true)}
					/>
					) : (
						<ReportBuilder
							report={activeReport ?? undefined}
							onBack={handleBackToExplorer}
							onSave={handleSaveReportConfig}
						/>
					)}
					
				</div>

				<CreateFolderModal
					isOpen={isFolderModalOpen}
					onClose={() => setFolderModalOpen(false)}
					onCreate={handleCreateFolder}
					folders={folders}
				/>
				<CreateReportModal
					isOpen={isReportModalOpen}
					onClose={() => setReportModalOpen(false)}
					onCreate={handleCreateReport}
					folders={folders}
				/>
				</div>
			)}
		</>
		
	);
}