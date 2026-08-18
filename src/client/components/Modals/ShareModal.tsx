import React, { useState, useEffect, useRef } from 'react';
import shareService, { type ShareRecord, type ShareRole, type ShareItemType, type SysUser } from '../../services/ServiceNow/share-service';
import { successToast, errorToast } from '../../utils/toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemType: ShareItemType;
  itemName: string;
}

const ROLES: { value: ShareRole; label: string; description: string }[] = [
  { value: 'viewer',  label: 'Viewer',  description: 'Can view and run' },
  { value: 'editor',  label: 'Editor',  description: 'Can view, run and edit' },
  { value: 'manager', label: 'Manager', description: 'Full access + manage sharing' },
];

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, itemId, itemType, itemName }) => {
  const [shares, setShares]               = useState<ShareRecord[]>([]);
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchResults, setSearchResults] = useState<SysUser[]>([]);
  const [selectedUser, setSelectedUser]   = useState<SysUser | null>(null);
  const [selectedRole, setSelectedRole]   = useState<ShareRole>('viewer');
  const [loadingShares, setLoadingShares] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingAdd, setLoadingAdd]       = useState(false);
  const [showDropdown, setShowDropdown]   = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // ─── Load existing shares on open ────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;
    loadShares();
  }, [isOpen, itemId]);

  const loadShares = async () => {
    setLoadingShares(true);
    try {
      const data = await shareService.getShares(itemId, itemType);
      setShares(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingShares(false);
    }
  };

  // ─── Search users with debounce ───────────────────────────────────────────

  useEffect(() => {
    if (!searchQuery.trim() || selectedUser) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const results = await shareService.searchUsers(searchQuery);
        // Filter out users already shared
        const existingIds = shares.map(s => s.user_id);
        setSearchResults(results.filter(u => !existingIds.includes(u.sys_id)));
        setShowDropdown(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSearch(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, shares]);

  // ─── Close dropdown on outside click ─────────────────────────────────────

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleSelectUser = (user: SysUser) => {
    setSelectedUser(user);
    setSearchQuery(user.name);
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleAdd = async () => {
    if (!selectedUser) return;
    setLoadingAdd(true);
    try {
      await shareService.createShare({ itemId, itemType, userId: selectedUser.sys_id, role: selectedRole });
      await loadShares();
      setSelectedUser(null);
      setSearchQuery('');
      setSelectedRole('viewer');
    } catch (e: any) {
      console.error(e);
      errorToast(e?.message || 'Failed to add user.');
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleRoleChange = async (sysId: string, role: ShareRole) => {
    try {
      await shareService.updateShare(sysId, role);
      setShares(prev => prev.map(s => s.sys_id === sysId ? { ...s, role } : s));
    } catch (e: any) {
      console.error(e);
      errorToast(e?.message || 'Failed to update role.');
    }
  };

  const handleRemove = async (sysId: string) => {
    try {
      await shareService.deleteShare(sysId);
      setShares(prev => prev.filter(s => s.sys_id !== sysId));
    } catch (e: any) {
      console.error(e);
      errorToast(e?.message || 'Failed to remove user.');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div style={headerStyle}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#172B4D' }}>
              Share "{itemName}"
            </div>
            <div style={{ fontSize: 12, color: '#6B778C', marginTop: 2 }}>
              {itemType === 'folder' ? 'Sharing this folder will grant access to all reports inside it.' : ''}
            </div>
          </div>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {/* ── Add user section ── */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #EBECF0' }}>
          <div style={{ display: 'flex', gap: 8 }}>

            {/* Search input */}
            <div ref={searchRef} style={{ position: 'relative', flex: 1 }}>
              <input
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSelectedUser(null); }}
                placeholder="Search by name or email..."
                style={searchInputStyle}
              />
              {loadingSearch && (
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#6B778C' }}>
                  Searching...
                </span>
              )}

              {/* Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div style={dropdownStyle}>
                  {searchResults.map(user => (
                    <div
                      key={user.sys_id}
                      style={dropdownItemStyle}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F4F5F7')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
                      onClick={() => handleSelectUser(user)}
                    >
                      <div style={avatarStyle}>{user.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div style={{ fontSize: 13, color: '#172B4D', fontWeight: 500 }}>{user.name}</div>
                        <div style={{ fontSize: 11, color: '#6B778C' }}>{user.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showDropdown && searchResults.length === 0 && !loadingSearch && searchQuery.trim() && (
                <div style={{ ...dropdownStyle, padding: '10px 14px', fontSize: 13, color: '#6B778C' }}>
                  No users found
                </div>
              )}
            </div>

            {/* Role selector */}
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value as ShareRole)}
              style={roleSelectStyle}
            >
              {ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>

            {/* Add button */}
            <button
              onClick={handleAdd}
              disabled={!selectedUser || loadingAdd}
              style={{
                ...addBtnStyle,
                opacity: !selectedUser || loadingAdd ? 0.5 : 1,
                cursor: !selectedUser || loadingAdd ? 'not-allowed' : 'pointer',
              }}
            >
              {loadingAdd ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>

        {/* ── Existing shares ── */}
        <div style={{ padding: '12px 20px 20px', overflowY: 'auto', maxHeight: 320 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#5E6C84', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.5px' }}>
            People with access
          </div>

          {loadingShares ? (
            <div style={{ textAlign: 'center', padding: 20, color: '#6B778C', fontSize: 13 }}>Loading...</div>
          ) : shares.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20, color: '#6B778C', fontSize: 13 }}>
              Not shared with anyone yet.
            </div>
          ) : (
            shares.map(share => (
              <div key={share.sys_id} style={shareRowStyle}>
                <div style={avatarStyle}>{share.user_name.charAt(0).toUpperCase()}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: '#172B4D', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {share.user_name}
                  </div>
                  <div style={{ fontSize: 11, color: '#6B778C', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {share.user_email}
                  </div>
                </div>
                <select
                  value={share.role}
                  onChange={e => handleRoleChange(share.sys_id, e.target.value as ShareRole)}
                  style={roleSelectStyle}
                >
                  {ROLES.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleRemove(share.sys_id)}
                  style={removeBtnStyle}
                  title="Remove access"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0,
  backgroundColor: 'rgba(9, 30, 66, 0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: 4,
  boxShadow: '0 8px 32px rgba(9, 30, 66, 0.25)',
  width: 520,
  maxWidth: '90vw',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '80vh',
};

const headerStyle: React.CSSProperties = {
  padding: '16px 20px',
  borderBottom: '1px solid #EBECF0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

const closeBtnStyle: React.CSSProperties = {
  background: 'none', border: 'none',
  cursor: 'pointer', fontSize: 16,
  color: '#5E6C84', padding: '0 4px',
};

const searchInputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px',
  border: '1px solid #DFE1E6', borderRadius: 3,
  fontSize: 13, outline: 'none', boxSizing: 'border-box',
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute', top: '100%', left: 0, right: 0,
  backgroundColor: 'white',
  border: '1px solid #DFE1E6', borderRadius: 3,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 10, marginTop: 2,
  maxHeight: 200, overflowY: 'auto',
};

const dropdownItemStyle: React.CSSProperties = {
  padding: '8px 12px', cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 10,
  backgroundColor: 'white',
};

const avatarStyle: React.CSSProperties = {
  width: 32, height: 32, borderRadius: '50%',
  backgroundColor: '#0052CC', color: 'white',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 13, fontWeight: 600, flexShrink: 0,
};

const roleSelectStyle: React.CSSProperties = {
  padding: '7px 8px', border: '1px solid #DFE1E6',
  borderRadius: 3, fontSize: 13, color: '#172B4D',
  backgroundColor: 'white', cursor: 'pointer', outline: 'none',
};

const addBtnStyle: React.CSSProperties = {
  padding: '7px 16px', backgroundColor: '#0052CC',
  color: 'white', border: 'none', borderRadius: 3,
  fontSize: 13, fontWeight: 600, flexShrink: 0,
};

const shareRowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '8px 0', borderBottom: '1px solid #F4F5F7',
};

const removeBtnStyle: React.CSSProperties = {
  background: 'none', border: 'none',
  cursor: 'pointer', color: '#DE350B',
  fontSize: 14, padding: '2px 6px',
  borderRadius: 3, flexShrink: 0,
};

export default ShareModal;