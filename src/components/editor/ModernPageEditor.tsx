
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import { useDropzone } from 'react-dropzone';
import { 
  Bold, Italic, Strikethrough, Underline, Code, Quote, List, ListOrdered,
  Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight,
  Image as ImageIcon, Video, Link as LinkIcon, Table as TableIcon, Plus, Save,
  Eye, EyeOff, Maximize, ArrowLeft, Palette, Type, Highlighter,
  CheckSquare, Upload, FileText, Globe, Lock, Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTheme } from '@/components/ThemeProvider';
import { useToast } from '@/hooks/use-toast';
import { database } from '@/stores/database';

interface ModernPageEditorProps {
  pageId?: string;
  folderId?: string;
  isMainPage?: boolean;
  onSave: (content: any) => void;
  onCancel: () => void;
  onPageCreated?: (pageId: string) => void;
}

const ModernPageEditor: React.FC<ModernPageEditorProps> = ({
  pageId,
  folderId,
  isMainPage = false,
  onSave,
  onCancel,
  onPageCreated
}) => {
  const [title, setTitle] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [category, setCategory] = useState('');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  
  const { theme } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Image.configure({
        inline: true,
        allowBase64: true
      }),
      Youtube.configure({
        controls: false,
        nocookie: true
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true
      })
    ],
    content: '',
    editorProps: {
      attributes: {
        class: `prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[300px] px-6 py-4 ${
          theme === 'dark' 
            ? 'bg-gray-900/50 text-gray-100' 
            : 'bg-white/50 text-gray-900'
        }`
      }
    }
  });

  // Load existing page data
  useEffect(() => {
    if (pageId) {
      const pages = database.getPages();
      const existingPage = pages.find(p => p.id === pageId);
      if (existingPage) {
        setTitle(existingPage.title);
        editor?.commands.setContent(existingPage.content);
        setIsPublic(existingPage.isPublic || false);
        setHasPassword(existingPage.hasPassword || false);
        setPassword(existingPage.password || '');
        setTags(existingPage.tags || []);
        setCategory(existingPage.category || '');
      }
    }
  }, [pageId, editor]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (title || editor?.getHTML()) {
        setIsAutoSaving(true);
        setTimeout(() => setIsAutoSaving(false), 1000);
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [title, editor]);

  // File upload handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      
      if (file.type.startsWith('image/')) {
        editor?.chain().focus().setImage({ src: url }).run();
        
        // Save to database
        database.createMediaFile({
          name: file.name,
          type: 'image',
          url,
          size: file.size,
          folderId,
          uploadedBy: 'user',
          uploadedAt: new Date().toISOString()
        });
      } else {
        // Insert as file link
        const fileLink = `<a href="${url}" download="${file.name}" class="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z"/></svg>${file.name}</a>`;
        editor?.chain().focus().insertContent(fileLink).run();
      }
    });

    toast({
      title: "Arquivos carregados!",
      description: `${acceptedFiles.length} arquivo(s) inserido(s) com sucesso.`,
    });
  }, [editor, folderId, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'video/*': ['.mp4', '.avi', '.mov']
    },
    multiple: true
  });

  const insertYouTube = () => {
    if (youtubeUrl) {
      editor?.commands.setYoutubeVideo({
        src: youtubeUrl,
        width: 640,
        height: 480
      });
      setYoutubeUrl('');
    }
  };

  const insertLink = () => {
    if (linkUrl) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
    }
  };

  const insertCallout = (type: 'info' | 'warning' | 'success' | 'error') => {
    const colors = {
      info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
      success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
      error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
    };

    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      success: '✅',
      error: '❌'
    };

    const calloutHtml = `
      <div class="callout p-4 my-4 rounded-lg border-l-4 ${colors[type]}">
        <div class="flex items-start gap-3">
          <span class="text-xl">${icons[type]}</span>
          <div class="flex-1">
            <p class="font-semibold mb-1">${type.charAt(0).toUpperCase() + type.slice(1)}</p>
            <p>Digite sua mensagem aqui...</p>
          </div>
        </div>
      </div>
    `;
    
    editor?.chain().focus().insertContent(calloutHtml).run();
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

    const content = editor?.getHTML() || '';
    
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

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Carregando editor...</span>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isFullscreen && (
              <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Sair da tela cheia
              </Button>
            )}
            
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isMainPage ? "Título da página principal..." : "Título da página..."}
              className="text-xl font-semibold border-none bg-transparent focus:ring-0 px-0"
            />
            
            {isAutoSaving && (
              <Badge variant="secondary" className="animate-pulse">
                Salvando automaticamente...
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize className="h-4 w-4" />
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

        {/* Toolbar */}
        {!isPreview && (
          <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 rounded-lg">
            {/* Text formatting */}
            <Button
              variant={editor.isActive('bold') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('italic') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('strike') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Headings */}
            <Button
              variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Lists */}
            <Button
              variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive('taskList') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
            >
              <CheckSquare className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Alignment */}
            <Button
              variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            
            <Button
              variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Colors */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Palette className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Cor do texto</p>
                    <div className="grid grid-cols-6 gap-2">
                      {['#000000', '#374151', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'].map(color => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
                          style={{ backgroundColor: color }}
                          onClick={() => editor.chain().focus().setColor(color).run()}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Destacar</p>
                    <div className="grid grid-cols-6 gap-2">
                      {['#FEF3C7', '#DBEAFE', '#D1FAE5', '#FCE7F3', '#E0E7FF', '#F3E8FF'].map(color => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
                          style={{ backgroundColor: color }}
                          onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Media */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => e.target.files && onDrop(Array.from(e.target.files))}
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Inserir vídeo do YouTube</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="Cole o link do YouTube aqui..."
                  />
                  <Button onClick={insertYouTube} className="w-full">
                    Inserir vídeo
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Inserir link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://exemplo.com"
                  />
                  <Button onClick={insertLink} className="w-full">
                    Inserir link
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            >
              <TableIcon className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Callouts */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => insertCallout('info')}
                  >
                    ℹ️ Informação
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => insertCallout('warning')}
                  >
                    ⚠️ Atenção
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => insertCallout('success')}
                  >
                    ✅ Sucesso
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => insertCallout('error')}
                  >
                    ❌ Erro
                  </Button>
                  <Separator />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  >
                    <Minus className="h-4 w-4 mr-2" />
                    Separador
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

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
      <div className="flex-1 overflow-hidden">
        {!isPreview ? (
          <div 
            {...getRootProps()} 
            className={`h-full ${isDragActive ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-700' : ''}`}
          >
            <input {...getInputProps()} />
            <EditorContent 
              editor={editor} 
              className="h-full overflow-y-auto p-6"
            />
            {isDragActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-50/90 dark:bg-blue-900/30 backdrop-blur-sm">
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <p className="text-lg font-medium text-blue-700 dark:text-blue-300">
                    Solte os arquivos aqui
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Imagens, PDFs, documentos e vídeos
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full p-6 overflow-y-auto bg-muted/20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">{title || 'Título da página'}</h1>
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernPageEditor;
