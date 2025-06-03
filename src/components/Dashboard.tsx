
import { useState, useEffect } from "react";
import { Plus, FileText, Folder, Search, TrendingUp, Calendar, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { database } from "@/stores/database";
import { Page, Folder as FolderType } from "@/types";

interface DashboardProps {
  onPageSelect: (pageId: string) => void;
  onNewPage: () => void;
}

export function Dashboard({ onPageSelect, onNewPage }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalFolders: 0,
    totalPages: 0,
    totalCTFs: 0,
    totalBackups: 0,
    totalMediaFiles: 0,
    totalCategories: 0,
    recentPages: [] as Page[],
    popularPages: [] as Page[]
  });
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    const loadData = () => {
      setStats(database.getStats());
      setFolders(database.getFolders());
      setPages(database.getPages());
    };

    loadData();
    const unsubscribe = database.subscribe(loadData);
    return () => {
      unsubscribe();
    };
  }, []);

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'review': return 'bg-blue-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Rascunho';
      case 'review': return 'Revisão';
      case 'archived': return 'Arquivado';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu sistema de gerenciamento de conhecimento
          </p>
        </div>
        <Button onClick={onNewPage} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Página
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Páginas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPages}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalPages === 0 ? 'Nenhuma página criada' : 'páginas no sistema'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pastas</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFolders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalFolders === 0 ? 'Nenhuma pasta criada' : 'pastas organizadas'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTFs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCTFs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCTFs === 0 ? 'Nenhum CTF adicionado' : 'desafios disponíveis'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Arquivos de Mídia</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMediaFiles}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalMediaFiles === 0 ? 'Nenhum arquivo carregado' : 'arquivos na biblioteca'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar páginas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Pages */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {searchQuery ? 'Resultados da Pesquisa' : 'Páginas Recentes'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(searchQuery ? filteredPages : stats.recentPages).length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery ? 'Nenhum resultado encontrado' : 'Nenhuma página criada'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? 'Tente pesquisar com outros termos' 
                      : 'Comece criando sua primeira página'}
                  </p>
                  {!searchQuery && (
                    <Button onClick={onNewPage}>
                      Criar Primeira Página
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {(searchQuery ? filteredPages : stats.recentPages).map((page) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => onPageSelect(page.id)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{page.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Atualizado em {new Date(page.metadata.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-white ${getStatusColor(page.status)}`}
                        >
                          {getStatusText(page.status)}
                        </Badge>
                        {page.priority === 'high' && (
                          <Badge variant="destructive">Alta</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Folders */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Pastas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {folders.length === 0 ? (
                <div className="text-center py-8">
                  <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma pasta criada</h3>
                  <p className="text-muted-foreground">
                    Organize seu conteúdo criando pastas
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {folders.slice(0, 5).map((folder) => (
                    <div
                      key={folder.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <span className="text-lg" style={{ color: folder.color }}>
                        {folder.icon}
                      </span>
                      <div>
                        <h4 className="font-medium">{folder.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {pages.filter(p => p.folderId === folder.id).length} páginas
                        </p>
                      </div>
                    </div>
                  ))}
                  {folders.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      +{folders.length - 5} mais pastas
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
