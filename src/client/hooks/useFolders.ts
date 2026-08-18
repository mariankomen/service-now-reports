import { useState, useEffect, useCallback } from 'react';
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

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await folderService.getFolders({ type, folderId });
      setFolders(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
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