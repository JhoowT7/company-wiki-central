
import { useState, useEffect, useRef } from "react";
import { Upload, Image, Video, FileText, ExternalLink, Trash2, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { database } from "@/stores/database";
import { MediaFile } from "@/types";

const MediaManager = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadMedia = () => {
      setMediaFiles(database.getMediaFiles());
    };

    loadMedia();
    const unsubscribe = database.subscribe(loadMedia);
    return unsubscribe;
  }, []);

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const addYouTubeVideo = () => {
    if (!youtubeUrl.trim()) return;

    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      alert('URL do YouTube inválida');
      return;
    }

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    
    database.createMediaFile({
      name: `YouTube Video - ${videoId}`,
      url: youtubeUrl,
      type: 'youtube',
      thumbnailUrl,
      uploadedBy: 'user-1',
      folderId: selectedFolder || undefined
    });

    setYoutubeUrl('');
    setIsYoutubeDialogOpen(false);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        let type: MediaFile['type'] = 'document';
        if (file.type.startsWith('image/')) type = 'image';
        else if (file.type.startsWith('video/')) type = 'video';
        else if (file.type.startsWith('audio/')) type = 'audio';

        database.createMediaFile({
          name: file.name,
          url: result,
          type,
          size: file.size,
          uploadedBy: 'user-1',
          folderId: selectedFolder || undefined
        });
      };
      reader.readAsDataURL(file);
    });

    setIsUploadDialogOpen(false);
  };

  const deleteMedia = (id: string) => {
    database.deleteMediaFile(id);
  };

  const getMediaIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'image': return <Image className="h-6 w-6" />;
      case 'video': return <Video className="h-6 w-6" />;
      case 'youtube': return <Youtube className="h-6 w-6" />;
      case 'audio': return <FileText className="h-6 w-6" />;
      default: return <FileText className="h-6 w-6" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Image className="h-8 w-8 text-primary" />
            Biblioteca de Mídia
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie imagens, vídeos e outros arquivos
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload de Arquivos</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Pasta de destino (opcional)</Label>
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Nenhuma pasta</option>
                    {database.getFolders().map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.icon} {folder.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label>Selecionar arquivos</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isYoutubeDialogOpen} onOpenChange={setIsYoutubeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Youtube className="h-4 w-4 mr-2" />
                YouTube
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
                
                <div>
                  <Label>Pasta de destino (opcional)</Label>
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Nenhuma pasta</option>
                    {database.getFolders().map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.icon} {folder.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button onClick={addYouTubeVideo} disabled={!youtubeUrl.trim()} className="w-full">
                  Adicionar Vídeo
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Lista de Mídia */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mediaFiles.map((media) => (
          <Card key={media.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getMediaIcon(media.type)}
                  <Badge variant="outline" className="text-xs">
                    {media.type}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMedia(media.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Preview */}
              {media.type === 'image' && (
                <img 
                  src={media.url} 
                  alt={media.name}
                  className="w-full h-32 object-cover rounded"
                />
              )}
              {media.type === 'youtube' && media.thumbnailUrl && (
                <div className="relative">
                  <img 
                    src={media.thumbnailUrl} 
                    alt={media.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <Youtube className="absolute inset-0 m-auto h-8 w-8 text-white bg-red-600 rounded-full p-1" />
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-sm truncate" title={media.name}>
                  {media.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(media.size)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(media.uploadedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open(media.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {mediaFiles.length === 0 && (
        <Card className="p-12 text-center">
          <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum arquivo encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Faça upload de imagens, vídeos ou adicione links do YouTube
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              Fazer Upload
            </Button>
            <Button variant="outline" onClick={() => setIsYoutubeDialogOpen(true)}>
              Adicionar YouTube
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MediaManager;
