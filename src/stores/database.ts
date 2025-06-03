
import { DatabaseState, Folder, Page, User, CTF, KanbanBoard, Backup, MediaFile } from '@/types';

// Interface para Categoria
interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sistema de banco de dados em memória
class DatabaseManager {
  private data: DatabaseState & { categories: Category[] } = {
    users: [],
    folders: [],
    pages: [],
    comments: [],
    versions: [],
    ctfs: [],
    kanbanBoards: [],
    backups: [],
    mediaFiles: [],
    categories: []
  };

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initializeWithUser();
  }

  // Subscription para atualizações
  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(callback => callback());
  }

  // Inicializar apenas com usuário admin
  private initializeWithUser() {
    this.data.users = [
      {
        id: 'user-1',
        name: 'Admin User',
        email: 'admin@company.com',
        role: 'admin',
        preferences: { theme: 'dark', language: 'pt-BR', notifications: true },
        favorites: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Todos os outros arrays começam vazios
    this.data.folders = [];
    this.data.pages = [];
    this.data.ctfs = [];
    this.data.mediaFiles = [];
    this.data.backups = [];
    this.data.comments = [];
    this.data.versions = [];
    this.data.kanbanBoards = [];
    this.data.categories = [];
  }

  // Métodos CRUD para Categorias
  getCategories(): Category[] {
    return this.data.categories;
  }

  createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category {
    const newCategory: Category = {
      ...category,
      id: `category-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.categories.push(newCategory);
    this.notify();
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.data.categories[index] = {
      ...this.data.categories[index],
      ...updates,
      updatedAt: new Date()
    };
    this.notify();
    return this.data.categories[index];
  }

  deleteCategory(id: string): boolean {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.data.categories.splice(index, 1);
    this.notify();
    return true;
  }

  // Métodos CRUD para Pastas
  getFolders(): Folder[] {
    return this.data.folders;
  }

  createFolder(folder: Omit<Folder, 'id' | 'metadata'>): Folder {
    const newFolder: Folder = {
      ...folder,
      id: `folder-${Date.now()}`,
      metadata: {
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: folder.path.split('/').filter(Boolean)
      }
    };
    this.data.folders.push(newFolder);
    this.notify();
    return newFolder;
  }

  updateFolder(id: string, updates: Partial<Folder>): Folder | null {
    const index = this.data.folders.findIndex(f => f.id === id);
    if (index === -1) return null;
    
    this.data.folders[index] = {
      ...this.data.folders[index],
      ...updates,
      metadata: {
        ...this.data.folders[index].metadata,
        updatedAt: new Date()
      }
    };
    this.notify();
    return this.data.folders[index];
  }

  deleteFolder(id: string): boolean {
    const index = this.data.folders.findIndex(f => f.id === id);
    if (index === -1) return false;
    
    this.data.folders.splice(index, 1);
    this.notify();
    return true;
  }

  // Métodos CRUD para Páginas
  getPages(): Page[] {
    return this.data.pages;
  }

  createPage(pageData: {
    title: string;
    content: string;
    folderId?: string;
    status?: Page['status'];
    priority?: Page['priority'];
    tags?: string[];
    category?: string;
  }): Page {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      title: pageData.title,
      content: pageData.content,
      folderId: pageData.folderId,
      status: pageData.status || 'draft',
      priority: pageData.priority || 'medium',
      metadata: {
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        tags: pageData.tags || [],
        category: pageData.category
      },
      permissions: { read: ['*'], write: ['admin'], comment: ['*'] },
      viewCount: 0,
      isTemplate: false
    };
    this.data.pages.push(newPage);
    this.notify();
    return newPage;
  }

  updatePage(id: string, updates: Partial<Page>): Page | null {
    const index = this.data.pages.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.data.pages[index] = {
      ...this.data.pages[index],
      ...updates,
      metadata: {
        ...this.data.pages[index].metadata,
        updatedAt: new Date(),
        version: this.data.pages[index].metadata.version + 1
      }
    };
    this.notify();
    return this.data.pages[index];
  }

  deletePage(id: string): boolean {
    const index = this.data.pages.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.data.pages.splice(index, 1);
    this.notify();
    return true;
  }

  // Métodos para CTFs
  getCTFs(): CTF[] {
    return this.data.ctfs;
  }

  createCTF(ctf: Omit<CTF, 'id' | 'createdAt' | 'completedBy'>): CTF {
    const newCTF: CTF = {
      ...ctf,
      id: `ctf-${Date.now()}`,
      createdAt: new Date(),
      completedBy: []
    };
    this.data.ctfs.push(newCTF);
    this.notify();
    return newCTF;
  }

  updateCTF(id: string, updates: Partial<CTF>): CTF | null {
    const index = this.data.ctfs.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.data.ctfs[index] = { ...this.data.ctfs[index], ...updates };
    this.notify();
    return this.data.ctfs[index];
  }

  deleteCTF(id: string): boolean {
    const index = this.data.ctfs.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.data.ctfs.splice(index, 1);
    this.notify();
    return true;
  }

  // Métodos para Mídia
  getMediaFiles(): MediaFile[] {
    return this.data.mediaFiles;
  }

  createMediaFile(media: Omit<MediaFile, 'id' | 'uploadedAt'>): MediaFile {
    const newMedia: MediaFile = {
      ...media,
      id: `media-${Date.now()}`,
      uploadedAt: new Date()
    };
    this.data.mediaFiles.push(newMedia);
    this.notify();
    return newMedia;
  }

  deleteMediaFile(id: string): boolean {
    const index = this.data.mediaFiles.findIndex(m => m.id === id);
    if (index === -1) return false;
    
    this.data.mediaFiles.splice(index, 1);
    this.notify();
    return true;
  }

  // Sistema de Backup
  createBackup(name: string, description?: string): Backup {
    const backup: Backup = {
      id: `backup-${Date.now()}`,
      name,
      description,
      data: JSON.parse(JSON.stringify(this.data)), // Deep clone
      createdBy: 'user-1',
      createdAt: new Date(),
      size: JSON.stringify(this.data).length,
      type: 'manual'
    };
    
    this.data.backups.push(backup);
    this.notify();
    return backup;
  }

  getBackups(): Backup[] {
    return this.data.backups;
  }

  restoreBackup(backupId: string): boolean {
    const backup = this.data.backups.find(b => b.id === backupId);
    if (!backup) return false;
    
    // Manter apenas os backups
    const currentBackups = this.data.backups;
    this.data = JSON.parse(JSON.stringify(backup.data));
    this.data.backups = currentBackups;
    
    this.notify();
    return true;
  }

  exportBackup(backupId: string): string {
    const backup = this.data.backups.find(b => b.id === backupId);
    if (!backup) throw new Error('Backup não encontrado');
    
    return JSON.stringify(backup, null, 2);
  }

  deleteBackup(id: string): boolean {
    const index = this.data.backups.findIndex(b => b.id === id);
    if (index === -1) return false;
    
    this.data.backups.splice(index, 1);
    this.notify();
    return true;
  }

  // Busca avançada
  search(query: string, filters?: {
    type?: 'pages' | 'folders' | 'ctfs';
    folderId?: string;
    tags?: string[];
    status?: string;
  }): any[] {
    const results: any[] = [];
    const lowerQuery = query.toLowerCase();
    
    if (!filters?.type || filters.type === 'pages') {
      const pageResults = this.data.pages.filter(page => 
        page.title.toLowerCase().includes(lowerQuery) ||
        page.content.toLowerCase().includes(lowerQuery) ||
        page.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
      results.push(...pageResults.map(p => ({ ...p, type: 'page' })));
    }
    
    if (!filters?.type || filters.type === 'folders') {
      const folderResults = this.data.folders.filter(folder =>
        folder.name.toLowerCase().includes(lowerQuery) ||
        folder.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
      results.push(...folderResults.map(f => ({ ...f, type: 'folder' })));
    }
    
    if (!filters?.type || filters.type === 'ctfs') {
      const ctfResults = this.data.ctfs.filter(ctf =>
        ctf.title.toLowerCase().includes(lowerQuery) ||
        ctf.description.toLowerCase().includes(lowerQuery) ||
        ctf.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
      results.push(...ctfResults.map(c => ({ ...c, type: 'ctf' })));
    }
    
    return results;
  }

  // Estatísticas
  getStats() {
    return {
      totalFolders: this.data.folders.length,
      totalPages: this.data.pages.length,
      totalCTFs: this.data.ctfs.length,
      totalBackups: this.data.backups.length,
      totalMediaFiles: this.data.mediaFiles.length,
      totalCategories: this.data.categories.length,
      recentPages: this.data.pages
        .sort((a, b) => b.metadata.updatedAt.getTime() - a.metadata.updatedAt.getTime())
        .slice(0, 5),
      popularPages: this.data.pages
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 5)
    };
  }
}

export const database = new DatabaseManager();
