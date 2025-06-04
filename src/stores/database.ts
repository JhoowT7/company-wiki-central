import { Folder, MediaFile, Page, CTF, Category, Backup } from "@/types";

// Mock data
const initialFolders: Folder[] = [
  {
    id: 'folder-1',
    name: 'Documentos',
    createdAt: new Date().toISOString(),
    children: [],
    pages: [],
    files: [],
    isPublic: true,
    hasPassword: false,
    icon: '📁',
    color: '#3B82F6',
    path: '/documentos',
    description: 'Pasta para documentos gerais',
    permissions: { read: ['*'], write: ['admin'], delete: ['admin'] },
    order: 1,
  },
  {
    id: 'folder-2',
    name: 'Imagens',
    createdAt: new Date().toISOString(),
    children: [],
    pages: [],
    files: [],
    isPublic: true,
    hasPassword: false,
    icon: '🖼️',
    color: '#10B981',
    path: '/imagens',
    description: 'Pasta para imagens e fotos',
    permissions: { read: ['*'], write: ['admin'], delete: ['admin'] },
    order: 2,
  },
  {
    id: 'folder-3',
    name: 'Videos',
    createdAt: new Date().toISOString(),
    children: [],
    pages: [],
    files: [],
    isPublic: true,
    hasPassword: false,
    icon: '🎥',
    color: '#F59E0B',
    path: '/videos',
    description: 'Pasta para vídeos',
    permissions: { read: ['*'], write: ['admin'], delete: ['admin'] },
    order: 3,
  },
  {
    id: 'folder-4',
    name: 'Projetos',
    createdAt: new Date().toISOString(),
    children: [],
    pages: [],
    files: [],
    isPublic: true,
    hasPassword: false,
    icon: '🚀',
    color: '#EF4444',
    path: '/projetos',
    description: 'Pasta para projetos',
    permissions: { read: ['*'], write: ['admin'], delete: ['admin'] },
    order: 4,
  },
  {
    id: 'folder-5',
    name: 'Marketing',
    createdAt: new Date().toISOString(),
    children: [],
    pages: [],
    files: [],
    isPublic: true,
    hasPassword: false,
    icon: '📈',
    color: '#8B5CF6',
    path: '/marketing',
    description: 'Pasta para materiais de marketing',
    permissions: { read: ['*'], write: ['admin'], delete: ['admin'] },
    order: 5,
  }
];

const initialMediaFiles: MediaFile[] = [
  {
    id: 'file-1',
    name: 'imagem_exemplo.jpg',
    type: 'image',
    size: 2048,
    url: 'https://via.placeholder.com/150',
    uploadedBy: 'user-1',
    uploadedAt: new Date().toISOString()
  },
  {
    id: 'file-2',
    name: 'video_exemplo.mp4',
    type: 'video',
    size: 10240,
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    uploadedBy: 'user-1',
    uploadedAt: new Date().toISOString()
  },
  {
    id: 'file-3',
    name: 'audio_exemplo.mp3',
    type: 'audio',
    size: 5120,
    url: 'https://www.w3schools.com/html/horse.mp3',
    uploadedBy: 'user-1',
    uploadedAt: new Date().toISOString()
  },
  {
    id: 'file-4',
    name: 'documento_exemplo.pdf',
    type: 'document',
    size: 4096,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    uploadedBy: 'user-1',
    uploadedAt: new Date().toISOString()
  }
];

type Subscriber = () => void;

