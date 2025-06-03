import { useState, useEffect } from "react";
import { Plus, Folder, Edit, Trash2, Move, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { database } from "@/stores/database";
import { Folder as FolderType } from "@/types";
import { useToast } from "@/hooks/use-toast";

const FolderManager = () => {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderType | null>(null);
  const [newFolder, setNewFolder] = useState({
    name: '',
    icon: '📁',
    color: '#3B82F6',
    parentId: '',
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadFolders = () => {
      setFolders(database.getFolders());
    };

    loadFolders();
    const unsubscribe = database.subscribe(loadFolders);
    return () => {
      unsubscribe();
    };
  }, []);

  const createFolder = () => {
    if (!newFolder.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da pasta é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      const path = newFolder.parentId 
        ? `${folders.find(f => f.id === newFolder.parentId)?.path}/${newFolder.name.toLowerCase().replace(/\s+/g, '-')}`
        : `/${newFolder.name.toLowerCase().replace(/\s+/g, '-')}`;

      database.createFolder({
        name: newFolder.name,
        icon: newFolder.icon,
        color: newFolder.color,
        parentId: newFolder.parentId || undefined,
        path,
        description: newFolder.description,
        permissions: { read: ['*'], write: ['admin'], delete: ['admin'] },
        order: folders.length + 1
      });

      toast({
        title: "Sucesso",
        description: "Pasta criada com sucesso!",
      });

      setNewFolder({
        name: '',
        icon: '📁',
        color: '#3B82F6',
        parentId: '',
        description: ''
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar pasta",
        variant: "destructive"
      });
    }
  };

  const deleteFolder = (id: string) => {
    try {
      const success = database.deleteFolder(id);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Pasta excluída com sucesso!",
        });
      } else {
        toast({
          title: "Erro",
          description: "Pasta não encontrada",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir pasta",
        variant: "destructive"
      });
    }
  };

  const iconOptions = ['📁', '👥', '💻', '⚖️', '💰', '📋', '🔒', '⚙️', '📊', '🎯', '📚', '🏢'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Folder className="h-8 w-8 text-primary" />
            Gerenciamento de Pastas
          </h1>
          <p className="text-muted-foreground mt-2">
            Organize seu conteúdo em pastas e subpastas
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
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
                <Label>Pasta Pai (opcional)</Label>
                <select
                  value={newFolder.parentId}
                  onChange={(e) => setNewFolder({ ...newFolder, parentId: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Pasta raiz</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.icon} {folder.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Descrição (opcional)</Label>
                <Textarea
                  value={newFolder.description}
                  onChange={(e) => setNewFolder({ ...newFolder, description: e.target.value })}
                  placeholder="Descrição da pasta"
                />
              </div>

              <Button onClick={createFolder} disabled={!newFolder.name.trim()} className="w-full">
                Criar Pasta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Pastas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma pasta encontrada</h3>
            <p className="text-muted-foreground mb-4">
              Crie sua primeira pasta para organizar o conteúdo
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Criar Primeira Pasta
            </Button>
          </Card>
        ) : (
          folders.map((folder) => (
            <Card key={folder.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span style={{ color: folder.color }} className="text-2xl">
                    {folder.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold">{folder.name}</h3>
                    <p className="text-sm text-muted-foreground">{folder.path}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {folder.description && (
                  <p className="text-sm text-muted-foreground mb-3">{folder.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <Badge variant="outline">
                      {database.getPages().filter(p => p.folderId === folder.id).length} páginas
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteFolder(folder.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FolderManager;
