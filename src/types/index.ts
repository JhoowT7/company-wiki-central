
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
  status?: 'published' | 'draft' | 'review' | 'archived';
  priority?: 'low' | 'medium' | 'high';
  excerpt?: string;
  metadata?: {
    createdAt: string;
    updatedAt: string;
    author: string;
  };
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
  icon?: string;
  color?: string;
  path?: string;
  description?: string;
  permissions?: {
    read: string[];
    write: string[];
    delete: string[];
  };
  order?: number;
}

export interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'youtube';
  url: string;
  size?: number;
  folderId?: string;
  uploadedBy: string;
  uploadedAt: string;
  thumbnailUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface CTF {
  id: string;
  name: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  points: number;
  solved: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  url: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Backup {
  id: string;
  name: string;
  description?: string;
  size: number;
  createdAt: string;
  type: 'full' | 'partial' | 'manual';
}