class Database {
  private pages: Page[] = [
    {
      id: 'main-page',
      title: 'Página Principal',
      content: '<h1>Bem-vindo ao Wiki Empresarial</h1><p>Esta é a página principal do sistema.</p>',
      isMainPage: true,
      isPublic: true,
      hasPassword: false,
      author: 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      category: 'Principal',
      status: 'published',
      priority: 'high',
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'Admin'
      }
    }
  ];
  private folders: Folder[] = initialFolders;
  private mediaFiles: MediaFile[] = initialMediaFiles;
  private ctfs: CTF[] = [];
  private categories: Category[] = [];
  private backups: Backup[] = [];
  private subscribers: Subscriber[] = [];

  // Subscription system
  subscribe(callback: Subscriber): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback());
  }

  // Stats method
  getStats() {
    return {
      totalPages: this.pages.length,
      totalFolders: this.folders.length,
      totalCTFs: this.ctfs.length,
      totalBackups: this.backups.length,
      totalMediaFiles: this.mediaFiles.length,
      totalCategories: this.categories.length,
      recentPages: this.pages.slice(-5).reverse(),
      popularPages: this.pages.filter(p => p.priority === 'high')
    };
  }

  // Page methods
  createPage(page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Page {
    const newPage: Page = {
      ...page,
      id: `page-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: page.status || 'published',
      priority: page.priority || 'medium',
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: page.author
      }
    };
    this.pages.push(newPage);
    this.notifySubscribers();
    return newPage;
  }

  getPages(): Page[] {
    return this.pages;
  }

  getPagesByFolder(folderId?: string): Page[] {
    return this.pages.filter(page => page.folderId === folderId);
  }

  getMainPage(): Page | undefined {
    return this.pages.find(page => page.isMainPage);
  }

  getPublicPages(): Page[] {
    return this.pages.filter(page => page.isPublic && !page.hasPassword);
  }

  updatePage(id: string, updates: Partial<Page>): Page | null {
    const index = this.pages.findIndex(page => page.id === id);
    if (index !== -1) {
      this.pages[index] = {
        ...this.pages[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.notifySubscribers();
      return this.pages[index];
    }
    return null;
  }

  deletePage(id: string): boolean {
    const index = this.pages.findIndex(page => page.id === id);
    if (index !== -1) {
      this.pages.splice(index, 1);
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  // Folder methods
  getFolders(): Folder[] {
    return this.folders;
  }

  getFolderById(id: string): Folder | undefined {
    return this.folders.find(folder => folder.id === id);
  }

  getFoldersByParentId(parentId?: string): Folder[] {
    return this.folders.filter(folder => folder.parentId === parentId);
  }

  updateFolder(id: string, updates: Partial<Folder>): Folder | null {
    const index = this.folders.findIndex(folder => folder.id === id);
    if (index !== -1) {
      this.folders[index] = {
        ...this.folders[index],
        ...updates
      };
      this.notifySubscribers();
      return this.folders[index];
    }
    return null;
  }

  deleteFolder(id: string): boolean {
    const index = this.folders.findIndex(folder => folder.id === id);
    if (index !== -1) {
      this.folders.splice(index, 1);
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  // Media file methods
  createMediaFile(file: Omit<MediaFile, 'id'>): MediaFile {
    const newFile: MediaFile = {
      ...file,
      id: `file-${Date.now()}-${Math.random()}`
    };
    this.mediaFiles.push(newFile);
    this.notifySubscribers();
    return newFile;
  }

  getMediaFiles(): MediaFile[] {
    return this.mediaFiles;
  }

   getMediaFilesByFolder(folderId?: string): MediaFile[] {
    return this.mediaFiles.filter(file => file.folderId === folderId);
  }

  deleteMediaFile(id: string): boolean {
    const index = this.mediaFiles.findIndex(file => file.id === id);
    if (index !== -1) {
      this.mediaFiles.splice(index, 1);
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  // Enhanced folder creation with password support
  createFolder(folder: Omit<Folder, 'id' | 'createdAt' | 'children' | 'pages' | 'files'>): Folder {
    const newFolder: Folder = {
      ...folder,
      id: `folder-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
      children: [],
      pages: [],
      files: []
    };
    this.folders.push(newFolder);
    this.notifySubscribers();
    return newFolder;
  }

  // Check folder access
  canAccessFolder(folderId: string, password?: string): boolean {
    const folder = this.folders.find(f => f.id === folderId);
    if (!folder) return false;
    if (!folder.hasPassword) return true;
    return folder.password === password;
  }

  // Check page access
  canAccessPage(pageId: string, password?: string): boolean {
    const page = this.pages.find(p => p.id === pageId);
    if (!page) return false;
    if (!page.hasPassword) return true;
    return page.password === password;
  }

  // CTF methods
  getCTFs(): CTF[] {
    return this.ctfs;
  }

  createCTF(ctf: Omit<CTF, 'id' | 'createdAt' | 'updatedAt'>): CTF {
    const newCTF: CTF = {
      ...ctf,
      id: `ctf-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.ctfs.push(newCTF);
    this.notifySubscribers();
    return newCTF;
  }

  deleteCTF(id: string): boolean {
    const index = this.ctfs.findIndex(ctf => ctf.id === id);
    if (index !== -1) {
      this.ctfs.splice(index, 1);
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  // Category methods
  getCategories(): Category[] {
    return this.categories;
  }

  createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category {
    const newCategory: Category = {
      ...category,
      id: `category-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.categories.push(newCategory);
    this.notifySubscribers();
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.categories.findIndex(category => category.id === id);
    if (index !== -1) {
      this.categories[index] = {
        ...this.categories[index],
        ...updates
      };
      this.notifySubscribers();
      return this.categories[index];
    }
    return null;
  }

  deleteCategory(id: string): boolean {
    const index = this.categories.findIndex(category => category.id === id);
    if (index !== -1) {
      this.categories.splice(index, 1);
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  // Backup methods
  getBackups(): Backup[] {
    return this.backups;
  }

  createBackup(backup: Omit<Backup, 'id' | 'createdAt'>): Backup {
    const newBackup: Backup = {
      ...backup,
      id: `backup-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString()
    };
    this.backups.push(newBackup);
    this.notifySubscribers();
    return newBackup;
  }

  exportBackup(id: string): any {
    return {
      pages: this.pages,
      folders: this.folders,
      mediaFiles: this.mediaFiles,
      ctfs: this.ctfs,
      categories: this.categories
    };
  }

  restoreBackup(data: any): boolean {
    try {
      this.pages = data.pages || [];
      this.folders = data.folders || [];
      this.mediaFiles = data.mediaFiles || [];
      this.ctfs = data.ctfs || [];
      this.categories = data.categories || [];
      this.notifySubscribers();
      return true;
    } catch {
      return false;
    }
  }

  deleteBackup(id: string): boolean {
    const index = this.backups.findIndex(backup => backup.id === id);
    if (index !== -1) {
      this.backups.splice(index, 1);
      this.notifySubscribers();
      return true;
    }
    return false;
  }
}

export const database = new Database();
