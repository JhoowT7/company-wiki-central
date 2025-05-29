
import React, { useState } from 'react';
import { Upload, Search, Filter, Grid, List, File, Image, Video, FileText, Trash2, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
}

const MediaLibrary: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'organograma-empresa.png',
      url: '/placeholder.svg',
      type: 'image',
      size: 245760,
      uploadedBy: 'João Silva',
      uploadedAt: '2024-01-20',
      tags: ['organograma', 'estrutura']
    },
    {
      id: '2',
      name: 'manual-procedimentos.pdf',
      url: '/placeholder.svg',
      type: 'document',
      size: 1048576,
      uploadedBy: 'Maria Santos',
      uploadedAt: '2024-01-19',
      tags: ['manual', 'procedimentos']
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-8 w-8 text-blue-500" />;
      case 'video': return <Video className="h-8 w-8 text-purple-500" />;
      default: return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Biblioteca de Mídia</h2>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload de Arquivos
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar arquivos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">Todos os arquivos</option>
            <option value="image">Imagens</option>
            <option value="video">Vídeos</option>
            <option value="document">Documentos</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Files Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map(file => (
            <Card key={file.id} className="cursor-pointer hover:shadow-md transition-shadow group">
              <CardContent className="p-4">
                <div className="flex flex-col items-center space-y-2">
                  {file.type === 'image' ? (
                    <img src={file.url} alt={file.name} className="w-full h-20 object-cover rounded" />
                  ) : (
                    <div className="w-full h-20 bg-muted rounded flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  
                  <div className="w-full">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" onClick={() => setSelectedFile(file)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map(file => (
            <Card key={file.id} className="cursor-pointer hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>Por {file.uploadedBy}</span>
                        <span>•</span>
                        <span>{file.uploadedAt}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {file.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setSelectedFile(file)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* File Preview Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4">
              {selectedFile.type === 'image' ? (
                <img src={selectedFile.url} alt={selectedFile.name} className="w-full max-h-96 object-contain" />
              ) : (
                <div className="flex items-center justify-center h-48 bg-muted rounded">
                  {getFileIcon(selectedFile.type)}
                  <span className="ml-2">Preview não disponível</span>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Tamanho:</strong> {formatFileSize(selectedFile.size)}
                </div>
                <div>
                  <strong>Tipo:</strong> {selectedFile.type}
                </div>
                <div>
                  <strong>Enviado por:</strong> {selectedFile.uploadedBy}
                </div>
                <div>
                  <strong>Data:</strong> {selectedFile.uploadedAt}
                </div>
              </div>
              
              {selectedFile.tags.length > 0 && (
                <div>
                  <strong>Tags:</strong>
                  <div className="flex gap-1 mt-1">
                    {selectedFile.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaLibrary;
