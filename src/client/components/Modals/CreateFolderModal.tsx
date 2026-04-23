import React, { useState} from 'react';
import type {ChangeEvent, FormEvent } from 'react'
import type { Folder } from '../../interfaces'
// Define the folder type


// Define props type
interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, parentId: string, description: string) => void;
  folders: Folder[];
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ isOpen, onClose, onCreate, folders }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [parentId, setParentId] = useState<string>('root');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(name, parentId, description);
    setName('');
    setDescription('');
    onClose();
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value);
  const handleParentChange = (e: ChangeEvent<HTMLSelectElement>) => setParentId(e.target.value);

  return (
    <div style={overlayStyle}>
		<div style={modalStyle}>
			<h3 style={{ margin: '0 0 15px 0' }}>New Folder</h3>
			<form onSubmit={handleSubmit}>
			<div style={fieldStyle}>
				<label style={labelStyle}>Folder Name:</label>
				<input 
				autoFocus
				type="text"
				value={name}
				onChange={handleNameChange}
				required
				style={inputStyle}
				placeholder="e.g. Sprint Reports"
				/>
			</div>
			<div style={fieldStyle}>
				<label style={labelStyle}>Parent Folder:</label>
				<select
				value={parentId}
				onChange={handleParentChange}
				style={inputStyle}
				>
					<option value="root">All Reports (Root)</option>
					{folders.map(f => (
						<option key={f.id} value={f.id}>{f.name}</option>
					))}
				</select>
			</div>
			<div style={fieldStyle}>
				<label style={labelStyle}>Description:</label>
				<input 
				autoFocus
				type="text"
				value={description}
				onChange={handleDescriptionChange}
				style={inputStyle}
				placeholder="e.g. Sprint Reports"
				/>
			</div>
			<div style={actionsStyle}>
				<button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
				<button type="submit" style={saveBtnStyle}>Create</button>
			</div>
			</form>
		</div>
    </div>
  );
};

// Styles (can be moved to CSS if desired)
const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(9, 30, 66, 0.54)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalStyle: React.CSSProperties = { backgroundColor: 'white', fontFamily: 'sans-serif', padding: '24px', borderRadius: '3px', width: '25%', boxShadow: '0 8px 16px -4px rgba(9, 30, 66, 0.25), 0 0 1px rgba(9, 30, 66, 0.31)' };
const fieldStyle: React.CSSProperties = { marginBottom: '15px' };
const labelStyle: React.CSSProperties = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#42526E', marginBottom: '4px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 6px', borderRadius: '3px', border: '1px solid #DFE1E6', backgroundColor: '#FAFBFC', fontSize: '14px', boxSizing: 'border-box' };
const actionsStyle: React.CSSProperties = { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' };
const saveBtnStyle: React.CSSProperties = { padding: '8px 12px', backgroundColor: '#0052CC', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 500 };
const cancelBtnStyle: React.CSSProperties = { padding: '8px 12px', backgroundColor: 'transparent', color: '#42526E', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 500 };

export default CreateFolderModal;