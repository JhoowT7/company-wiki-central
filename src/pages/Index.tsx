
import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { PageView } from "@/components/PageView";
import { ThemeProvider } from "@/components/ThemeProvider";

const Index = () => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        
        <div className="flex">
          <Sidebar 
            isOpen={sidebarOpen}
            onPageSelect={setSelectedPage}
            selectedPage={selectedPage}
          />
          
          <main className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-80' : 'ml-0'
          }`}>
            {selectedPage ? (
              <PageView 
                pageId={selectedPage} 
                onBack={() => setSelectedPage(null)}
              />
            ) : (
              <Dashboard onPageSelect={setSelectedPage} />
            )}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
