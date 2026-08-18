import React from 'react';
import './sidebar.css';
import {
  AiOutlineClockCircle,
  AiOutlineUser,
  AiOutlineShareAlt,
  AiOutlineLock,
  AiOutlineUnlock,
  AiOutlineMenuUnfold,
  AiOutlineFolder,
  AiOutlineStar,
} from 'react-icons/ai';

interface SidebarProps {
  activeTabId: string;
  onNavigate: (tabId: string, tabName: string) => void;
  onOpenFolderModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTabId, onNavigate, onOpenFolderModal }) => {
  const item = (id: string) => `sidebar-item${activeTabId === id ? ' active' : ''}`;

  return (
    <div className="sidebar">
      <div className="sidebar-scroll">

        <div className="sidebar-section">
          <p className="sidebar-section-header">Reports</p>
          <div className={item('recentreports')} onClick={() => onNavigate('recentreports', 'Recent')}>
            <AiOutlineClockCircle size={15} /> Recent
          </div>
          <div className={item('createdbymereports')} onClick={() => onNavigate('createdbymereports', 'Created by Me')}>
            <AiOutlineUser size={15} /> Created by Me
          </div>
          <div className={item('sharedwithmereports')} onClick={() => onNavigate('sharedwithmereports', 'Shared with Me')}>
            <AiOutlineShareAlt size={15} /> Shared with Me
          </div>
          <div className={item('privatereports')} onClick={() => onNavigate('privatereports', 'Private Reports')}>
            <AiOutlineLock size={15} /> Private Reports
          </div>
          <div className={item('publicreports')} onClick={() => onNavigate('publicreports', 'Public Reports')}>
            <AiOutlineUnlock size={15} /> Public Reports
          </div>
          <div className={item('rootreports')} onClick={() => onNavigate('rootreports', 'All Reports')}>
            <AiOutlineMenuUnfold size={15} /> All Reports
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title-row">
            <p className="sidebar-section-header">Folders</p>
            <button className="sidebar-add-btn" onClick={onOpenFolderModal}>+</button>
          </div>
          <div className={item('rootfolders')} onClick={() => onNavigate('rootfolders', 'All Folders')}>
            <AiOutlineFolder size={15} /> All Folders
          </div>
          <div className={item('createdbymefolders')} onClick={() => onNavigate('createdbymefolders', 'Created by Me')}>
            <AiOutlineUser size={15} /> Created by Me
          </div>
          <div className={item('sharedwithmefolders')} onClick={() => onNavigate('sharedwithmefolders', 'Shared with Me')}>
            <AiOutlineShareAlt size={15} /> Shared with Me
          </div>
          <div className={item('publicfolders')} onClick={() => onNavigate('publicfolders', 'Public Folders')}>
            <AiOutlineUnlock size={15} /> Public Folders
          </div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-section-header">Favorites</p>
          <div className={item('favorites')} onClick={() => onNavigate('favorites', 'My Favorites')}>
            <AiOutlineStar size={15} /> My Favorites
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sidebar;