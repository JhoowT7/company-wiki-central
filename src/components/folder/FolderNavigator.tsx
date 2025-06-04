import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Folder, File, FolderPlus, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { database } from "@/stores/database";
import { Folder as FolderType, Page, MediaFile } from "@/types";
import { useToast } from "@/hooks/use-toast";
import FileUploader from "@/components/file/FileUploader";

interface FolderNavigatorProps {
  currentFolderId?: string;
  onBack: () => void;
  onPageSelect: (pageId: string) => void;
  onEditPage: (pageId?: string) => void;
  onFolderSelect: (folderId: string) => void;
}

const FolderNavigator = ({ 
  currentFolderId, 
  onBack, 
  onPageSelect, 
  onEditPage,
  onFolderSelect 
}: FolderNavigatorProps) => {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [currentFolder, setCurrentFolder] = useState<FolderType | null>(null);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
  const [newFolder, setNewFolder] = useState({
    name: '',
    icon: '📁',
    color: '#3B82F6',
    description: ''
  });
  const [newPage, setNewPage] = useState({
    title: '',
    content: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadFolderData();
    const unsubscribe = database.subscribe(() => {
      loadFolderData();
    });
    return unsubscribe;
  }, [currentFolderId]);

  const loadFolderData = () => {
    const allFolders = database.getFolders();
    const allPages = database.getPages();
    const allFiles = database.getMediaFiles();
    
    const subFolders = allFolders.filter(folder => folder.parentId === currentFolderId);
    const folderPages = allPages.filter(page => page.folderId === currentFolderId);
    const folderFiles = allFiles.filter(file => file.folderId === currentFolderId);
    const current = currentFolderId ? allFolders.find(f => f.id === currentFolderId) : null;
    
    setFolders(subFolders);
    setPages(folderPages);
    setFiles(folderFiles);
    setCurrentFolder(current);
  };

  const createSubFolder = () => {
    if (!newFolder.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da pasta é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      const parentPath = currentFolder?.path || '';
      const path = `${parentPath}/${newFolder.name.toLowerCase().replace(/\s+/g, '-')}`;

      database.createFolder({
        name: newFolder.name,
        icon: newFolder.icon,
        color: newFolder.color,
        parentId: currentFolderId,
        path,
        description: newFolder.description,
        permissions: { read: ['*'], write: ['admin'], delete: ['admin'] },
        order: folders.length + 1
      });

      toast({
        title: "Sucesso!",
        description: "Pasta criada com sucesso!",
      });

      setNewFolder({
        name: '',
        icon: '📁',
        color: '#3B82F6',
        description: ''
      });
      setIsCreateFolderOpen(false);
    } catch (error) {
      console.error("Erro ao criar pasta:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar pasta",
        variant: "destructive"
      });
    }
  };

  const createPage = () => {
    if (!newPage.title.trim()) {
      toast({
        title: "Erro",
        description: "Título da página é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      database.createPage({
        title: newPage.title,
        content: newPage.content,
        folderId: currentFolderId,
        author: 'Usuário Atual',
        tags: [],
        category: 'Geral',
        status: 'draft',
        priority: 'medium'
      });

      toast({
        title: "Sucesso!",
        description: "Página criada com sucesso!",
      });

      setNewPage({ title: '', content: '' });
      setIsCreatePageOpen(false);
    } catch (error) {
      console.error("Erro ao criar página:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar página",
        variant: "destructive"
      });
    }
  };

  const getBreadcrumb = () => {
    if (!currentFolder) return "Pasta Raiz";
    const parts = currentFolder.path.split('/').filter(Boolean);
    return parts.join(' / ');
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      default: return '📄';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const iconOptions = ['📁', '👥', '💻', '⚖️', '💰', '📋', '🔒', '⚙️', '📊', '🎯', '📚', '🏢'];

  return (
    <div className="p-6 space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {currentFolder ? (
                <>
                  <span style={{ color: currentFolder.color }} className="text-2xl">
                    {currentFolder.icon}
                  </span>
                  {currentFolder.name}
                </>
              ) : (
                <>
                  <Folder className="h-8 w-8 text-primary" />
                  Todas as Pastas
                </>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              {getBreadcrumb()}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                Nova Pasta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Pasta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Nome da Pasta</Label>
                  <Input
                    value={newFolder.name}
                    onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                    placeholder="Digite o nome da pasta"
                    autoFocus
                  />
                </div>
                
                <div>
                  <Label>Ícone</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {iconOptions.map((icon) => (
                      <Button
                        key={icon}
                        variant={newFolder.icon === icon ? "default" : "outline"}
                        className="h-10 w-10 p-0"
                        onClick={() => setNewFolder({ ...newFolder, icon })}
                      >
                        {icon}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Cor</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map((color) => (
                      <Button
                        key={color}
                        variant="outline"
                        className="h-10 w-10 p-0"
                        style={{ backgroundColor: color }}
                        onClick={() => setNewFolder({ ...newFolder, color })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Descrição (opcional)</Label>
                  <Textarea
                    value={newFolder.description}
                    onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                    placeholder="Descrição da pasta"
                  />
                </div>

                <Button onClick={createSubFolder} disabled={!newFolder.name.trim()} className="w-full">
                  Criar Pasta
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreatePageOpen} onOpenChange={setIsCreatePageOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <FileText className="h-4 w-4 mr-2" />
                Nova Página
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Página</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Título da Página</Label>
                  <Input
                    value={newPage.title}
                    onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                    placeholder="Digite o título da página"
                    autoFocus
                  />
                </div>

                <div>
                  <Label>Conteúdo Inicial (opcional)</Label>
                  <Textarea
                    value={newPage.content}
                    onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                    placeholder="Conteúdo inicial da página..."
                    rows={4}
                  />
                </div>

                <Button onClick={createPage} disabled={!newPage.title.trim()} className="w-full">
                  Criar Página
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Conteúdo com Tabs */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Pastas e Páginas</TabsTrigger>
          <TabsTrigger value="files">Arquivos ({files.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {/* Grid de pastas e páginas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Pastas */}
            {folders.map((folder) => (
              <Card 
                key={folder.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => onFolderSelect(folder.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span style={{ color: folder.color }} className="text-3xl">
                      {folder.icon}
                    </span>
                    <div>
                      <h3 className="font-semibold">{folder.name}</h3>
                      <p className="text-xs text-muted-foreground">Pasta</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {folder.description && (
                    <p className="text-sm text-muted-foreground mb-3">{folder.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      {database.getFolders().filter(f => f.parentId === folder.id).length} subpastas
                    </Badge>
                    <Badge variant="secondary">
                      {database.getPages().filter(p => p.folderId === folder.id).length} páginas
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Páginas */}
            {pages.map((page) => (
              <Card 
                key={page.id} 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500"
                onClick={() => onPageSelect(page.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <File className="h-6 w-6 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{page.title}</h3>
                      <p className="text-xs text-muted-foreground">Página</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {page.excerpt && (
                    <p className="text-sm text-muted-foreground mb-3">{page.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={page.status === 'published' ? 'default' : 'secondary'}
                    >
                      {page.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPage(page.id);
                      }}
                    >
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Estado vazio para pastas e páginas */}
            {folders.length === 0 && pages.length === 0 && (
              <Card className="col-span-full p-12 text-center">
                <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Esta pasta está vazia</h3>
                <p className="text-muted-foreground mb-4">
                  Crie sua primeira pasta ou página
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setIsCreateFolderOpen(true)}>
                    Nova Pasta
                  </Button>
                  <Button onClick={() => setIsCreatePageOpen(true)}>
                    Nova Página
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          {/* Upload de Arquivos */}
          <FileUploader 
            folderId={currentFolderId}
            onFileUploaded={() => loadFolderData()}
          />

          {/* Lista de Arquivos */}
          {files.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <Card key={file.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">{getFileIcon(file.type)}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold truncate">{file.name}</h3>
                        <p className="text-xs text-muted-foreground">{file.type}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {formatFileSize(file.size || 0)}
                      </span>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FolderNavigator;
