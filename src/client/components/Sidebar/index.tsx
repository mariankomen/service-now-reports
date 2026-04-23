import React from 'react';
import type { CSSProperties } from 'react'
import { AiOutlineClockCircle, AiOutlineUser, AiOutlineShareAlt, AiOutlineLock, AiOutlineUnlock, AiOutlineMenuUnfold, AiOutlineFolder, AiOutlineStar } from 'react-icons/ai';
// Props type
interface SidebarProps {
  activeTabId: string;
  onNavigate: (tabId: string, tabName: string) => void;
  onOpenFolderModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTabId, onNavigate, onOpenFolderModal }) => {
  const sectionStyle: CSSProperties = { marginBottom: '20px' };
  const sectionHeaderStyle: CSSProperties = { padding: '0 4x', margin: '0 0 8px 0', fontSize: '14px', textTransform: 'uppercase', color: '#5E6C84', fontWeight: 'bold' };

  const getItemStyle = (isActive: boolean): CSSProperties => ({
    padding: '8px 16px',
    cursor: 'pointer',
    backgroundColor: isActive ? '#E9F2FF' : 'transparent',
    color: isActive ? '#0052cc' : '#000',
    borderLeft: isActive ? '3px solid #0052cc' : '3px solid transparent',
    fontSize: '13px',
    alignItems: 'center',
    gap: '8px',
    display: 'flex'
  });

  return (
    <div style={{ fontFamily:'sans-serif', width: '240px', backgroundColor: '#F4F5F7', borderRight: '1px solid #dfe1e6', display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0 }}>
      	<div style={{ flex: 1, overflowY: 'auto' }}>
        
			<div style={sectionStyle}>
				<p style={sectionHeaderStyle}>Reports</p>
				<div 
					style={getItemStyle(activeTabId === 'recentreports')} 
					onClick={() => onNavigate('recentreports', 'Recent')}
				>
					<AiOutlineClockCircle size={15} /> Recent
				</div>
				<div 
					style={getItemStyle(activeTabId === 'createdbymereports')} 
					onClick={() => onNavigate('createdbymereports', 'Created by Me')}
				>
					<AiOutlineUser size={15} /> Created by Me
				</div>
				<div 
					style={getItemStyle(activeTabId === 'sharedwithmereports')} 
					onClick={() => onNavigate('sharedwithmereports', 'Shared with Me')}
				>
					<AiOutlineShareAlt size={15} /> Shared with Me
				</div>
				<div 
					style={getItemStyle(activeTabId === 'privatereports')} 
					onClick={() => onNavigate('privatereports', 'Private Reports')}
				>
					<AiOutlineLock size={15} /> Private Reports
				</div>
				<div 
					style={getItemStyle(activeTabId === 'publicreports')} 
					onClick={() => onNavigate('publicreports', 'Public Reports')}
				>
					<AiOutlineUnlock size={15} /> Public Reports
				</div>
				<div 
					style={getItemStyle(activeTabId === 'rootreports')} 
					onClick={() => onNavigate('rootreports', 'All Reports')}
				>
					<AiOutlineMenuUnfold size={15} /> All Reports
				</div>
			</div>

			<div style={sectionStyle}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '16px' }}>
					<p style={sectionHeaderStyle}>Folders</p>
					<span onClick={onOpenFolderModal} style={{ cursor: 'pointer', fontSize: '16px', color: '#5E6C84' }}>+</span>
				</div>
				<div 
					style={getItemStyle(activeTabId === 'rootfolders')} 
					onClick={() => onNavigate('rootfolders', 'All Folders')}
				>
					<AiOutlineFolder size={15} /> All Folders
				</div>
				<div 
					style={getItemStyle(activeTabId === 'createdbymefolders')} 
					onClick={() => onNavigate('createdbymefolders', 'Created by Me')}
				>
					<AiOutlineUser size={15} /> Created by Me
				</div>
				<div 
					style={getItemStyle(activeTabId === 'sharedwithmefolders')} 
					onClick={() => onNavigate('sharedwithmefolders', 'Shared with Me')}
				>
					<AiOutlineShareAlt size={15} /> Shared with Me
				</div>
				<div 
					style={getItemStyle(activeTabId === 'publicfolders')} 
					onClick={() => onNavigate('publicfolders', 'Public Folders')}
				>
					<AiOutlineUnlock size={15} /> Public Folders
				</div>
			</div>
			<div style={sectionStyle}>
				<p style={sectionHeaderStyle}>Favorites</p>
				<div 
					style={getItemStyle(activeTabId === 'favorites')} 
					onClick={() => onNavigate('favorites', 'My Favorites')}
				>
					<AiOutlineStar size={15} /> My Favorites
				</div>
			</div>

      	</div>
    </div>
  );
};

export default Sidebar;