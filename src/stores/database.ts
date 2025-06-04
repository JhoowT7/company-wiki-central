import { Folder, MediaFile, Page } from "@/types";

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
      category: 'Principal'
    }
  ];
  private folders: Folder[] = initialFolders;
  private mediaFiles: MediaFile[] = initialMediaFiles;

  // Page methods
  createPage(page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Page {
    const newPage: Page = {
      ...page,
      id: `page-${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.pages.push(newPage);
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
      return this.pages[index];
    }
    return null;
  }

  deletePage(id: string): boolean {
    const index = this.pages.findIndex(page => page.id === id);
    if (index !== -1) {
      this.pages.splice(index, 1);
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
      return this.folders[index];
    }
    return null;
  }

  deleteFolder(id: string): boolean {
    const index = this.folders.findIndex(folder => folder.id === id);
    if (index !== -1) {
      this.folders.splice(index, 1);
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
}

export const database = new Database();
