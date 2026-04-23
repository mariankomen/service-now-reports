// src/interfaces/folder.ts
export interface Folder {
  id: string;
  name: string;
  uniqueid?: string;
  folderid?: string;
  parent_folder_id?: string;
  description?: string;
  createdDate: string;
}