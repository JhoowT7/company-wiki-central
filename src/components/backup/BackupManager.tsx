
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  Upload, 
  Database, 
  Calendar, 
  FileText, 
  Shield, 
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { database } from "@/stores/database";
import { Backup } from "@/types";
import { useToast } from "@/hooks/use-toast";

const BackupManager = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newBackupName, setNewBackupName] = useState("");
  const [newBackupDescription, setNewBackupDescription] = useState("");
  const [stats, setStats] = useState({
    totalFolders: 0,
    totalPages: 0,
    totalCTFs: 0,
    totalBackups: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = database.subscribe(() => {
      setBackups(database.getBackups());
      setStats(database.getStats());
    });

    // Carregar dados iniciais
    setBackups(database.getBackups());
    setStats(database.getStats());

    return unsubscribe;
  }, []);

  const handleCreateBackup = async () => {
    if (!newBackupName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do backup é obrigatório",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular processamento
      
      const backup = database.createBackup(
        newBackupName.trim(),
        newBackupDescription.trim() || undefined
      );

      toast({
        title: "Backup criado com sucesso!",
        description: `Backup "${backup.name}" foi criado e salvo.`,
      });

      setNewBackupName("");
      setNewBackupDescription("");
    } catch (error) {
      toast({
        title: "Erro ao criar backup",
        description: "Ocorreu um erro durante a criação do backup.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    const backup = backups.find(b => b.id === backupId);
    if (!backup) return;

    try {
      const success = database.restoreBackup(backupId);
      if (success) {
        toast({
          title: "Backup restaurado!",
          description: `Sistema restaurado para o estado do backup "${backup.name}".`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao restaurar backup",
        description: "Não foi possível restaurar o backup selecionado.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadBackup = (backupId: string) => {
    try {
      const backup = backups.find(b => b.id === backupId);
      if (!backup) return;

      const dataStr = database.exportBackup(backupId);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${backup.name}_${backup.createdAt.toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download iniciado",
        description: "O arquivo de backup está sendo baixado.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o backup.",
        variant: "destructive"
      });
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
    <div className="container mx-auto p-6 space-y-8 animate-fade-in">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Gerenciamento de Backups
        </h1>
        <p className="text-muted-foreground">
          Crie, gerencie e restaure backups completos do seu sistema
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-glow transition-all duration-300 border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pastas</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalFolders}</p>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-glow transition-all duration-300 border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Páginas</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalPages}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-glow transition-all duration-300 border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CTFs</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalCTFs}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-glow transition-all duration-300 border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Backups</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalBackups}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Criar Novo Backup */}
        <div className="lg:col-span-1">
          <Card className="hover-lift">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Criar Novo Backup
              </CardTitle>
              <CardDescription>
                Gere um backup completo dos dados atuais
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backup-name">Nome do Backup</Label>
                <Input
                  id="backup-name"
                  placeholder="Ex: Backup Mensal Janeiro 2024"
                  value={newBackupName}
                  onChange={(e) => setNewBackupName(e.target.value)}
                  className="focus-ring"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backup-description">Descrição (Opcional)</Label>
                <Textarea
                  id="backup-description"
                  placeholder="Descreva o motivo ou contexto deste backup..."
                  value={newBackupDescription}
                  onChange={(e) => setNewBackupDescription(e.target.value)}
                  className="min-h-[80px] focus-ring"
                />
              </div>

              <Button 
                onClick={handleCreateBackup}
                disabled={isCreating || !newBackupName.trim()}
                className="w-full hover-scale"
              >
                {isCreating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Criando Backup...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Criar Backup
                  </>
                )}
              </Button>

              <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                O backup incluirá todas as pastas, páginas, CTFs e configurações atuais.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Backups */}
        <div className="lg:col-span-2">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Backups Disponíveis
              </CardTitle>
              <CardDescription>
                Histórico de backups criados
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                {backups.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Nenhum backup encontrado</p>
                    <p className="text-sm">Crie seu primeiro backup para começar</p>
                  </div>
                ) : (
                  <div className="space-y-4 p-6">
                    {backups.map((backup, index) => (
                      <Card 
                        key={backup.id} 
                        className="hover-glow transition-all duration-300 border-l-4 border-l-primary/50"
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{backup.name}</h3>
                                <Badge variant={backup.type === 'manual' ? 'default' : 'secondary'}>
                                  {backup.type === 'manual' ? 'Manual' : 'Automático'}
                                </Badge>
                              </div>
                              
                              {backup.description && (
                                <p className="text-muted-foreground mb-3">{backup.description}</p>
                              )}
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{formatDate(backup.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Database className="h-4 w-4 text-muted-foreground" />
                                  <span>{formatFileSize(backup.size)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadBackup(backup.id)}
                                className="hover-scale"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Baixar
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleRestoreBackup(backup.id)}
                                className="hover-scale"
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Restaurar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BackupManager;
