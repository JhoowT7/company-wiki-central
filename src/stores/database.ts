
import { DatabaseState, Folder, Page, User, CTF, KanbanBoard, Backup } from '@/types';

// Sistema de banco de dados em memória
class DatabaseManager {
  private data: DatabaseState = {
    users: [],
    folders: [],
    pages: [],
    comments: [],
    versions: [],
    ctfs: [],
    kanbanBoards: [],
    backups: []
  };

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initializeWithMockData();
  }

  // Subscription para atualizações
  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach(callback => callback());
  }

  // Inicializar com dados mock
  private initializeWithMockData() {
    // Usuários
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

    // Pastas
    this.data.folders = [
      {
        id: 'rh',
        name: 'Recursos Humanos',
        icon: '👥',
        color: '#3B82F6',
        path: '/rh',
        permissions: { read: ['*'], write: ['admin', 'hr'], delete: ['admin'] },
        metadata: {
          createdBy: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['departamento', 'pessoas']
        },
        order: 1
      },
      {
        id: 'ti',
        name: 'Tecnologia da Informação',
        icon: '💻',
        color: '#10B981',
        path: '/ti',
        permissions: { read: ['*'], write: ['admin', 'ti'], delete: ['admin'] },
        metadata: {
          createdBy: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['departamento', 'tecnologia']
        },
        order: 2
      }
    ];

    // Páginas
    this.data.pages = [
      {
        id: 'page-1',
        title: 'Políticas de Segurança',
        content: '# Políticas de Segurança\n\nDocumento importante sobre segurança...',
        folderId: 'ti',
        status: 'published',
        priority: 'high',
        metadata: {
          createdBy: 'user-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1,
          tags: ['segurança', 'política'],
          category: 'documentacao'
        },
        permissions: { read: ['*'], write: ['admin', 'ti'], comment: ['*'] },
        viewCount: 42,
        isTemplate: false
      }
    ];

    // CTFs
    this.data.ctfs = [
      {
        id: 'ctf-1',
        title: 'SQL Injection Challenge',
        description: 'Desafio de injeção SQL para teste de segurança',
        difficulty: 'medium',
        category: 'Web Security',
        points: 250,
        tags: ['sql', 'injection', 'web'],
        url: 'https://ctf.example.com/sql-challenge',
        status: 'available',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdBy: 'user-1',
        createdAt: new Date(),
        completedBy: [],
        hints: ['Verifique os parâmetros da URL', 'Use UNION SELECT']
      }
    ];
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

  createPage(page: Omit<Page, 'id' | 'metadata' | 'viewCount'>): Page {
    const newPage: Page = {
      ...page,
      id: `page-${Date.now()}`,
      metadata: {
        createdBy: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        tags: [],
        ...page.metadata
      },
      viewCount: 0
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
