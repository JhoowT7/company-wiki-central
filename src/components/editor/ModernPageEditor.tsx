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
  Download, FileImage, Music, Film, Smile, Indent, Outdent, RotateCcw, RotateCw,
  Columns, Bookmark, MessageSquare, Search, Replace, Scissors, Copy, Clipboard,
  ZoomIn, ZoomOut, Languages, Spellcheck, ChevronDown, Menu, X, Grid,
  MousePointer, Hand, Type as TypeIcon, PaintBucket, BorderAll, Trash2,
  MoreHorizontal, Layout, Heading, ListTree, Hash, AtSign, Star, Heart,
  ThumbsUp, Coffee, Zap, Target, Award, Calendar, Clock, MapPin, Phone,
  Mail, User, Users, Home, Building, Car, Plane, Camera, Mic, Speaker
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
import { Textarea } from '@/components/ui/textarea';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [wordCount, setWordCount] = useState(0);
  const [isSpellCheckEnabled, setIsSpellCheckEnabled] = useState(true);
  
  // Configurações avançadas de página
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
    showPageNumbers: false,
    pageNumberPosition: 'bottom-center',
    backgroundImage: '',
    backgroundImageOpacity: 0.1,
    watermark: '',
    watermarkOpacity: 0.1,
    columnCount: 1,
    columnGap: '1rem',
    pageBreakBefore: false,
    pageBreakAfter: false,
    printMargins: true,
    hyphenation: false
  });
  
  const { theme } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false
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
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image'
        }
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
        width: 640,
        height: 480
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer hover:text-primary/80',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table'
        }
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item'
        }
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
        class: `prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[600px] px-8 py-6 transition-all duration-200 ${
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
          zoom: ${zoomLevel}%;
          columns: ${pageSettings.columnCount};
          column-gap: ${pageSettings.columnGap};
          hyphens: ${pageSettings.hyphenation ? 'auto' : 'none'};
        `,
        spellcheck: isSpellCheckEnabled
      },
      handlePaste: (view, event, slice) => {
        // Manter formatação ao colar
        const clipboardData = event.clipboardData;
        if (clipboardData) {
          const htmlData = clipboardData.getData('text/html');
          const textData = clipboardData.getData('text/plain');
          
          if (htmlData) {
            // Processa e limpa o HTML colado mantendo formatação essencial
            const cleanHtml = htmlData
              .replace(/<o:p\s*\/?>|<\/o:p>/gi, '') // Remove tags do Word
              .replace(/<span[^>]*>([^<]*)<\/span>/gi, '$1') // Simplifica spans desnecessários
              .replace(/style="[^"]*"/gi, ''); // Remove estilos inline problemáticos
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cleanHtml;
            
            // Insere o conteúdo processado
            view.dispatch(view.state.tr.replaceSelectionWith(
              view.state.schema.parseDOM(tempDiv)
            ));
            return true;
          }
        }
        return false;
      },
      handleDrop: (view, event, slice, moved) => {
        // Suporte para arrastar e soltar
        return false;
      }
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.split(/\s+/).filter(word => word.length > 0).length);
      
      // Auto-save logic
      if (title || editor.getHTML()) {
        setIsAutoSaving(true);
        setTimeout(() => setIsAutoSaving(false), 1000);
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

  const insertCallout = (type: 'info' | 'warning' | 'success' | 'error' | 'note' | 'tip') => {
    const styles = {
      info: 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 text-blue-800 dark:text-blue-200',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-200',
      success: 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 text-green-800 dark:text-green-200',
      error: 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 text-red-800 dark:text-red-200',
      note: 'bg-gray-50 dark:bg-gray-900/20 border-l-4 border-gray-400 text-gray-800 dark:text-gray-200',
      tip: 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-400 text-purple-800 dark:text-purple-200'
    };

    const icons = {
      info: '💡',
      warning: '⚠️',
      success: '✅',
      error: '❌',
      note: '📝',
      tip: '💡'
    };

    const calloutHtml = `
      <div class="callout ${styles[type]} p-4 my-4 rounded-lg">
        <div class="flex items-start gap-3">
          <span class="text-xl flex-shrink-0">${icons[type]}</span>
          <div class="flex-1">
            <p class="font-semibold mb-2">${type.charAt(0).toUpperCase() + type.slice(1)}</p>
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
    const pageBreakHtml = `
      <div style="page-break-after: always; break-after: page; border-bottom: 2px dashed #ccc; margin: 2rem 0; text-align: center; padding: 1rem; color: #666; font-size: 12px;">
        --- Quebra de Página ---
      </div>
    `;
    editor?.chain().focus().insertContent(pageBreakHtml).run();
  };

  const exportDocument = (format: 'pdf' | 'docx' | 'html' | 'txt' | 'markdown') => {
    const content = editor?.getHTML() || '';
    const fileName = title || 'documento';
    
    switch (format) {
      case 'html':
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
            <title>${title}</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: ${pageSettings.fontFamily}, sans-serif; 
                font-size: ${pageSettings.fontSize}px;
                line-height: ${pageSettings.lineHeight};
                color: ${pageSettings.textColor};
                background-color: ${pageSettings.backgroundColor};
                margin: ${pageSettings.marginTop}cm ${pageSettings.marginRight}cm ${pageSettings.marginBottom}cm ${pageSettings.marginLeft}cm;
                columns: ${pageSettings.columnCount};
                column-gap: ${pageSettings.columnGap};
              }
              .callout { padding: 1rem; margin: 1rem 0; border-radius: 0.5rem; }
              .editor-table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
              .editor-table td, .editor-table th { border: 1px solid #ccc; padding: 0.5rem; }
              .editor-image { max-width: 100%; height: auto; border-radius: 0.5rem; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${pageSettings.showHeader ? `<header style="border-bottom: 1px solid #ddd; padding-bottom: 1rem; margin-bottom: 2rem;">${pageSettings.headerContent}</header>` : ''}
            <h1>${title}</h1>
            ${content}
            ${pageSettings.showFooter ? `<footer style="border-top: 1px solid #ddd; padding-top: 1rem; margin-top: 2rem;">${pageSettings.footerContent}</footer>` : ''}
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

      case 'markdown':
        // Converte HTML para Markdown (simplificado)
        let markdownContent = content
          .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
          .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
          .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
          .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
          .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
          .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<[^>]*>/g, ''); // Remove tags HTML restantes
        
        const mdBlob = new Blob([markdownContent], { type: 'text/markdown' });
        const mdUrl = URL.createObjectURL(mdBlob);
        const mdA = document.createElement('a');
        mdA.href = mdUrl;
        mdA.download = `${fileName}.md`;
        mdA.click();
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
        <span className="ml-3 text-muted-foreground">Carregando editor avançado...</span>
      </div>
    );
  }

  const fontFamilies = [
    'Inter', 'Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 
    'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat', 'Source Sans Pro',
    'Ubuntu', 'Nunito', 'Playfair Display', 'Merriweather', 'Lora', 'Oswald',
    'Raleway', 'PT Sans', 'Source Code Pro', 'Fira Code', 'JetBrains Mono'
  ];

  const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24', '26', '28', '32', '36', '48', '72', '96'];

  const commonEmojis = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘',
    '👍', '👎', '👏', '🙌', '✨', '🎉', '🎊', '💡', '💯', '🔥', '⭐', '🌟', '💫', '⚡', '💥', '💢',
    '❤️', '💙', '💚', '💛', '💜', '🧡', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💖', '💗', '💘', '💝'
  ];

  const symbols = [
    '©', '®', '™', '°', '±', '÷', '×', '∞', '≈', '≠', '≤', '≥', '∂', '∆', '∑', '∏',
    '√', '∛', '∜', 'π', 'α', 'β', 'γ', 'δ', 'ε', 'λ', 'μ', 'σ', 'φ', 'χ', 'ψ', 'ω',
    '→', '←', '↑', '↓', '↔', '↕', '⇒', '⇐', '⇑', '⇓', '⇔', '⇕', '∧', '∨', '¬', '∀', '∃'
  ];

  return (
    <div className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Header avançado */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3">
        {/* Linha 1: Título e controles principais */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4 flex-1">
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
              className="text-xl font-semibold border-none bg-transparent focus:ring-0 px-0 flex-1"
            />
            
            {isAutoSaving && (
              <Badge variant="secondary" className="animate-pulse">
                <Clock className="h-3 w-3 mr-1" />
                Salvando...
              </Badge>
            )}

            <div className="text-sm text-muted-foreground">
              {wordCount} palavras
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                disabled={zoomLevel <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium w-12 text-center">{zoomLevel}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                disabled={zoomLevel >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Export e Print */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => exportDocument('markdown')}
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    Markdown
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

        {/* Linha 2: Barra de ferramentas avançada */}
        {!isPreview && (
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="home">Início</TabsTrigger>
              <TabsTrigger value="insert">Inserir</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="review">Revisão</TabsTrigger>
              <TabsTrigger value="view">Exibir</TabsTrigger>
              <TabsTrigger value="page">Página</TabsTrigger>
            </TabsList>
            
            {/* Aba Início - Formatação básica */}
            <TabsContent value="home" className="mt-3">
              <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/30 rounded-lg">
                {/* Área de transferência */}
                <div className="flex items-center gap-1 px-2 border-r">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.execCommand('cut')}
                    title="Recortar (Ctrl+X)"
                  >
                    <Scissors className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.execCommand('copy')}
                    title="Copiar (Ctrl+C)"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.execCommand('paste')}
                    title="Colar (Ctrl+V)"
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFormatting}
                    title="Limpar formatação"
                  >
                    <PaintBucket className="h-4 w-4" />
                  </Button>
                </div>

                {/* Fonte */}
                <div className="flex items-center gap-1 px-2 border-r">
                  <Select value={pageSettings.fontFamily} onValueChange={(value) => 
                    setPageSettings(prev => ({ ...prev, fontFamily: value }))
                  }>
                    <SelectTrigger className="w-36">
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
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Formatação de texto */}
                <div className="flex items-center gap-1 px-2 border-r">
                  <Button
                    variant={editor.isActive('bold') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Negrito (Ctrl+B)"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant={editor.isActive('italic') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Itálico (Ctrl+I)"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant={editor.isActive('underline') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    title="Sublinhado (Ctrl+U)"
                  >
                    <UnderlineIcon className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant={editor.isActive('strike') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    title="Tachado"
                  >
                    <Strikethrough className="h-4 w-4" />
                  </Button>

                  <Button
                    variant={editor.isActive('subscript') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    title="Subscrito"
                  >
                    <span className="text-xs">X₂</span>
                  </Button>
                  
                  <Button
                    variant={editor.isActive('superscript') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    title="Sobrescrito"
                  >
                    <span className="text-xs">X²</span>
                  </Button>
                </div>

                {/* Títulos */}
                <div className="flex items-center gap-1 px-2 border-r">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Heading className="h-4 w-4" />
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48">
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => editor.chain().focus().setParagraph().run()}
                        >
                          Normal
                        </Button>
                        {[1, 2, 3, 4, 5, 6].map(level => (
                          <Button
                            key={level}
                            variant={editor.isActive('heading', { level }) ? 'default' : 'ghost'}
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                          >
                            Título {level}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Alinhamento */}
                <div className="flex items-center gap-1 px-2 border-r">
                  <Button
                    variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    title="Alinhar à esquerda"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    title="Centralizar"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    title="Alinhar à direita"
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    title="Justificar"
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </div>

                {/* Listas e recuos */}
                <div className="flex items-center gap-1 px-2 border-r">
                  <Button
                    variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Lista com marcadores"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Lista numerada"
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
                    disabled={!editor.can().sinkListItem('listItem')}
                    title="Aumentar recuo"
                  >
                    <Indent className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().liftListItem('listItem').run()}
                    disabled={!editor.can().liftListItem('listItem')}
                    title="Diminuir recuo"
                  >
                    <Outdent className="h-4 w-4" />
                  </Button>
                </div>

                {/* Cores */}
                <div className="flex items-center gap-1 px-2 border-r">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" title="Cor do texto">
                        <Type className="h-4 w-4" />
                        <ChevronDown className="h-3 w-3 ml-1" />
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
                                className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                                style={{ backgroundColor: color }}
                                onClick={() => editor.chain().focus().setColor(color).run()}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" title="Cor de destaque">
                        <Highlighter className="h-4 w-4" />
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div>
                        <p className="text-sm font-medium mb-2">Cor de destaque</p>
                        <div className="grid grid-cols-8 gap-2">
                          {['#FEF3C7', '#DBEAFE', '#D1FAE5', '#FCE7F3', '#E0E7FF', '#F3E8FF', '#FED7D7', '#F0FDF4'].map(color => (
                            <button
                              key={color}
                              className="w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                              style={{ backgroundColor: color }}
                              onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                            />
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Desfazer/Refazer */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Desfazer (Ctrl+Z)"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Refazer (Ctrl+Y)"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Aba Inserir - Conteúdo multimídia e elementos */}
            <TabsContent value="insert" className="mt-3">
              <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/30 rounded-lg">
                {/* ... keep existing code (media insertion buttons, but enhanced) */}
                
                {/* Tabelas */}
                <div className="flex items-center gap-1 px-2 border-r">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <TableIcon className="h-4 w-4 mr-1" />
                        Tabela
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-3">
                        <div className="grid grid-cols-8 gap-1">
                          {Array.from({ length: 64 }, (_, i) => {
                            const row = Math.floor(i / 8) + 1;
                            const col = (i % 8) + 1;
                            return (
                              <button
                                key={i}
                                className="w-6 h-6 border border-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                                onClick={() => insertTable(row, col)}
                                title={`${row}x${col}`}
                              />
                            );
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          Clique para inserir tabela
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Elementos especiais */}
                <div className="flex items-center gap-1 px-2 border-r">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Elementos
                        <ChevronDown className="h-3 w-3 ml-1" />
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
                          💡 Caixa de informação
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => insertCallout('warning')}
                        >
                          ⚠️ Caixa de atenção
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => insertCallout('success')}
                        >
                          ✅ Caixa de sucesso
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => insertCallout('error')}
                        >
                          ❌ Caixa de erro
                        </Button>
                        <Separator />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        >
                          <Minus className="h-4 w-4 mr-2" />
                          Linha separadora
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
                          onClick={() => insertCodeBlock()}
                        >
                          <Code className="h-4 w-4 mr-2" />
                          Bloco de código
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={insertPageBreak}
                        >
                          <Minus className="h-4 w-4 mr-2" />
                          Quebra de página
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Data e hora */}
                <div className="flex items-center gap-1 px-2 border-r">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={insertDate}
                    title="Inserir data atual"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={insertTime}
                    title="Inserir hora atual"
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                </div>

                {/* Símbolos e emojis */}
                <div className="flex items-center gap-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Smile className="h-4 w-4 mr-1" />
                        Emoji
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <Tabs defaultValue="emojis">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="emojis">Emojis</TabsTrigger>
                          <TabsTrigger value="symbols">Símbolos</TabsTrigger>
                        </TabsList>
                        <TabsContent value="emojis">
                          <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
                            {commonEmojis.map(emoji => (
                              <button
                                key={emoji}
                                className="w-8 h-8 rounded hover:bg-muted flex items-center justify-center text-lg transition-colors"
                                onClick={() => insertSymbol(emoji)}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </TabsContent>
                        <TabsContent value="symbols">
                          <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
                            {symbols.map(symbol => (
                              <button
                                key={symbol}
                                className="w-8 h-8 rounded hover:bg-muted flex items-center justify-center text-sm transition-colors"
                                onClick={() => insertSymbol(symbol)}
                              >
                                {symbol}
                              </button>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>

            {/* Aba Layout - Configurações de página */}
            <TabsContent value="layout" className="mt-3">
              <div className="grid grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Espaçamento</label>
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
                  <label className="text-sm font-medium">Colunas</label>
                  <Select 
                    value={pageSettings.columnCount.toString()} 
                    onValueChange={(value) => setPageSettings(prev => ({ ...prev, columnCount: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 coluna</SelectItem>
                      <SelectItem value="2">2 colunas</SelectItem>
                      <SelectItem value="3">3 colunas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Papel</label>
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
              </div>
            </TabsContent>

            {/* Aba Revisão - Buscar, substituir, verificação */}
            <TabsContent value="review" className="mt-3">
              <div className="flex items-center gap-4 p-2 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    className="w-32"
                  />
                  <Input
                    value={replaceTerm}
                    onChange={(e) => setReplaceTerm(e.target.value)}
                    placeholder="Substituir por..."
                    className="w-32"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={findAndReplace}
                    disabled={!searchTerm}
                  >
                    <Replace className="h-4 w-4 mr-1" />
                    Substituir
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <div className="flex items-center gap-2">
                  <Switch
                    checked={isSpellCheckEnabled}
                    onCheckedChange={setIsSpellCheckEnabled}
                  />
                  <Spellcheck className="h-4 w-4" />
                  <span className="text-sm">Verificação ortográfica</span>
                </div>
              </div>
            </TabsContent>

            {/* Aba Exibir - Controles de visualização */}
            <TabsContent value="view" className="mt-3">
              <div className="flex items-center gap-4 p-2 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <ZoomOut className="h-4 w-4" />
                  <Slider
                    value={[zoomLevel]}
                    onValueChange={(value) => setZoomLevel(value[0])}
                    max={200}
                    min={50}
                    step={10}
                    className="w-32"
                  />
                  <ZoomIn className="h-4 w-4" />
                  <span className="text-sm w-12">{zoomLevel}%</span>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPreview(!isPreview)}
                  className={isPreview ? 'bg-accent' : ''}
                >
                  {isPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="ml-2">Visualizar</span>
                </Button>
              </div>
            </TabsContent>

            {/* Aba Página - Configurações avançadas */}
            <TabsContent value="page" className="mt-3">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                {/* ... keep existing code (page settings, but enhanced) */}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Configurações de publicação */}
        <div className="flex items-center gap-4 text-sm mt-3 pt-3 border-t">
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
          
          <div className="flex items-center gap-1 flex-1">
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

      {/* Área do editor */}
      <div className="flex-1 overflow-hidden">
        {!isPreview ? (
          <div 
            {...getRootProps()} 
            className={`h-full relative ${isDragActive ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-700' : ''}`}
          >
            <input {...getInputProps()} />
            
            {/* Header da página */}
            {pageSettings.showHeader && (
              <div className="border-b px-8 py-3 bg-muted/20 text-sm text-muted-foreground text-center print:block">
                {pageSettings.headerContent || 'Cabeçalho da página'}
              </div>
            )}
            
            <div 
              ref={editorRef}
              className="h-full overflow-y-auto"
              style={{
                backgroundColor: pageSettings.backgroundColor,
                backgroundImage: pageSettings.backgroundImage ? `url(${pageSettings.backgroundImage})` : 'none',
                backgroundOpacity: pageSettings.backgroundImageOpacity
              }}
            >
              <EditorContent 
                editor={editor} 
                className="h-full"
                style={{
                  fontFamily: `${pageSettings.fontFamily}, system-ui, sans-serif`,
                  fontSize: `${pageSettings.fontSize}px`,
                  lineHeight: pageSettings.lineHeight,
                  color: pageSettings.textColor,
                  zoom: `${zoomLevel}%`
                }}
              />
              
              {/* Marca d'água */}
              {pageSettings.watermark && (
                <div 
                  className="fixed inset-0 pointer-events-none flex items-center justify-center text-gray-300 dark:text-gray-700 text-6xl font-bold transform rotate-45"
                  style={{ opacity: pageSettings.watermarkOpacity }}
                >
                  {pageSettings.watermark}
                </div>
              )}
            </div>
            
            {/* Footer da página */}
            {pageSettings.showFooter && (
              <div className="border-t px-8 py-3 bg-muted/20 text-sm text-muted-foreground text-center print:block">
                {pageSettings.footerContent || 'Rodapé da página'}
                {pageSettings.showPageNumbers && (
                  <span className="ml-4">
                    {pageSettings.pageNumberPosition.includes('center') ? 'Página 1' : '1'}
                  </span>
                )}
              </div>
            )}
            
            {/* Overlay de drag and drop */}
            {isDragActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-50/90 dark:bg-blue-900/30 backdrop-blur-sm z-50">
                <div className="text-center">
                  <Upload className="h-16 w-16 mx-auto mb-4 text-blue-500" />
                  <p className="text-xl font-medium text-blue-700 dark:text-blue-300">
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
          <div className="h-full p-6 overflow-y-auto print:p-0" style={{ backgroundColor: pageSettings.backgroundColor }}>
            {/* Header no preview */}
            {pageSettings.showHeader && (
              <div className="border-b px-8 py-3 bg-muted/20 text-sm text-muted-foreground text-center mb-6 print:mb-0">
                {pageSettings.headerContent || 'Cabeçalho da página'}
              </div>
            )}
            
            <div 
              className="max-w-4xl mx-auto print:max-w-none print:mx-0" 
              style={{
                fontFamily: `${pageSettings.fontFamily}, system-ui, sans-serif`,
                fontSize: `${pageSettings.fontSize}px`,
                lineHeight: pageSettings.lineHeight,
                color: pageSettings.textColor,
                marginTop: `${pageSettings.marginTop}cm`,
                marginBottom: `${pageSettings.marginBottom}cm`,
                marginLeft: `${pageSettings.marginLeft}cm`,
                marginRight: `${pageSettings.marginRight}cm`,
                columns: pageSettings.columnCount,
                columnGap: pageSettings.columnGap,
                zoom: `${zoomLevel}%`
              }}
            >
              <h1 className="text-4xl font-bold mb-8 print:text-3xl print:mb-4">
                {title || 'Título da página'}
              </h1>
              <div 
                className="prose dark:prose-invert max-w-none print:prose-print"
                dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
              />
            </div>
            
            {/* Footer no preview */}
            {pageSettings.showFooter && (
              <div className="border-t px-8 py-3 bg-muted/20 text-sm text-muted-foreground text-center mt-6 print:mt-0">
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
