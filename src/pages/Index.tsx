
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageEditor from "@/components/editor/PageEditor";
import AdminSettings from "@/components/settings/AdminSettings";
import CategoryManager from "@/components/category/CategoryManager";

export type ViewMode = 'dashboard' | 'page' | 'edit' | 'new' | 'settings' | 'categories' | 'ctfs';

const Index = () => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

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
    setViewMode('dashboard');
    setSelectedPage(null);
  };

  const handleBack = () => {
    setViewMode('dashboard');
    setSelectedPage(null);
  };

  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
  };

  const renderMainContent = () => {
    switch (viewMode) {
      case 'page':
        const EnhancedPageView = React.lazy(() => import('@/components/page/EnhancedPageView'));
        return (
          <React.Suspense fallback={<div className="p-6">Carregando...</div>}>
            <EnhancedPageView 
              pageId={selectedPage!} 
              onBack={handleBack}
              onEdit={() => handleEditPage(selectedPage!)}
            />
          </React.Suspense>
        );
      case 'edit':
      case 'new':
        return (
          <PageEditor
            pageId={viewMode === 'edit' ? selectedPage! : undefined}
            onSave={handleSavePage}
            onCancel={handleBack}
          />
        );
      case 'settings':
        return <AdminSettings />;
      case 'categories':
        return <CategoryManager />;
      case 'ctfs':
        const CTFsPage = React.lazy(() => import('@/components/ctf/CTFsPage'));
        return (
          <React.Suspense fallback={<div className="p-6">Carregando CTFs...</div>}>
            <CTFsPage />
          </React.Suspense>
        );
      default:
        return (
          <Dashboard 
            onPageSelect={handlePageSelect}
            onNewPage={() => handleEditPage()}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          onViewChange={handleViewChange}
          currentView={viewMode}
        />
        
        <div className="flex">
          <Sidebar 
            isOpen={sidebarOpen}
            onPageSelect={handlePageSelect}
            selectedPage={selectedPage}
            onViewChange={handleViewChange}
          />
          
          <main className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-80' : 'ml-0'
          }`}>
            {renderMainContent()}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
