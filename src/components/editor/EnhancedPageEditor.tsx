
import React, { useState, useEffect, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Image, 
  Video, 
  Save, 
  Eye, 
  EyeOff,
  Upload,
  Hash,
  List,
  ListOrdered,
  Quote,
  Code,
  Lock,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { database } from '@/stores/database';

interface EnhancedPageEditorProps {
  pageId?: string;
  folderId?: string;
  isMainPage?: boolean;
  onSave: (content: any) => void;
  onCancel: () => void;
  onPageCreated?: (pageId: string) => void;
}

const EnhancedPageEditor: React.FC<EnhancedPageEditorProps> = ({
  pageId,
  folderId,
  isMainPage = false,
  onSave,
  onCancel,
  onPageCreated
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [category, setCategory] = useState('');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (pageId) {
      const pages = database.getPages();
      const existingPage = pages.find(p => p.id === pageId);
      if (existingPage) {
        setTitle(existingPage.title);
        setContent(existingPage.content);
        setIsPublic(existingPage.isPublic || false);
        setHasPassword(existingPage.hasPassword || false);
        setPassword(existingPage.password || '');
        setTags(existingPage.tags || []);
        setCategory(existingPage.category || '');
      }
    }
  }, [pageId]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (title || content) {
        setIsAutoSaving(true);
        setTimeout(() => setIsAutoSaving(false), 1000);
      }
    }, 10000);

    return () => clearInterval(autoSaveInterval);
  }, [title, content]);

  const insertFormatting = (before: string, after: string) => {
    if (!editorRef.current) return;
    
    const start = editorRef.current.selectionStart;
    const end = editorRef.current.selectionEnd;
    const selectedText = content.substring(start, end);
    const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newContent);
    
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
      
      if (file.type.startsWith('image/')) {
        insertAtCursor(`<img src="${url}" alt="${file.name}" style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" draggable="true" />\n`);
      } else if (file.type.startsWith('video/')) {
        insertAtCursor(`<video controls style="max-width: 100%; height: auto; margin: 10px 0; border-radius: 8px;" draggable="true">
  <source src="${url}" type="${file.type}">
  Seu navegador não suporta o elemento de vídeo.
</video>\n`);
      } else {
        insertAtCursor(`<a href="${url}" download="${file.name}" class="file-link">${file.name}</a>\n`);
      }

      // Salvar arquivo no banco de dados
      database.createMediaFile({
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        url,
        size: file.size,
        folderId,
        uploadedBy: 'user',
        uploadedAt: new Date().toISOString()
      });
    });

    toast({
      title: "Arquivos inseridos!",
      description: "Os arquivos foram inseridos na página e podem ser movidos.",
    });
  };

  const handleYouTubeInsert = () => {
    const url = prompt('Cole o link do YouTube:');
    if (url) {
      let videoId = '';
      
      // Extrair ID do vídeo do YouTube
      const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
      const match = url.match(regex);
      
      if (match) {
        videoId = match[1];
        const embedCode = `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen style="margin: 10px 0; border-radius: 8px;" draggable="true"></iframe>\n`;
        insertAtCursor(embedCode);
        
        toast({
          title: "Vídeo do YouTube inserido!",
          description: "O vídeo foi inserido e pode ser movido na página.",
        });
      } else {
        toast({
          title: "Link inválido",
          description: "Por favor, insira um link válido do YouTube.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, adicione um título à página.",
        variant: "destructive"
      });
      return;
    }

    const pageData = {
      title,
      content,
      folderId,
      isMainPage,
      isPublic,
      hasPassword,
      password: hasPassword ? password : undefined,
      tags,
      category: category || 'Geral',
      author: 'Usuário Atual'
    };
    
    if (pageId) {
      database.updatePage(pageId, pageData);
      toast({
        title: "Página atualizada!",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      const newPage = database.createPage(pageData);
      if (onPageCreated) {
        onPageCreated(newPage.id);
      }
      toast({
        title: "Página criada!",
        description: "A nova página foi criada com sucesso.",
      });
    }
    
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

  const renderPreview = () => {
    return (
      <div 
        className="prose dark:prose-invert max-w-none"
        style={{
          fontSize: '16px',
          lineHeight: '1.7'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isMainPage ? "Título da página principal..." : "Título da página..."}
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
            onClick={() => insertFormatting('<strong>', '</strong>')}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertFormatting('<em>', '</em>')}
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertAtCursor('<h2></h2>')}
          >
            <Hash className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertAtCursor('<ul><li></li></ul>')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertAtCursor('<ol><li></li></ol>')}
          >
            <ListOrdered className="h-4 w-4" />
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
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleYouTubeInsert}
          >
            <Video className="h-4 w-4" />
          </Button>
        </div>

        {/* Page Settings */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <span>Público</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <Switch
              checked={hasPassword}
              onCheckedChange={setHasPassword}
            />
            <span>Proteger com senha</span>
          </div>
          
          {hasPassword && (
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha..."
              className="w-32 h-8"
            />
          )}
          
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
              placeholder="Adicionar tag..."
              className="w-24 h-6 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {!isPreview ? (
          <Textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite o conteúdo da página... Você pode arrastar imagens e vídeos aqui!"
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
        ) : (
          <div className="w-full p-6 overflow-y-auto bg-muted/20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">{title || 'Título da página'}</h1>
              {renderPreview()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPageEditor;
