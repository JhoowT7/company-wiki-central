export type ViewMode = 'dashboard' | 'page' | 'edit' | 'new' | 'settings' | 'categories' | 'ctfs' | 'kanban' | 'table' | 'graph' | 'backup' | 'folders' | 'media' | 'folder-view';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'reader' | 'approver';
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: boolean;
  };
  favorites: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  color?: string;
  parentId?: string;
  path: string;
  description?: string;
  permissions: {
    read: string[];
    write: string[];
    delete: string[];
  };
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
  };
  order: number;
}

export interface Page {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  status: 'draft' | 'published' | 'archived' | 'review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata: {
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    lastEditedBy?: string;
    version: number;
    tags: string[];
    category?: string;
  };
  permissions: {
    read: string[];
    write: string[];
    comment: string[];
  };
  cover?: string;
  excerpt?: string;
  readTime?: number;
  viewCount: number;
  isTemplate: boolean;
  templateCategory?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'youtube';
  size?: number;
  thumbnailUrl?: string;
  duration?: number;
  uploadedBy: string;
  uploadedAt: Date;
  folderId?: string;
}

export interface Comment {
  id: string;
  pageId: string;
  userId: string;
  content: string;
  blockId?: string;
  parentId?: string;
  mentions: string[];
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Version {
  id: string;
  pageId: string;
  content: string;
  title: string;
  version: number;
  createdBy: string;
  createdAt: Date;
  changeDescription?: string;
}

export interface CTF {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: string;
  points: number;
  tags: string[];
  url?: string;
  status: 'available' | 'completed' | 'expired';
  deadline?: Date;
  createdBy: string;
  createdAt: Date;
  completedBy: string[];
  hints: string[];
  imageUrl?: string;
}

export interface KanbanBoard {
  id: string;
  name: string;
  description?: string;
  columns: KanbanColumn[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: {
    read: string[];
    write: string[];
  };
}

export interface KanbanColumn {
  id: string;
  name: string;
  order: number;
  limit?: number;
  color?: string;
  cards: KanbanCard[];
}

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  assignees: string[];
  labels: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  checklist: ChecklistItem[];
  attachments: Attachment[];
  comments: string[];
  pageId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  assignee?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Backup {
  id: string;
  name: string;
  description?: string;
  data: {
    users: User[];
    folders: Folder[];
    pages: Page[];
    comments: Comment[];
    versions: Version[];
    ctfs: CTF[];
    kanbanBoards: KanbanBoard[];
    mediaFiles: MediaFile[];
  };
  createdBy: string;
  createdAt: Date;
  size: number;
  type: 'manual' | 'automatic';
}

export interface DatabaseState {
  users: User[];
  folders: Folder[];
  pages: Page[];
  comments: Comment[];
  versions: Version[];
  ctfs: CTF[];
  kanbanBoards: KanbanBoard[];
  backups: Backup[];
  mediaFiles: MediaFile[];
}
