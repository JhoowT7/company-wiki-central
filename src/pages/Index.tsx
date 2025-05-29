
import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { PageView } from "@/components/PageView";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageEditor from "@/components/editor/PageEditor";
import AdminSettings from "@/components/settings/AdminSettings";
import CategoryManager from "@/components/category/CategoryManager";

type ViewMode = 'dashboard' | 'page' | 'edit' | 'new' | 'settings' | 'categories';

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

  const renderMainContent = () => {
    switch (viewMode) {
      case 'page':
        return (
          <PageView 
            pageId={selectedPage!} 
            onBack={handleBack}
            onEdit={() => handleEditPage(selectedPage!)}
          />
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
          onViewChange={setViewMode}
          currentView={viewMode}
        />
        
        <div className="flex">
          <Sidebar 
            isOpen={sidebarOpen}
            onPageSelect={handlePageSelect}
            selectedPage={selectedPage}
            onViewChange={setViewMode}
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
