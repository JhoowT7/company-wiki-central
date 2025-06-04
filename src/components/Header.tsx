
import React, { useState } from "react";
import { Search, Menu, Book, Settings, User, Plus, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";
import { useDebounce } from "@/utils/debounce";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { getCurrentUser, removeAuthToken } from "@/utils/auth";
import { ViewMode } from "@/types";

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onViewChange: (view: ViewMode) => void;
  currentView: ViewMode;
}

export function Header({ onToggleSidebar, sidebarOpen, onViewChange, currentView }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const user = getCurrentUser();

  const handleLogout = () => {
    removeAuthToken();
    window.location.href = '/login';
  };

  // Efeito da busca com debounce
  React.useEffect(() => {
    if (debouncedSearch) {
      console.log("Buscando por:", debouncedSearch);
      // Aqui você implementaria a busca real
    }
  }, [debouncedSearch]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Menu Toggle & Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="h-9 w-9 wiki-button-bounce"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onViewChange('dashboard')}
          >
            <Book className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Wiki Empresarial</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conteúdo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Nova Página */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewChange('new')}
            className="wiki-button-bounce"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Página
          </Button>

          {/* Gerenciar Categorias */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 wiki-button-bounce"
            onClick={() => onViewChange('categories')}
          >
            <FolderTree className="h-4 w-4" />
          </Button>
          
          {/* Toggle Tema */}
          <ThemeToggle />
          
          {/* Configurações */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 wiki-button-bounce"
            onClick={() => onViewChange('settings')}
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          {/* Menu do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 wiki-button-bounce">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onViewChange('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
