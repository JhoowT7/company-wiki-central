import { useState, useRef } from "react";
import { Upload, File, X, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { database } from "@/stores/database";

interface FileUploaderProps {
  folderId?: string;
  onFileUploaded?: (file: any) => void;
}

const FileUploader = ({ folderId, onFileUploaded }: FileUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      // Simular upload (em um app real, você faria upload para servidor)
      const fileData = {
        name: file.name,
        type: getFileType(file.name),
        size: file.size,
        url: URL.createObjectURL(file), // Temporário para demo
        folderId: folderId,
        uploadedBy: 'user-1',
        uploadedAt: new Date().toISOString()
      };

      // Salvar no banco de dados
      database.createMediaFile(fileData);
      
      setUploadedFiles(prev => [...prev, { ...fileData, id: `file-${Date.now()}-${Math.random()}` }]);
      
      if (onFileUploaded) {
        onFileUploaded(fileData);
      }

      toast({
        title: "Arquivo enviado!",
        description: `${file.name} foi enviado com sucesso.`,
      });
    });
  };

  const getFileType = (fileName: string): 'image' | 'video' | 'audio' | 'document' => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension || '')) return 'image';
    if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension || '')) return 'video';
    if (['mp3', 'wav', 'ogg', 'aac'].includes(extension || '')) return 'audio';
    return 'document';
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

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    database.deleteMediaFile(fileId);
    toast({
      title: "Arquivo removido",
      description: "O arquivo foi removido com sucesso.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Área de Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Arquivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Suporte a: PDF, DOC, XLS, TXT, Imagens, Vídeos e mais
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              Selecionar Arquivos
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleChange}
              className="hidden"
              accept="*/*"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Arquivos Carregados */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Arquivos Carregados ({uploadedFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{file.type}</Badge>
                        <span className="text-sm text-gray-500">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" title="Visualizar">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFile(file.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Remover"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUploader;
