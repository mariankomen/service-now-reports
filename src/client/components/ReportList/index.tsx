import React, { type CSSProperties } from 'react';
import type { Folder, Report } from '../../interfaces';
import type { ReportListItem } from '../../interfaces';
import {AiFillFolder} from 'react-icons/ai';
import AddButton from '../AddButton'
interface ReportListProps {
  reports: ReportListItem[];
  folderName: string;
  onOpenReport: (report: Report | Folder) => void;
  openCreateFolderModal: () => void;
  openCreateReportModal: () => void;
}

const ReportList: React.FC<ReportListProps> = ({ reports, folderName, onOpenReport, openCreateFolderModal, openCreateReportModal }) => {
	const thStyle: CSSProperties = { textAlign: 'left', padding: '6px 10px', fontSize: '12px', color: '#5E6C84', textTransform: 'uppercase', borderBottom: '2px solid #dfe1e6', backgroundColor: '#FAFBFC' };
	const tdStyle: CSSProperties = { padding: '6px 10px', fontSize: '14px', color: '#172B4D', borderBottom: '1px solid #dfe1e6' };
	const actionBtnStyle: CSSProperties = { padding: '4px 8px', backgroundColor: 'transparent', border: '1px solid #dfe1e6', borderRadius: '3px', cursor: 'pointer', color: '#42526E' };
	
	return (
    <div style={{ padding: '24px', height: '100%', overflowY: 'auto', boxSizing: 'border-box', fontFamily: 'sans-serif'}}>
		<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
			<h1 style={{ margin: '0 0 20px 0', fontSize: '24px', color: '#172B4D', position:'relative', display: 'inline-block' }}>{folderName}</h1>
			<div style={{display: 'flex', gap: '12px', fontSize: '14px'}}>
				<AddButton
					onAddFolder={() => openCreateFolderModal()}
					onAddReport={() => openCreateReportModal()}
				/>
			</div>
			

		</div>
		
		<table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
			<thead>
			<tr>
				<th style={thStyle}>Report Name</th>
				<th style={thStyle}>Description</th>
				<th style={thStyle}>Folder</th>
				<th style={thStyle}>Created Date</th>
				<th style={thStyle}>Actions</th>
			</tr>
			</thead>
			<tbody>
			{reports && reports.length > 0 ? reports.map(report => (
				<tr key={report.id}>
				<td style={tdStyle}>
					<span 
					onClick={() => onOpenReport(report)}
					style={{ color: '#0052cc', cursor: 'pointer', fontWeight: 500, textDecoration: 'none' }}
					>
					<div className="report-row">
					{report.isFolder ? (
						<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
						<AiFillFolder size={15} />
						<span>{report.name}</span>
						</div>
					) : (
						<span>{report.name}</span>
					)}
					</div>
					</span>
				</td>
				<td style={tdStyle}>
					<span>{report.description ?? ''}</span>
				</td>
				<td style={tdStyle}>
					<span>{report.folderName ?? ''}</span>
				</td>
				<td style={tdStyle}>
					{report.createdDate ? new Date(report.createdDate).toLocaleDateString() : '-'}
				</td>
				<td style={tdStyle}>
					<button onClick={() => onOpenReport(report)} style={actionBtnStyle}>Open</button>
				</td>
				</tr>
			)) : (
				<tr>
				<td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: '#6B778C' }}>
					No reports found in this folder.
				</td>
				</tr>
			)}
			</tbody>
		</table>
		</div>
  );
};

export default ReportList;