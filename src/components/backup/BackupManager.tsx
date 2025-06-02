
import { useState, useEffect } from "react";
import { Database, Download, Upload, Trash2, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { database } from "@/stores/database";
import { Backup } from "@/types";
import { useToast } from "@/hooks/use-toast";

const BackupManager = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBackup, setNewBackup] = useState({
    name: '',
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadBackups = () => {
      setBackups(database.getBackups());
    };

    loadBackups();
    const unsubscribe = database.subscribe(loadBackups);
    return unsubscribe;
  }, []);

  const createBackup = () => {
    if (!newBackup.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do backup é obrigatório",
        variant: "destructive"
      });
      return;
    }

    try {
      database.createBackup(newBackup.name, newBackup.description);
      
      toast({
        title: "Sucesso",
        description: "Backup criado com sucesso!",
      });

      setNewBackup({ name: '', description: '' });
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar backup",
        variant: "destructive"
      });
    }
  };

  const downloadBackup = (backupId: string) => {
    try {
      const exportData = database.exportBackup(backupId);
      const backup = backups.find(b => b.id === backupId);
      
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${backup?.name}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Sucesso",
        description: "Backup baixado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao baixar backup",
        variant: "destructive"
      });
    }
  };

  const restoreBackup = (backupId: string) => {
    try {
      const success = database.restoreBackup(backupId);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Backup restaurado com sucesso!",
        });
      } else {
        toast({
          title: "Erro",
          description: "Backup não encontrado",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao restaurar backup",
        variant: "destructive"
      });
    }
  };

  const deleteBackup = (id: string) => {
    try {
      const success = database.deleteBackup(id);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Backup excluído com sucesso!",
        });
      } else {
        toast({
          title: "Erro",
          description: "Backup não encontrado",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir backup",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Gerenciamento de Backups
          </h1>
          <p className="text-muted-foreground mt-2">
            Crie, baixe e restaure backups dos seus dados
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Criar Backup
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Backup</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nome do Backup</Label>
                <Input
                  value={newBackup.name}
                  onChange={(e) => setNewBackup({ ...newBackup, name: e.target.value })}
                  placeholder="Digite o nome do backup"
                />
              </div>
              
              <div>
                <Label>Descrição (opcional)</Label>
                <Textarea
                  value={newBackup.description}
                  onChange={(e) => setNewBackup({ ...newBackup, description: e.target.value })}
                  placeholder="Descrição do backup"
                />
              </div>

              <Button onClick={createBackup} disabled={!newBackup.name.trim()} className="w-full">
                Criar Backup
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Backups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {backups.length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum backup encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro backup para proteger seus dados
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Criar Primeiro Backup
            </Button>
          </Card>
        ) : (
          backups.map((backup) => (
            <Card key={backup.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">{backup.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(backup.createdAt).toLocaleString()}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {backup.description && (
                  <p className="text-sm text-muted-foreground mb-3">{backup.description}</p>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    <Badge variant="outline">{formatFileSize(backup.size)}</Badge>
                    <Badge variant={backup.type === 'manual' ? 'default' : 'secondary'}>
                      {backup.type === 'manual' ? 'Manual' : 'Automático'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadBackup(backup.id)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Baixar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => restoreBackup(backup.id)}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Restaurar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteBackup(backup.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BackupManager;
