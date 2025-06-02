
import { useState } from "react";
import { ChevronDown, ChevronRight, Folder, File, Plus, Target, Database, ArrowLeft, Image, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ViewMode } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  onPageSelect: (pageId: string) => void;
  selectedPage: string | null;
  onViewChange: (view: ViewMode) => void;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  pages: Page[];
  children?: Category[];
  expanded?: boolean;
  depth?: number;
}

interface Page {
  id: string;
  title: string;
  lastModified: string;
  isNew?: boolean;
}

// Categorias iniciais vazias para o usuário popular
const categories: Category[] = [];

export function Sidebar({ isOpen, onPageSelect, selectedPage, onViewChange }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const CategoryTreeItem = ({ category, depth = 0 }: { category: Category; depth?: number }) => {
    const hasChildren = category.children && category.children.length > 0;
    const hasPages = category.pages && category.pages.length > 0;
    const isExpanded = expandedCategories.includes(category.id);
    const indentLevel = depth * 16;
    const maxDepth = 5;

    return (
      <div className="animate-fade-in">
        <Button
          variant="ghost"
          className={`w-full justify-start text-sm font-medium h-9 transition-all duration-500 hover:bg-accent/50 hover:shadow-sm hover:scale-[1.02] group ${
            isExpanded ? 'bg-accent/30 shadow-inner' : ''
          } ${depth > maxDepth ? 'opacity-75' : ''}`}
          style={{ paddingLeft: `${12 + Math.min(indentLevel, maxDepth * 16)}px` }}
          onClick={() => toggleCategory(category.id)}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasChildren || hasPages ? (
              <div className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-primary" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            ) : (
              <div className="w-4" />
            )}
            
            <span className="text-lg transition-all duration-300 group-hover:scale-110 filter group-hover:brightness-110">
              {category.icon}
            </span>
            <span className="flex-1 text-left truncate group-hover:text-primary transition-colors duration-300">
              {category.name}
            </span>
            
            {depth <= 3 && (hasPages || hasChildren) && (
              <Badge 
                variant="secondary" 
                className="text-xs ml-auto opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 animate-pulse"
              >
                {(category.pages?.length || 0) + (category.children?.length || 0)}
              </Badge>
            )}
          </div>
        </Button>
        
        {isExpanded && (
          <div className="animate-accordion-down space-y-1 mt-1 overflow-hidden">
            {hasPages && (
              <div className="space-y-1">
                {category.pages!.map((page, index) => (
                  <div
                    key={page.id}
                    className="group flex items-center gap-2 animate-slide-up"
                    style={{ 
                      paddingLeft: `${28 + Math.min(indentLevel, maxDepth * 16)}px`,
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
                      {page.isNew && (
                        <Badge variant="destructive" className="ml-auto text-xs animate-pulse">
                          Novo
                        </Badge>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {hasChildren && (
              <div className="space-y-1">
                {category.children!.map((child) => (
                  <CategoryTreeItem key={child.id} category={child} depth={depth + 1} />
                ))}
              </div>
            )}
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

            {/* Categories */}
            <div className="animate-slide-up">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-medium text-sm text-muted-foreground">Categorias</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-primary/10 hover:scale-110 transition-all duration-300"
                  onClick={() => onViewChange('categories')}
                >
                  <Folder className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-1">
                {categories.length === 0 ? (
                  <div className="text-center py-8">
                    <Folder className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Nenhuma categoria ainda
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Crie pastas para organizar
                    </p>
                  </div>
                ) : (
                  categories.map((category, index) => (
                    <div 
                      key={category.id}
                      className="animate-fade-in"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <CategoryTreeItem category={category} />
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
