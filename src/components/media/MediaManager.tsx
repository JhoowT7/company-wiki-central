import { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Video, Music, FileText, Youtube, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { database } from "@/stores/database";
import { MediaFile } from "@/types";
import { useToast } from "@/hooks/use-toast";

const MediaManager = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadMedia = () => {
      setMediaFiles(database.getMediaFiles());
    };

    loadMedia();
    const unsubscribe = database.subscribe(loadMedia);
    return () => {
      unsubscribe();
    };
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      try {
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('video/') ? 'video' : 
                    file.type.startsWith('audio/') ? 'audio' : 'document';

        database.createMediaFile({
          name: file.name,
          url,
          type,
          size: file.size,
          uploadedBy: 'user-1',
          uploadedAt: new Date().toISOString()
        });

        toast({
          title: "Sucesso",
          description: `Arquivo ${file.name} enviado com sucesso!`,
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: `Erro ao enviar arquivo ${file.name}`,
          variant: "destructive"
        });
      }
    });

    // Reset input
    event.target.value = '';
  };

  const addYoutubeVideo = () => {
    if (!youtubeUrl.trim()) {
      toast({
        title: "Erro",
        description: "URL do YouTube é obrigatória",
        variant: "destructive"
      });
      return;
    }

    try {
      // Extract video ID from YouTube URL
      const videoId = extractYouTubeVideoId(youtubeUrl);
      if (!videoId) {
        toast({
          title: "Erro",
          description: "URL do YouTube inválida",
          variant: "destructive"
        });
        return;
      }

      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      
      database.createMediaFile({
        name: `YouTube Video - ${videoId}`,
        url: youtubeUrl,
        type: 'youtube',
        size: 0,
        thumbnailUrl,
        uploadedBy: 'user-1',
        uploadedAt: new Date().toISOString()
      });

      toast({
        title: "Sucesso",
        description: "Vídeo do YouTube adicionado com sucesso!",
      });

      setYoutubeUrl('');
      setIsUploadDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar vídeo do YouTube",
        variant: "destructive"
      });
    }
  };

  const deleteMedia = (id: string) => {
    try {
      const success = database.deleteMediaFile(id);
      if (success) {
        toast({
          title: "Sucesso",
          description: "Arquivo excluído com sucesso!",
        });
      } else {
        toast({
          title: "Erro",
          description: "Arquivo não encontrado",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir arquivo",
        variant: "destructive"
      });
    }
  };

  const extractYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'audio': return <Music className="h-5 w-5" />;
      case 'youtube': return <Youtube className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ImageIcon className="h-8 w-8 text-primary" />
            Biblioteca de Mídia
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas imagens, vídeos, áudios e links do YouTube
          </p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button asChild className="bg-primary hover:bg-primary/90">
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Enviar Arquivos
            </label>
          </Button>
          
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Youtube className="h-4 w-4 mr-2" />
                Adicionar YouTube
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Vídeo do YouTube</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>URL do YouTube</Label>
                  <Input
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <Button onClick={addYoutubeVideo} disabled={!youtubeUrl.trim()} className="w-full">
                  Adicionar Vídeo
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista de Arquivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mediaFiles.length === 0 ? (
          <Card className="col-span-full p-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum arquivo encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Envie seus primeiros arquivos ou adicione vídeos do YouTube
            </p>
            <div className="flex gap-2 justify-center">
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Enviar Arquivos
                </label>
              </Button>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(true)}>
                Adicionar YouTube
              </Button>
            </div>
          </Card>
        ) : (
          mediaFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.type)}
                    <Badge variant="outline">{file.type}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteMedia(file.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {(file.type === 'image' || file.thumbnailUrl) && (
                  <div className="mb-3 rounded-lg overflow-hidden bg-muted">
                    <img 
                      src={file.thumbnailUrl || file.url} 
                      alt={file.name}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                <h4 className="font-medium text-sm mb-2 truncate" title={file.name}>
                  {file.name}
                </h4>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  {file.size && <span>{formatFileSize(file.size)}</span>}
                  <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MediaManager;
