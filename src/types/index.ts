
export type ViewMode = 
  | 'dashboard' 
  | 'page' 
  | 'edit' 
  | 'new' 
  | 'settings' 
  | 'categories' 
  | 'ctfs' 
  | 'backup' 
  | 'folders' 
  | 'folder-view' 
  | 'media'
  | 'main-page';

export interface Page {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  isMainPage?: boolean;
  isPublic?: boolean;
  hasPassword?: boolean;
  password?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  children?: Folder[];
  pages?: Page[];
  files?: MediaFile[];
  hasPassword?: boolean;
  password?: string;
  isPublic?: boolean;
  createdAt: string;
}

export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size: number;
  folderId?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
