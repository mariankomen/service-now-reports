import { useState, useEffect, useCallback, useRef } from 'react';
import folderService from '../services/ServiceNow/folder-service';
import type { Folder } from '../interfaces';
import type { CreateFolderDto } from '../services/dtos';
import type { UpdateFolderDto } from '../services/ServiceNow/folder-service';

export type FolderType =
  | 'rootfolders'
  | 'createdbymefolders'
  | 'sharedwithmefolders'
  | 'publicfolders';

interface UseFoldersParams {
  type?: FolderType;
  folderId?: string;
}

export function useFolders(params: UseFoldersParams) {
  const { type, folderId } = params;

  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Requests started for an older tab must never overwrite newer results
  const requestIdRef = useRef(0);

  const fetchFolders = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const isCurrent = () => requestId === requestIdRef.current;

    setLoading(true);
    setError(null);
    try {
      const data = await folderService.getFolders({ type, folderId });
      if (isCurrent()) setFolders(data);
    } catch (err: any) {
      if (isCurrent()) setError(err.message || 'Unknown error');
    } finally {
      if (isCurrent()) setLoading(false);
    }
  }, [type, folderId]);

  const createFolder = async (dto: CreateFolderDto) => {
    await folderService.create(dto);
    await fetchFolders();
  };

  const updateFolder = async (dto: UpdateFolderDto) => {
    await folderService.updateFolder(dto);
    await fetchFolders();
  };
  const deleteFolder = async (folderId: string) => {
    await folderService.deleteFolder(folderId);
    await fetchFolders();
  };
  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return {
    folders,
    loading,
    error,
    createFolder,
    updateFolder,
    refreshFolders: fetchFolders,
    deleteFolder
  };
}