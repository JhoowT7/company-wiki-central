
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Folder, File, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { database } from "@/stores/database";
import { Folder as FolderType, Page } from "@/types";

interface FolderTreeProps {
  onFolderSelect?: (folderId: string) => void;
  onPageSelect?: (pageId: string) => void;
  onCreateFolder?: (parentId?: string) => void;
  onCreatePage?: (folderId?: string) => void;
  selectedItem?: string;
  maxDepth?: number;
}

const FolderTree = ({ 
  onFolderSelect, 
  onPageSelect, 
  onCreateFolder, 
  onCreatePage,
  selectedItem,
  maxDepth = 10
}: FolderTreeProps) => {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
    const unsubscribe = database.subscribe(() => {
      loadData();
    });
    return unsubscribe;
  }, []);

  const loadData = () => {
    setFolders(database.getFolders());
    setPages(database.getPages());
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getFolderChildren = (parentId?: string) => {
    return folders.filter(folder => folder.parentId === parentId);
  };

  const getFolderPages = (folderId: string) => {
    return pages.filter(page => page.folderId === folderId);
  };

  const renderFolder = (folder: FolderType, depth: number = 0) => {
    if (depth > maxDepth) return null;

    const children = getFolderChildren(folder.id);
    const folderPages = getFolderPages(folder.id);
    const isExpanded = expandedFolders.has(folder.id);
    const hasChildren = children.length > 0 || folderPages.length > 0;
    const isSelected = selectedItem === folder.id;

    return (
      <div key={folder.id} className="select-none">
        <div 
          className={`flex items-center group hover:bg-accent/50 rounded-md transition-colors ${
            isSelected ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 hover:bg-transparent"
            onClick={() => hasChildren && toggleFolder(folder.id)}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <div className="w-4" />
            )}
          </Button>

          <div 
            className="flex items-center gap-2 flex-1 py-1 px-2 cursor-pointer"
            onClick={() => onFolderSelect?.(folder.id)}
          >
            <span style={{ color: folder.color }} className="text-lg">
              {folder.icon}
            </span>
            <span className="font-medium truncate">{folder.name}</span>
            
            {hasChildren && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {children.length + folderPages.length}
              </Badge>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onCreateFolder?.(folder.id)}>
                <Folder className="h-4 w-4 mr-2" />
                Nova Subpasta
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCreatePage?.(folder.id)}>
                <File className="h-4 w-4 mr-2" />
                Nova Página
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {isExpanded && hasChildren && (
          <div className="animate-accordion-down">
            {/* Renderizar subpastas */}
            {children.map(child => renderFolder(child, depth + 1))}
            
            {/* Renderizar páginas */}
            {folderPages.map(page => (
              <div
                key={page.id}
                className={`flex items-center group hover:bg-accent/50 rounded-md transition-colors cursor-pointer ${
                  selectedItem === page.id ? 'bg-accent' : ''
                }`}
                style={{ paddingLeft: `${(depth + 1) * 20 + 8}px` }}
                onClick={() => onPageSelect?.(page.id)}
              >
                <div className="w-6" />
                <File className="h-4 w-4 mr-2 text-blue-500" />
                <span className="font-medium truncate flex-1">{page.title}</span>
                
                <Badge 
                  variant={page.status === 'published' ? 'default' : 'secondary'}
                  className="ml-auto text-xs opacity-70 group-hover:opacity-100"
                >
                  {page.status === 'published' ? 'Pub' : 'Draft'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const rootFolders = getFolderChildren(undefined);

  return (
    <div className="space-y-1">
      {/* Botão para criar pasta raiz */}
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-sm font-medium text-muted-foreground">Estrutura</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCreateFolder?.(undefined)}
          className="h-auto p-1"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Renderizar árvore */}
      <div className="space-y-1">
        {rootFolders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Folder className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Nenhuma pasta criada</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateFolder?.(undefined)}
              className="mt-2"
            >
              Criar primeira pasta
            </Button>
          </div>
        ) : (
          rootFolders.map(folder => renderFolder(folder))
        )}
      </div>
    </div>
  );
};

export default FolderTree;
