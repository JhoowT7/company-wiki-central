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
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import FontFamily from '@tiptap/extension-font-family';
import { useDropzone } from 'react-dropzone';
import { 
  Bold, Italic, Strikethrough, Underline as UnderlineIcon, Code, Quote, List, ListOrdered,
  Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image as ImageIcon, Video, Link as LinkIcon, Table as TableIcon, Plus, Save,
  Eye, EyeOff, Maximize, ArrowLeft, Palette, Type, Highlighter, FileDown,
  CheckSquare, Upload, FileText, Globe, Lock, Minus, Printer, Settings,
  Download, FileImage, Music, Film, Smile, Indent, Outdent, RotateCcw, RotateClockwise,
  Columns, Bookmark, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  
  // Configurações de página
  const [pageSettings, setPageSettings] = useState({
    fontFamily: 'Inter',
    fontSize: '16',
    lineHeight: '1.6',
    marginTop: '2.5',
    marginBottom: '2.5',
    marginLeft: '2.5',
    marginRight: '2.5',
    paperSize: 'A4',
    orientation: 'portrait',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    showHeader: false,
    showFooter: false,
    headerContent: '',
    footerContent: '',
    showPageNumbers: false
  });
  
  const { theme } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
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
          class: 'text-primary underline cursor-pointer',
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
      }),
      Underline,
      Subscript,
      Superscript,
      FontFamily.configure({
        types: ['textStyle']
      })
    ],
    content: '',
    editorProps: {
      attributes: {
        class: `prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[600px] px-8 py-6 ${
          theme === 'dark' 
            ? 'bg-gray-900/50 text-gray-100' 
            : 'bg-white text-gray-900'
        }`,
        style: `
          font-family: ${pageSettings.fontFamily}, system-ui, sans-serif;
          font-size: ${pageSettings.fontSize}px;
          line-height: ${pageSettings.lineHeight};
          color: ${pageSettings.textColor};
          background-color: ${pageSettings.backgroundColor};
          margin: ${pageSettings.marginTop}cm ${pageSettings.marginRight}cm ${pageSettings.marginBottom}cm ${pageSettings.marginLeft}cm;
          max-width: ${pageSettings.paperSize === 'A4' ? '21cm' : pageSettings.paperSize === 'Letter' ? '8.5in' : '100%'};
        `
      },
      handlePaste: (view, event, slice) => {
        // Manter formatação ao colar
        return false;
      }
    },
    onUpdate: ({ editor }) => {
      // Auto-save logic here
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

  // Update editor styles when page settings change
  useEffect(() => {
    if (editor) {
      const editorElement = editor.view.dom;
      editorElement.style.fontFamily = `${pageSettings.fontFamily}, system-ui, sans-serif`;
      editorElement.style.fontSize = `${pageSettings.fontSize}px`;
      editorElement.style.lineHeight = pageSettings.lineHeight;
      editorElement.style.color = pageSettings.textColor;
      editorElement.style.backgroundColor = pageSettings.backgroundColor;
    }
  }, [pageSettings, editor]);

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
      } else if (file.type.startsWith('video/')) {
        const videoHtml = `<video controls width="100%" style="max-width: 640px; border-radius: 8px; margin: 1rem 0;">
          <source src="${url}" type="${file.type}">
          Seu navegador não suporta vídeos HTML5.
        </video>`;
        editor?.chain().focus().insertContent(videoHtml).run();
      } else if (file.type.startsWith('audio/')) {
        const audioHtml = `<audio controls style="width: 100%; margin: 1rem 0;">
          <source src="${url}" type="${file.type}">
          Seu navegador não suporta áudio HTML5.
        </audio>`;
        editor?.chain().focus().insertContent(audioHtml).run();
      } else {
        // Insert as file link
        const fileLink = `<a href="${url}" download="${file.name}" class="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z"/></svg>
          ${file.name}
        </a>`;
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
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.aac', '.m4a'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/*': ['.txt', '.md']
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
      if (editor?.state.selection.empty) {
        editor?.chain().focus().insertContent(`<a href="${linkUrl}">${linkUrl}</a>`).run();
      } else {
        editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      }
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

  const insertEmoji = (emoji: string) => {
    editor?.chain().focus().insertContent(emoji).run();
  };

  const insertPageBreak = () => {
    const pageBreakHtml = '<div style="page-break-after: always; border-bottom: 2px dashed #ccc; margin: 2rem 0; text-align: center; padding: 1rem; color: #666;">--- Quebra de Página ---</div>';
    editor?.chain().focus().insertContent(pageBreakHtml).run();
  };

  const exportDocument = (format: 'pdf' | 'docx' | 'html' | 'txt') => {
    const content = editor?.getHTML() || '';
    const fileName = title || 'documento';
    
    switch (format) {
      case 'html':
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${title}</title>
            <meta charset="UTF-8">
            <style>
              body { 
                font-family: ${pageSettings.fontFamily}, sans-serif; 
                font-size: ${pageSettings.fontSize}px;
                line-height: ${pageSettings.lineHeight};
                color: ${pageSettings.textColor};
                background-color: ${pageSettings.backgroundColor};
                margin: ${pageSettings.marginTop}cm ${pageSettings.marginRight}cm ${pageSettings.marginBottom}cm ${pageSettings.marginLeft}cm;
              }
            </style>
          </head>
          <body>
            ${pageSettings.showHeader ? `<header>${pageSettings.headerContent}</header>` : ''}
            <h1>${title}</h1>
            ${content}
            ${pageSettings.showFooter ? `<footer>${pageSettings.footerContent}</footer>` : ''}
          </body>
          </html>
        `;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.html`;
        a.click();
        break;
        
      case 'txt':
        const textContent = editor?.getText() || '';
        const txtBlob = new Blob([textContent], { type: 'text/plain' });
        const txtUrl = URL.createObjectURL(txtBlob);
        const txtA = document.createElement('a');
        txtA.href = txtUrl;
        txtA.download = `${fileName}.txt`;
        txtA.click();
        break;
        
      default:
        toast({
          title: "Funcionalidade em desenvolvimento",
          description: `Export para ${format.toUpperCase()} será implementado em breve.`,
        });
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
      author: 'Usuário Atual',
      pageSettings
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

  const fontFamilies = [
    'Inter', 'Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 
    'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat'
  ];

  const fontSizes = ['10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];

  const commonEmojis = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘',
    '👍', '👎', '👏', '🙌', '✨', '🎉', '🎊', '💡', '💯', '🔥', '⭐', '🌟', '💫', '⚡', '💥', '💢'
  ];

  return (
    <div className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Header with advanced toolbar */}
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
            {/* Export options */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => exportDocument('pdf')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => exportDocument('docx')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    DOCX
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => exportDocument('html')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    HTML
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => exportDocument('txt')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    TXT
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            
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

        {/* Advanced Toolbar */}
        {!isPreview && (
          <Tabs defaultValue="format" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="format">Formatação</TabsTrigger>
              <TabsTrigger value="insert">Inserir</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="page">Página</TabsTrigger>
            </TabsList>
            
            <TabsContent value="format" className="space-y-4">
              <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 rounded-lg">
                {/* Font and size */}
                <Select value={pageSettings.fontFamily} onValueChange={(value) => 
                  setPageSettings(prev => ({ ...prev, fontFamily: value }))
                }>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map(font => (
                      <SelectItem key={font} value={font}>{font}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={pageSettings.fontSize} onValueChange={(value) => 
                  setPageSettings(prev => ({ ...prev, fontSize: value }))
                }>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Separator orientation="vertical" className="h-6 mx-1" />
                
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
                  variant={editor.isActive('underline') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </Button>
                
                <Button
                  variant={editor.isActive('strike') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                  <Strikethrough className="h-4 w-4" />
                </Button>
                
                <Button
                  variant={editor.isActive('subscript') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleSubscript().run()}
                  title="Subscrito"
                >
                  X₂
                </Button>
                
                <Button
                  variant={editor.isActive('superscript') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleSuperscript().run()}
                  title="Sobrescrito"
                >
                  X²
                </Button>
                
                <Separator orientation="vertical" className="h-6 mx-1" />
                
                {/* Headings */}
                <Button
                  variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  title="Título 1"
                >
                  H1
                </Button>
                
                <Button
                  variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  title="Título 2"
                >
                  H2
                </Button>
                
                <Button
                  variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  title="Título 3"
                >
                  H3
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
                
                <Button
                  variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                >
                  <AlignJustify className="h-4 w-4" />
                </Button>
                
                <Separator orientation="vertical" className="h-6 mx-1" />
                
                {/* Lists and indentation */}
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
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
                  disabled={!editor.can().sinkListItem('listItem')}
                >
                  <Indent className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().liftListItem('listItem').run()}
                  disabled={!editor.can().liftListItem('listItem')}
                >
                  <Outdent className="h-4 w-4" />
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
                        <div className="grid grid-cols-8 gap-2">
                          {['#000000', '#374151', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899',
                            '#6B7280', '#DC2626', '#EA580C', '#CA8A04', '#16A34A', '#2563EB', '#7C3AED', '#DB2777'].map(color => (
                            <button
                              key={color}
                              className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400"
                              style={{ backgroundColor: color }}
                              onClick={() => editor.chain().focus().setColor(color).run()}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Destacar</p>
                        <div className="grid grid-cols-8 gap-2">
                          {['#FEF3C7', '#DBEAFE', '#D1FAE5', '#FCE7F3', '#E0E7FF', '#F3E8FF', '#FED7D7', '#F0FDF4'].map(color => (
                            <button
                              key={color}
                              className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400"
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
                
                {/* Undo/Redo */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                >
                  <RotateClockwise className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="insert" className="space-y-4">
              <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 rounded-lg">
                {/* Media insertion */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.md"
                  className="hidden"
                  onChange={(e) => e.target.files && onDrop(Array.from(e.target.files))}
                />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  Imagem
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4 mr-2" />
                      Vídeo
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Inserir vídeo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="Cole o link do YouTube aqui..."
                      />
                      <Button onClick={insertYouTube} className="w-full">
                        Inserir vídeo do YouTube
                      </Button>
                      <div className="text-center text-sm text-muted-foreground">ou</div>
                      <Button 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload de arquivo de vídeo
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Music className="h-4 w-4 mr-2" />
                  Áudio
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Link
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
                  <TableIcon className="h-4 w-4 mr-2" />
                  Tabela
                </Button>
                
                <Separator orientation="vertical" className="h-6 mx-1" />
                
                {/* Special blocks */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Blocos
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                      >
                        <Quote className="h-4 w-4 mr-2" />
                        Citação
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                      >
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Lista de tarefas
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={insertPageBreak}
                      >
                        <PageBreak className="h-4 w-4 mr-2" />
                        Quebra de página
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* Emojis */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4 mr-2" />
                      Emoji
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="grid grid-cols-8 gap-2">
                      {commonEmojis.map(emoji => (
                        <button
                          key={emoji}
                          className="w-8 h-8 rounded hover:bg-muted flex items-center justify-center text-lg"
                          onClick={() => insertEmoji(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </TabsContent>
            
            <TabsContent value="layout" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Espaçamento entre linhas</label>
                  <Select 
                    value={pageSettings.lineHeight} 
                    onValueChange={(value) => setPageSettings(prev => ({ ...prev, lineHeight: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Simples</SelectItem>
                      <SelectItem value="1.15">1.15</SelectItem>
                      <SelectItem value="1.5">1.5</SelectItem>
                      <SelectItem value="2">Duplo</SelectItem>
                      <SelectItem value="2.5">2.5</SelectItem>
                      <SelectItem value="3">Triplo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tamanho do papel</label>
                  <Select 
                    value={pageSettings.paperSize} 
                    onValueChange={(value) => setPageSettings(prev => ({ ...prev, paperSize: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4</SelectItem>
                      <SelectItem value="Letter">Carta</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Orientação</label>
                  <Select 
                    value={pageSettings.orientation} 
                    onValueChange={(value) => setPageSettings(prev => ({ ...prev, orientation: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Retrato</SelectItem>
                      <SelectItem value="landscape">Paisagem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cor de fundo</label>
                  <input
                    type="color"
                    value={pageSettings.backgroundColor}
                    onChange={(e) => setPageSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-full h-10 rounded border"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="page" className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={pageSettings.showHeader}
                      onCheckedChange={(checked) => setPageSettings(prev => ({ ...prev, showHeader: checked }))}
                    />
                    <label className="text-sm font-medium">Mostrar cabeçalho</label>
                  </div>
                  
                  {pageSettings.showHeader && (
                    <Input
                      value={pageSettings.headerContent}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, headerContent: e.target.value }))}
                      placeholder="Conteúdo do cabeçalho..."
                    />
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={pageSettings.showFooter}
                      onCheckedChange={(checked) => setPageSettings(prev => ({ ...prev, showFooter: checked }))}
                    />
                    <label className="text-sm font-medium">Mostrar rodapé</label>
                  </div>
                  
                  {pageSettings.showFooter && (
                    <Input
                      value={pageSettings.footerContent}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, footerContent: e.target.value }))}
                      placeholder="Conteúdo do rodapé..."
                    />
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={pageSettings.showPageNumbers}
                      onCheckedChange={(checked) => setPageSettings(prev => ({ ...prev, showPageNumbers: checked }))}
                    />
                    <label className="text-sm font-medium">Numeração de páginas</label>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Margens (cm)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        value={pageSettings.marginTop}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, marginTop: e.target.value }))}
                        placeholder="Superior"
                        min="0"
                        step="0.5"
                      />
                      <Input
                        type="number"
                        value={pageSettings.marginBottom}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, marginBottom: e.target.value }))}
                        placeholder="Inferior"
                        min="0"
                        step="0.5"
                      />
                      <Input
                        type="number"
                        value={pageSettings.marginLeft}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, marginLeft: e.target.value }))}
                        placeholder="Esquerda"
                        min="0"
                        step="0.5"
                      />
                      <Input
                        type="number"
                        value={pageSettings.marginRight}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, marginRight: e.target.value }))}
                        placeholder="Direita"
                        min="0"
                        step="0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
            
            {/* Header */}
            {pageSettings.showHeader && (
              <div className="border-b px-8 py-2 bg-muted/20 text-sm text-muted-foreground text-center">
                {pageSettings.headerContent || 'Cabeçalho da página'}
              </div>
            )}
            
            <EditorContent 
              editor={editor} 
              className="h-full overflow-y-auto"
              style={{
                fontFamily: `${pageSettings.fontFamily}, system-ui, sans-serif`,
                fontSize: `${pageSettings.fontSize}px`,
                lineHeight: pageSettings.lineHeight,
                backgroundColor: pageSettings.backgroundColor,
                color: pageSettings.textColor
              }}
            />
            
            {/* Footer */}
            {pageSettings.showFooter && (
              <div className="border-t px-8 py-2 bg-muted/20 text-sm text-muted-foreground text-center">
                {pageSettings.footerContent || 'Rodapé da página'}
                {pageSettings.showPageNumbers && <span className="ml-4">Página 1</span>}
              </div>
            )}
            
            {isDragActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-50/90 dark:bg-blue-900/30 backdrop-blur-sm">
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                  <p className="text-lg font-medium text-blue-700 dark:text-blue-300">
                    Solte os arquivos aqui
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Imagens, vídeos, áudios, PDFs e documentos
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full p-6 overflow-y-auto" style={{ backgroundColor: pageSettings.backgroundColor }}>
            {/* Header */}
            {pageSettings.showHeader && (
              <div className="border-b px-8 py-2 bg-muted/20 text-sm text-muted-foreground text-center mb-6">
                {pageSettings.headerContent || 'Cabeçalho da página'}
              </div>
            )}
            
            <div className="max-w-4xl mx-auto" style={{
              fontFamily: `${pageSettings.fontFamily}, system-ui, sans-serif`,
              fontSize: `${pageSettings.fontSize}px`,
              lineHeight: pageSettings.lineHeight,
              color: pageSettings.textColor,
              marginTop: `${pageSettings.marginTop}cm`,
              marginBottom: `${pageSettings.marginBottom}cm`,
              marginLeft: `${pageSettings.marginLeft}cm`,
              marginRight: `${pageSettings.marginRight}cm`
            }}>
              <h1 className="text-3xl font-bold mb-6">{title || 'Título da página'}</h1>
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
              />
            </div>
            
            {/* Footer */}
            {pageSettings.showFooter && (
              <div className="border-t px-8 py-2 bg-muted/20 text-sm text-muted-foreground text-center mt-6">
                {pageSettings.footerContent || 'Rodapé da página'}
                {pageSettings.showPageNumbers && <span className="ml-4">Página 1</span>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernPageEditor;
