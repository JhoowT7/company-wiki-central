import { useState, useEffect } from "react";
import { Download, Upload, Trash2, Database, AlertCircle, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { database } from "@/stores/database";
import { Backup } from "@/types";

const BackupManager = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBackupName, setNewBackupName] = useState("");
  const [newBackupDescription, setNewBackupDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadBackups = () => {
      setBackups(database.getBackups());
    };

    loadBackups();
    const unsubscribe = database.subscribe(loadBackups);
    return () => {
      unsubscribe();
    };
  }, []);

  const createBackup = async () => {
    if (!newBackupName.trim()) return;
    
    setIsLoading(true);
    try {
      const backup = database.createBackup(newBackupName, newBackupDescription);
      console.log("Backup criado:", backup);
      setNewBackupName("");
      setNewBackupDescription("");
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Erro ao criar backup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBackup = (backupId: string) => {
    try {
      const backupData = database.exportBackup(backupId);
      const blob = new Blob([backupData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${backupId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar backup:", error);
    }
  };

  const restoreBackup = (backupId: string) => {
    try {
      const success = database.restoreBackup(backupId);
      if (success) {
        console.log("Backup restaurado com sucesso");
      } else {
        console.error("Falha ao restaurar backup");
      }
    } catch (error) {
      console.error("Erro ao restaurar backup:", error);
    }
  };

  const deleteBackup = (backupId: string) => {
    try {
      const success = database.deleteBackup(backupId);
      if (success) {
        console.log("Backup deletado com sucesso");
      }
    } catch (error) {
      console.error("Erro ao deletar backup:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Gerenciamento de Backup
          </h1>
          <p className="text-muted-foreground mt-2">
            Crie, restaure e gerencie backups do seu sistema
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Database className="h-4 w-4 mr-2" />
              Criar Backup
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Backup</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="backupName">Nome do Backup</Label>
                <Input
                  id="backupName"
                  value={newBackupName}
                  onChange={(e) => setNewBackupName(e.target.value)}
                  placeholder="Ex: Backup Semanal - Janeiro 2024"
                />
              </div>
              <div>
                <Label htmlFor="backupDescription">Descrição (opcional)</Label>
                <Textarea
                  id="backupDescription"
                  value={newBackupDescription}
                  onChange={(e) => setNewBackupDescription(e.target.value)}
                  placeholder="Descreva o que este backup contém..."
                />
              </div>
              <Button 
                onClick={createBackup} 
                disabled={!newBackupName.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Criar Backup
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Backups */}
      <div className="grid gap-4">
        {backups.length === 0 ? (
          <Card className="p-12 text-center">
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      {backup.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {backup.description || "Sem descrição"}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={backup.type === 'manual' ? 'default' : 'secondary'}>
                      {backup.type === 'manual' ? 'Manual' : 'Automático'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatFileSize(backup.size)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <p>Criado em: {formatDate(backup.createdAt)}</p>
                    <p>Por: {backup.createdBy}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadBackup(backup.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => restoreBackup(backup.id)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Restaurar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteBackup(backup.id)}
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

export default BackupManager;
