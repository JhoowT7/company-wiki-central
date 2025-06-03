
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Folder, File, Plus, Target, Database, ArrowLeft, Image, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { database } from "@/stores/database";
import { Folder as FolderType, Page } from "@/types";

type ViewMode = 'dashboard' | 'page' | 'edit' | 'new' | 'settings' | 'categories' | 'ctfs' | 'kanban' | 'table' | 'graph' | 'backup' | 'folders' | 'media';

interface SidebarProps {
  isOpen: boolean;
  onPageSelect: (pageId: string) => void;
  selectedPage: string | null;
  onViewChange: (view: ViewMode) => void;
}

export function Sidebar({ isOpen, onPageSelect, selectedPage, onViewChange }: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    console.log("Sidebar: Carregando dados do banco");
    
    const loadData = () => {
      const loadedFolders = database.getFolders();
      const loadedPages = database.getPages();
      
      console.log("Sidebar: Pastas carregadas:", loadedFolders);
      console.log("Sidebar: Páginas carregadas:", loadedPages);
      
      setFolders(loadedFolders);
      setPages(loadedPages);
    };

    loadData();
    const unsubscribe = database.subscribe(() => {
      console.log("Sidebar: Dados atualizados no banco");
      loadData();
    });
    
    return unsubscribe;
  }, []);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const getFolderPages = (folderId: string) => {
    return pages.filter(page => page.folderId === folderId);
  };

  const FolderItem = ({ folder }: { folder: FolderType }) => {
    const folderPages = getFolderPages(folder.id);
    const isExpanded = expandedFolders.includes(folder.id);

    return (
      <div className="animate-fade-in">
        <Button
          variant="ghost"
          className={`w-full justify-start text-sm font-medium h-9 transition-all duration-500 hover:bg-accent/50 hover:shadow-sm hover:scale-[1.02] group ${
            isExpanded ? 'bg-accent/30 shadow-inner' : ''
          }`}
          onClick={() => toggleFolder(folder.id)}
        >
          <div className="flex items-center gap-2 flex-1">
            <div className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              {folderPages.length > 0 ? (
                isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-primary" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : (
                <div className="w-4" />
              )}
            </div>
            
            <span className="text-lg transition-all duration-300 group-hover:scale-110 filter group-hover:brightness-110" style={{ color: folder.color }}>
              {folder.icon}
            </span>
            <span className="flex-1 text-left truncate group-hover:text-primary transition-colors duration-300">
              {folder.name}
            </span>
            
            {folderPages.length > 0 && (
              <Badge 
                variant="secondary" 
                className="text-xs ml-auto opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
              >
                {folderPages.length}
              </Badge>
            )}
          </div>
        </Button>
        
        {isExpanded && folderPages.length > 0 && (
          <div className="animate-accordion-down space-y-1 mt-1 overflow-hidden">
            {folderPages.map((page, index) => (
              <div
                key={page.id}
                className="group flex items-center gap-2 animate-slide-up pl-8"
                style={{ 
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <Button
                  variant={selectedPage === page.id ? "secondary" : "ghost"}
                  className={`flex-1 justify-start text-sm h-8 transition-all duration-300 hover:bg-accent/50 hover:translate-x-1 hover:shadow-md ${
                    selectedPage === page.id ? 'bg-primary/10 border-l-2 border-primary shadow-inner' : ''
                  }`}
                  onClick={() => onPageSelect(page.id)}
                >
                  <File className="h-3 w-3 mr-2 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  <span className="flex-1 text-left truncate">{page.title}</span>
                  {page.status === 'draft' && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      Rascunho
                    </Badge>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40 shadow-2xl glass-effect">
      <div className="p-4 space-y-4 h-full flex flex-col">
        <ScrollArea className="flex-1">
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-medium text-sm text-muted-foreground">Ações Rápidas</h3>
              </div>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-8 transition-all duration-300 hover:bg-accent/50 hover:scale-[1.02] hover:shadow-md group"
                  onClick={() => onViewChange('new')}
                >
                  <Plus className="h-3 w-3 mr-2 text-muted-foreground group-hover:text-primary group-hover:rotate-90 transition-all duration-300" />
                  Nova Página
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-8 transition-all duration-300 hover:bg-accent/50 hover:scale-[1.02] hover:shadow-md group"
                  onClick={() => onViewChange('folders')}
                >
                  <FolderPlus className="h-3 w-3 mr-2 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  Gerenciar Pastas
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-8 transition-all duration-300 hover:bg-accent/50 hover:scale-[1.02] hover:shadow-md group"
                  onClick={() => onViewChange('media')}
                >
                  <Image className="h-3 w-3 mr-2 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  Biblioteca de Mídia
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm h-8 transition-all duration-300 hover:bg-accent/50 hover:scale-[1.02] hover:shadow-md group"
                  onClick={() => onViewChange('backup')}
                >
                  <Database className="h-3 w-3 mr-2 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  Gerenciar Backups
                </Button>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Folders */}
            <div className="animate-slide-up">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Pastas ({folders.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-primary/10 hover:scale-110 transition-all duration-300"
                  onClick={() => onViewChange('folders')}
                >
                  <Folder className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-1">
                {folders.length === 0 ? (
                  <div className="text-center py-4">
                    <Folder className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Nenhuma pasta ainda
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Crie pastas para organizar
                    </p>
                  </div>
                ) : (
                  folders.map((folder, index) => (
                    <div 
                      key={folder.id}
                      className="animate-fade-in"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <FolderItem folder={folder} />
                    </div>
                  ))
                )}
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* CTFs Section */}
            <div className="animate-scale-in">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium text-sm text-muted-foreground">CTFs</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-primary/10 hover:scale-110 transition-all duration-300"
                  onClick={() => onViewChange('ctfs')}
                >
                  <Target className="h-3 w-3" />
                </Button>
              </div>
              
              <Button
                variant="outline"
                className="w-full justify-start text-sm h-8 transition-all duration-300 hover:bg-accent/50 hover:scale-[1.02] hover:shadow-lg group border-dashed hover:border-solid"
                onClick={() => onViewChange('ctfs')}
              >
                <Target className="h-3 w-3 mr-2 text-muted-foreground group-hover:text-primary group-hover:rotate-12 transition-all duration-300" />
                Ver CTFs Disponíveis
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
