
import React, { useState, useEffect, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Image, 
  Video, 
  Link, 
  Save, 
  Eye, 
  EyeOff,
  Upload,
  Hash,
  Quote,
  Code,
  Undo,
  Redo,
  ChevronDown,
  FileText,
  Calendar,
  User,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface AdvancedEditorProps {
  pageId?: string;
  onSave: (content: any) => void;
  onCancel: () => void;
  initialContent?: string;
  initialTitle?: string;
}

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
}

const AdvancedEditor: React.FC<AdvancedEditorProps> = ({
  pageId,
  onSave,
  onCancel,
  initialContent = '',
  initialTitle = ''
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isPreview, setIsPreview] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<MediaFile[]>([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showQuickCommands, setShowQuickCommands] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (title || content) {
        setIsAutoSaving(true);
        // Simulate auto-save
        setTimeout(() => setIsAutoSaving(false), 1000);
      }
    }, 5000);

    return () => clearInterval(autoSaveInterval);
  }, [title, content]);

  // Quick commands handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && editorRef.current === document.activeElement) {
        setShowQuickCommands(true);
      }
      
      // Keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'b':
            e.preventDefault();
            insertFormatting('**', '**');
            break;
          case 'i':
            e.preventDefault();
            insertFormatting('*', '*');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const insertFormatting = (before: string, after: string) => {
    if (!editorRef.current) return;
    
    const start = editorRef.current.selectionStart;
    const end = editorRef.current.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newContent);
    
    // Reset cursor position
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.selectionStart = start + before.length;
        editorRef.current.selectionEnd = end + before.length;
        editorRef.current.focus();
      }
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    if (!editorRef.current) return;
    
    const start = editorRef.current.selectionStart;
    const newContent = content.substring(0, start) + text + content.substring(start);
    
    setContent(newContent);
    
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.selectionStart = start + text.length;
        editorRef.current.selectionEnd = start + text.length;
        editorRef.current.focus();
      }
    }, 0);
  };

  const handleFileUpload = async (files: FileList) => {
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      const mediaFile: MediaFile = {
        id: Date.now().toString(),
        name: file.name,
        url,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        size: file.size
      };
      
      setMediaLibrary(prev => [...prev, mediaFile]);
      
      if (mediaFile.type === 'image') {
        insertAtCursor(`![${file.name}](${url})\n`);
      } else if (mediaFile.type === 'video') {
        insertAtCursor(`[Video: ${file.name}](${url})\n`);
      }
    });
  };

  const handleSave = () => {
    const pageData = {
      id: pageId || Date.now().toString(),
      title,
      content,
      tags,
      category,
      status,
      lastModified: new Date().toISOString()
    };
    
    onSave(pageData);
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const quickCommands = [
    { label: 'Título', command: '# ', icon: Hash },
    { label: 'Lista', command: '- ', icon: List },
    { label: 'Lista Numerada', command: '1. ', icon: ListOrdered },
    { label: 'Citação', command: '> ', icon: Quote },
    { label: 'Código', command: '```\n\n```', icon: Code },
    { label: 'Imagem', command: '![alt](url)', icon: Image }
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da página..."
              className="text-xl font-semibold border-none bg-transparent focus:ring-0 px-0"
            />
            {isAutoSaving && (
              <Badge variant="secondary" className="animate-pulse">
                Salvando...
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSplitView(!isSplitView)}
              className={isSplitView ? 'bg-accent' : ''}
            >
              <FileText className="h-4 w-4 mr-2" />
              Split View
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
              className={isPreview ? 'bg-accent' : ''}
            >
              {isPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('**', '**')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('*', '*')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('~~', '~~')}
          >
            <Underline className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertAtCursor('# ')}
          >
            <Hash className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertAtCursor('- ')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertAtCursor('1. ')}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertAtCursor('> ')}
          >
            <Quote className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
          </Button>
          
          <Dialog open={showMediaLibrary} onOpenChange={setShowMediaLibrary}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Image className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Biblioteca de Mídia</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {mediaLibrary.map(file => (
                  <Card key={file.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-2">
                      {file.type === 'image' ? (
                        <img src={file.url} alt={file.name} className="w-full h-20 object-cover rounded" />
                      ) : (
                        <div className="w-full h-20 bg-muted rounded flex items-center justify-center">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <p className="text-xs mt-1 truncate">{file.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-1">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add tag..."
                className="w-20 h-6 text-xs"
              />
            </div>
          </div>
          
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="text-xs border rounded px-2 py-1"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </select>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className={`${isSplitView ? 'w-1/2' : 'w-full'} relative`}>
          <Textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite / para comandos rápidos..."
            className="w-full h-full resize-none border-none focus:ring-0 p-6 font-mono text-sm leading-relaxed"
            style={{ minHeight: 'calc(100vh - 200px)' }}
            onDrop={(e) => {
              e.preventDefault();
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                handleFileUpload(files);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
          />
          
          {/* Quick Commands */}
          {showQuickCommands && (
            <Card className="absolute top-6 left-6 w-64 z-10 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Comandos Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {quickCommands.map((cmd, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      insertAtCursor(cmd.command);
                      setShowQuickCommands(false);
                    }}
                  >
                    <cmd.icon className="h-4 w-4 mr-2" />
                    {cmd.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview */}
        {(isPreview || isSplitView) && (
          <div className={`${isSplitView ? 'w-1/2 border-l' : 'w-full'} p-6 overflow-y-auto bg-muted/20`}>
            <div className="prose dark:prose-invert max-w-none">
              <h1>{title || 'Título da página'}</h1>
              <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedEditor;
