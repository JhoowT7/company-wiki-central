
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { ThemeProvider } from "@/components/ThemeProvider";
import ModernPageEditor from "@/components/editor/ModernPageEditor";
import AdminSettings from "@/components/settings/AdminSettings";
import CategoryManager from "@/components/category/CategoryManager";
import BackupManager from "@/components/backup/BackupManager";
import FolderManager from "@/components/folder/FolderManager";
import FolderNavigator from "@/components/folder/FolderNavigator";
import MediaManager from "@/components/media/MediaManager";
import { ViewMode } from "@/types";

const Index = () => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);

  const handlePageSelect = (pageId: string) => {
    setSelectedPage(pageId);
    setViewMode('page');
  };

  const handleEditPage = (pageId?: string) => {
    setSelectedPage(pageId || null);
    setViewMode(pageId ? 'edit' : 'new');
  };

  const handleSavePage = (content: any) => {
    console.log("Página salva:", content);
    setViewMode(viewMode === 'new' ? 'dashboard' : 'page');
    if (content.id) {
      setSelectedPage(content.id);
    }
  };

  const handleBack = () => {
    if (viewMode === 'page' || viewMode === 'edit') {
      setViewMode('dashboard');
    } else {
      setViewMode('dashboard');
    }
    setSelectedPage(null);
    setCurrentFolderId(undefined);
  };

  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
    if (view !== 'folder-view') {
      setCurrentFolderId(undefined);
    }
    if (view === 'main-page') {
      setSelectedPage(null);
    }
  };

  const handleFolderSelect = (folderId: string) => {
    setCurrentFolderId(folderId);
    setViewMode('folder-view');
  };

  const handleCreateMainPage = () => {
    setSelectedPage(null);
    setViewMode('new');
  };

  const renderMainContent = () => {
    switch (viewMode) {
      case 'main-page':
        const MainPageView = React.lazy(() => import('@/components/page/MainPageView'));
        return (
          <React.Suspense fallback={
            <div className="p-6 flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Carregando página principal...</span>
            </div>
          }>
            <MainPageView 
              onEdit={handleCreateMainPage}
              isAdmin={true}
            />
          </React.Suspense>
        );
      case 'page':
        const EnhancedPageView = React.lazy(() => import('@/components/page/EnhancedPageView'));
        return (
          <React.Suspense fallback={
            <div className="p-6 flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Carregando...</span>
            </div>
          }>
            <EnhancedPageView 
              pageId={selectedPage!} 
              onBack={handleBack}
              onEdit={() => handleEditPage(selectedPage!)}
            />
          </React.Suspense>
        );
      case 'edit':
      case 'new':
        const EnhancedPageEditor = React.lazy(() => import('@/components/editor/EnhancedPageEditor'));
        return (
          <React.Suspense fallback={
            <div className="p-6 flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Carregando editor...</span>
            </div>
          }>
            <EnhancedPageEditor
              pageId={viewMode === 'edit' ? selectedPage! : undefined}
              folderId={currentFolderId}
              isMainPage={viewMode === 'new' && selectedPage === null}
              onSave={handleSavePage}
              onCancel={handleBack}
              onPageCreated={(pageId) => {
                setSelectedPage(pageId);
                setViewMode('page');
              }}
            />
          </React.Suspense>
        );
      case 'settings':
        return (
          <div className="animate-slide-up">
            <AdminSettings />
          </div>
        );
      case 'categories':
        return (
          <div className="animate-scale-in">
            <CategoryManager />
          </div>
        );
      case 'ctfs':
        const CTFsPage = React.lazy(() => import('@/components/ctf/CTFsPage'));
        return (
          <React.Suspense fallback={
            <div className="p-6 flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-pulse flex space-x-1">
                  <div className="rounded-full bg-primary h-3 w-3 animate-bounce"></div>
                  <div className="rounded-full bg-primary h-3 w-3 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="rounded-full bg-primary h-3 w-3 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-muted-foreground">Carregando CTFs...</span>
              </div>
            </div>
          }>
            <CTFsPage />
          </React.Suspense>
        );
      case 'backup':
        return (
          <div className="animate-fade-in">
            <BackupManager />
          </div>
        );
      case 'folders':
        return (
          <div className="animate-fade-in">
            <FolderManager />
          </div>
        );
      case 'folder-view':
        return (
          <div className="animate-fade-in">
            <FolderNavigator
              currentFolderId={currentFolderId}
              onBack={handleBack}
              onPageSelect={handlePageSelect}
              onEditPage={handleEditPage}
              onFolderSelect={handleFolderSelect}
            />
          </div>
        );
      case 'media':
        return (
          <div className="animate-fade-in">
            <MediaManager />
          </div>
        );
      default:
        return (
          <div className="animate-fade-in">
            <Dashboard 
              onPageSelect={handlePageSelect}
              onNewPage={() => handleEditPage()}
              onFolderSelect={handleFolderSelect}
            />
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50 text-foreground relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          onViewChange={handleViewChange}
          currentView={viewMode}
        />
        
        <div className="flex relative z-10">
          <div className={`transition-all duration-500 ease-in-out ${
            sidebarOpen ? 'w-80' : 'w-0'
          }`}>
            <Sidebar 
              isOpen={sidebarOpen}
              onPageSelect={handlePageSelect}
              selectedPage={selectedPage}
              onViewChange={handleViewChange}
              onFolderSelect={handleFolderSelect}
            />
          </div>
          
          <main className={`flex-1 transition-all duration-500 ease-in-out backdrop-blur-sm ${
            sidebarOpen ? 'ml-0' : 'ml-0'
          }`}>
            <div className="glass-effect border-l border-border/50">
              {renderMainContent()}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
