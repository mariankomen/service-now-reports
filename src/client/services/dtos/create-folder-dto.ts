export interface CreateFolderDto{
    name: string;
    parent_folder_id: string;
    uniqueid?: string;
    description?: string;
    is_public: boolean;
    [key: string]: any;
}