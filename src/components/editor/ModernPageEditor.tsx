import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import YouTube from '@tiptap/extension-youtube';

import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Code, Image as ImageIcon, Link as LinkIcon, Table as TableIcon,
  Undo, Redo, Save, Download, Eye, EyeOff, Search, Replace, SpellCheck, Grid3X3,
  Plus, Minus, Type, Palette, Highlighter, Subscript as SubscriptIcon, Superscript as SuperscriptIcon,
  Indent, Outdent, Hash, FileText, Calendar, Clock, Smile, AtSign, Euro, Copyright,
  Settings, Columns, Printer, Moon, Sun, Upload, Film
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/ThemeProvider';

interface ModernPageEditorProps {
  initialContent?: string;
  onSave?: (content: string, title: string) => void;
  title?: string;
}

const ModernPageEditor: React.FC<ModernPageEditorProps> = ({
  initialContent = '',
  onSave,
  title: initialTitle = ''
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editorMode, setEditorMode] = useState<'normal' | 'dark' | 'sepia'>('normal');
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [showInsertDialog, setShowInsertDialog] = useState(false);
  const [showSymbolDialog, setShowSymbolDialog] = useState(false);
  
  const { theme } = useTheme();

  // Definir cores baseadas no modo do editor
  const getEditorStyles = () => {
    switch (editorMode) {
      case 'dark':
        return {
          backgroundColor: '#1a1a1a',
          color: '#e5e5e5',
          borderColor: '#374151'
        };
      case 'sepia':
        return {
          backgroundColor: '#f4f1e8',
          color: '#5c4b37',
          borderColor: '#d4c5a9'
        };
      default: // normal - adapta ao tema do sistema
        return theme === 'dark' ? {
          backgroundColor: '#1a1a1a',
          color: '#e5e5e5',
          borderColor: '#374151'
        } : {
          backgroundColor: '#ffffff',
          color: '#000000',
          borderColor: '#e5e7eb'
        };
    }
  };

  const editorStyles = getEditorStyles();
  
  // Page settings
  const [pageSettings, setPageSettings] = useState({
    marginTop: 2.5,
    marginBottom: 2.5,
    marginLeft: 2.5,
    marginRight: 2.5,
    fontSize: 16,
    fontFamily: 'Inter',
    lineHeight: 1.6,
    columns: 1,
    columnGap: 1,
    headerText: '',
    footerText: '',
    showPageNumbers: true,
    pageOrientation: 'portrait' as 'portrait' | 'landscape',
    paperSize: 'A4' as 'A4' | 'Letter' | 'Legal',
    backgroundColor: editorStyles.backgroundColor,
    textColor: editorStyles.color
  });

  // Atualizar configurações da página quando o modo do editor mudar
  useEffect(() => {
    const styles = getEditorStyles();
    setPageSettings(prev => ({
      ...prev,
      backgroundColor: styles.backgroundColor,
      textColor: styles.color
    }));
  }, [editorMode, theme]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      FontFamily,
      Subscript,
      Superscript,
      Underline,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      YouTube.configure({
        controls: true,
        nocookie: true,
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: `
          min-height: 600px;
          padding: ${pageSettings.marginTop}cm ${pageSettings.marginRight}cm ${pageSettings.marginBottom}cm ${pageSettings.marginLeft}cm;
          font-family: ${pageSettings.fontFamily};
          font-size: ${pageSettings.fontSize}px;
          line-height: ${pageSettings.lineHeight};
          color: ${pageSettings.textColor};
          background-color: ${pageSettings.backgroundColor};
          border: 1px solid ${editorStyles.borderColor};
          ${pageSettings.columns > 1 ? `column-count: ${pageSettings.columns}; column-gap: ${pageSettings.columnGap}cm;` : ''}
        `,
      },
      handlePaste: (view, event) => {
        const html = event.clipboardData?.getData('text/html');
        if (html) {
          return false;
        }
        return false;
      },
    },
  });

  // Helper functions for editor actions
  const clearFormatting = useCallback(() => {
    if (editor) {
      editor.chain().focus().clearNodes().unsetAllMarks().run();
    }
  }, [editor]);

  const insertTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);

  const insertCodeBlock = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleCodeBlock().run();
    }
  }, [editor]);

  const insertDate = useCallback(() => {
    if (editor) {
      const today = new Date().toLocaleDateString();
      editor.chain().focus().insertContent(today).run();
    }
  }, [editor]);

  const insertTime = useCallback(() => {
    if (editor) {
      const now = new Date().toLocaleTimeString();
      editor.chain().focus().insertContent(now).run();
    }
  }, [editor]);

  const insertSymbol = useCallback((symbol: string) => {
    if (editor) {
      editor.chain().focus().insertContent(symbol).run();
    }
  }, [editor]);

  const findAndReplace = useCallback(() => {
    if (editor && searchTerm) {
      const content = editor.getHTML();
      const newContent = content.replace(new RegExp(searchTerm, 'gi'), replaceTerm);
      editor.commands.setContent(newContent);
      toast({
        title: "Find & Replace",
        description: `Replaced "${searchTerm}" with "${replaceTerm}"`,
      });
    }
  }, [editor, searchTerm, replaceTerm, toast]);

  const handleFileUpload = async (files: FileList) => {
    if (!editor) return;
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      
      if (file.type.startsWith('image/')) {
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      } else {
        toast({
          title: "Unsupported File",
          description: "Only images are supported for now.",
          variant: "destructive"
        });
      }
    });

    toast({
      title: "Files inserted!",
      description: "The files were inserted into the page.",
    });
  };

  const handleYouTubeInsert = () => {
    const url = prompt('Cole o link do YouTube:');
    if (url && editor) {
      let videoId = '';
      
      const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
      const match = url.match(regex);
      
      if (match) {
        videoId = match[1];
        editor.commands.setYoutubeVideo({
          src: `https://www.youtube.com/watch?v=${videoId}`,
          width: 640,
          height: 480,
        });
        
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

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        editor.chain().focus().setImage({ src }).run();
      };
      reader.readAsDataURL(file);
    }
  }, [editor]);

  const setHeading = useCallback((level: number) => {
    if (editor) {
      if (level === 0) {
        editor.chain().focus().setParagraph().run();
      } else {
        editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
      }
    }
  }, [editor]);

  const symbols = ['©', '®', '™', '§', '¶', '†', '‡', '•', '…', '–', '—', '‹', '›', '«', '»', '"', '"', "'", "'", '‚', '„', '‰', '€', '£', '¥', '¢', '₹', '₽', '₩', '₪', '₦', '₡', '₨', '₫', '₱', '₡'];

  const handleSave = useCallback(() => {
    if (editor && onSave) {
      const content = editor.getHTML();
      onSave(content, title);
      toast({
        title: "Document Saved",
        description: "Your document has been saved successfully.",
      });
    }
  }, [editor, onSave, title, toast]);

  const handleExport = useCallback((format: 'html' | 'markdown' | 'txt') => {
    if (!editor) return;

    let content = '';
    let filename = `${title || 'document'}.${format}`;

    switch (format) {
      case 'html':
        content = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { font-family: ${pageSettings.fontFamily}; font-size: ${pageSettings.fontSize}px; line-height: ${pageSettings.lineHeight}; color: ${pageSettings.textColor}; background-color: ${pageSettings.backgroundColor}; margin: ${pageSettings.marginTop}cm ${pageSettings.marginRight}cm ${pageSettings.marginBottom}cm ${pageSettings.marginLeft}cm; }
        .editor-table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
        .editor-table td, .editor-table th { border: 1px solid #ccc; padding: 0.5rem; }
        .editor-image { max-width: 100%; height: auto; margin: 1rem 0; }
    </style>
</head>
<body>
    ${pageSettings.headerText ? `<header>${pageSettings.headerText}</header>` : ''}
    ${editor.getHTML()}
    ${pageSettings.footerText ? `<footer>${pageSettings.footerText}</footer>` : ''}
</body>
</html>`;
        break;
      case 'markdown':
        content = editor.getText();
        filename = `${title || 'document'}.md`;
        break;
      case 'txt':
        content = editor.getText();
        filename = `${title || 'document'}.txt`;
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Document exported as ${format.toUpperCase()}`,
    });
  }, [editor, title, pageSettings, toast]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: editorStyles.backgroundColor,
        color: editorStyles.color 
      }}
    >
      {/* Header */}
      <div className="border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50" style={{ borderColor: editorStyles.borderColor }}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do Documento"
              className="text-lg font-semibold border-none bg-transparent focus:ring-0 max-w-md"
              style={{ color: editorStyles.color }}
            />
            <div className="flex items-center gap-2">
              {/* Seletor de modo do editor */}
              <Select value={editorMode} onValueChange={(value: 'normal' | 'dark' | 'sepia') => setEditorMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="sepia">Sépia</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Salvar
              </Button>
            </div>
          </div>

          {/* Toolbar */}
          {!isPreviewMode && (
            <div className="space-y-2">
              {/* Main formatting toolbar */}
              <div className="flex items-center gap-1 flex-wrap">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                >
                  <Redo className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Select value="0" onValueChange={(value) => setHeading(parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Paragraph</SelectItem>
                    <SelectItem value="1">Heading 1</SelectItem>
                    <SelectItem value="2">Heading 2</SelectItem>
                    <SelectItem value="3">Heading 3</SelectItem>
                    <SelectItem value="4">Heading 4</SelectItem>
                    <SelectItem value="5">Heading 5</SelectItem>
                    <SelectItem value="6">Heading 6</SelectItem>
                  </SelectContent>
                </Select>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive('bold') ? 'bg-accent' : ''}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive('italic') ? 'bg-accent' : ''}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={editor.isActive('underline') ? 'bg-accent' : ''}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={editor.isActive('strike') ? 'bg-accent' : ''}
                >
                  <Strikethrough className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                  className={editor.isActive({ textAlign: 'justify' }) ? 'bg-accent' : ''}
                >
                  <AlignJustify className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={editor.isActive('bulletList') ? 'bg-accent' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={editor.isActive('orderedList') ? 'bg-accent' : ''}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleYouTubeInsert}
                >
                  <Film className="h-4 w-4" />
                </Button>

                <Dialog open={showInsertDialog} onOpenChange={setShowInsertDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <TableIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Insert Table</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Button onClick={insertTable} className="w-full">
                        Insert 3x3 Table
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Separator orientation="vertical" className="h-6" />

                <Button variant="ghost" size="sm" onClick={clearFormatting}>
                  Clear Format
                </Button>

                <Dialog open={showPageSettings} onOpenChange={setShowPageSettings}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Personalização
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Configurações da Página</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="layout" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="layout">Layout</TabsTrigger>
                        <TabsTrigger value="typography">Tipografia</TabsTrigger>
                        <TabsTrigger value="colors">Cores</TabsTrigger>
                        <TabsTrigger value="advanced">Avançado</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="layout" className="space-y-4">
                        <div>
                          <Label>Margens (cm)</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <Input
                              type="number"
                              placeholder="Superior"
                              value={pageSettings.marginTop}
                              onChange={(e) => setPageSettings(prev => ({ ...prev, marginTop: parseFloat(e.target.value) || 0 }))}
                            />
                            <Input
                              type="number"
                              placeholder="Inferior"
                              value={pageSettings.marginBottom}
                              onChange={(e) => setPageSettings(prev => ({ ...prev, marginBottom: parseFloat(e.target.value) || 0 }))}
                            />
                            <Input
                              type="number"
                              placeholder="Esquerda"
                              value={pageSettings.marginLeft}
                              onChange={(e) => setPageSettings(prev => ({ ...prev, marginLeft: parseFloat(e.target.value) || 0 }))}
                            />
                            <Input
                              type="number"
                              placeholder="Direita"
                              value={pageSettings.marginRight}
                              onChange={(e) => setPageSettings(prev => ({ ...prev, marginRight: parseFloat(e.target.value) || 0 }))}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Tamanho do Papel</Label>
                          <Select
                            value={pageSettings.paperSize}
                            onValueChange={(value: 'A4' | 'Letter' | 'Legal') => setPageSettings(prev => ({ ...prev, paperSize: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A4">A4</SelectItem>
                              <SelectItem value="Letter">Carta</SelectItem>
                              <SelectItem value="Legal">Ofício</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Orientação</Label>
                          <Select
                            value={pageSettings.pageOrientation}
                            onValueChange={(value: 'portrait' | 'landscape') => setPageSettings(prev => ({ ...prev, pageOrientation: value }))}
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

                        <div>
                          <Label>Colunas</Label>
                          <Select
                            value={pageSettings.columns.toString()}
                            onValueChange={(value) => setPageSettings(prev => ({ ...prev, columns: parseInt(value) }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Coluna</SelectItem>
                              <SelectItem value="2">2 Colunas</SelectItem>
                              <SelectItem value="3">3 Colunas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TabsContent>

                      <TabsContent value="typography" className="space-y-4">
                        <div>
                          <Label>Família da Fonte</Label>
                          <Select
                            value={pageSettings.fontFamily}
                            onValueChange={(value) => setPageSettings(prev => ({ ...prev, fontFamily: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Inter">Inter</SelectItem>
                              <SelectItem value="Arial">Arial</SelectItem>
                              <SelectItem value="Georgia">Georgia</SelectItem>
                              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                              <SelectItem value="Helvetica">Helvetica</SelectItem>
                              <SelectItem value="Roboto">Roboto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Tamanho da Fonte</Label>
                          <Slider
                            value={[pageSettings.fontSize]}
                            onValueChange={(value) => setPageSettings(prev => ({ ...prev, fontSize: value[0] }))}
                            max={32}
                            min={8}
                            step={1}
                            className="mt-2"
                          />
                          <span className="text-sm text-muted-foreground">{pageSettings.fontSize}px</span>
                        </div>

                        <div>
                          <Label>Altura da Linha</Label>
                          <Slider
                            value={[pageSettings.lineHeight]}
                            onValueChange={(value) => setPageSettings(prev => ({ ...prev, lineHeight: value[0] }))}
                            max={3}
                            min={1}
                            step={0.1}
                            className="mt-2"
                          />
                          <span className="text-sm text-muted-foreground">{pageSettings.lineHeight}</span>
                        </div>
                      </TabsContent>

                      <TabsContent value="colors" className="space-y-4">
                        <div>
                          <Label>Cor de Fundo</Label>
                          <Input
                            type="color"
                            value={pageSettings.backgroundColor}
                            onChange={(e) => setPageSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
                            className="w-full h-10 mt-2"
                          />
                        </div>

                        <div>
                          <Label>Cor do Texto</Label>
                          <Input
                            type="color"
                            value={pageSettings.textColor}
                            onChange={(e) => setPageSettings(prev => ({ ...prev, textColor: e.target.value }))}
                            className="w-full h-10 mt-2"
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="advanced" className="space-y-4">
                        <div>
                          <Label>Texto do Cabeçalho</Label>
                          <Input
                            value={pageSettings.headerText}
                            onChange={(e) => setPageSettings(prev => ({ ...prev, headerText: e.target.value }))}
                            placeholder="Texto para aparecer no topo de cada página"
                          />
                        </div>

                        <div>
                          <Label>Texto do Rodapé</Label>
                          <Input
                            value={pageSettings.footerText}
                            onChange={(e) => setPageSettings(prev => ({ ...prev, footerText: e.target.value }))}
                            placeholder="Texto para aparecer no rodapé de cada página"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="page-numbers"
                            checked={pageSettings.showPageNumbers}
                            onCheckedChange={(checked) => setPageSettings(prev => ({ ...prev, showPageNumbers: checked }))}
                          />
                          <Label htmlFor="page-numbers">Mostrar números de página</Label>
                        </div>

                        {pageSettings.columns > 1 && (
                          <div>
                            <Label>Espaçamento entre Colunas (cm)</Label>
                            <Slider
                              value={[pageSettings.columnGap]}
                              onValueChange={(value) => setPageSettings(prev => ({ ...prev, columnGap: value[0] }))}
                              max={5}
                              min={0.5}
                              step={0.1}
                              className="mt-2"
                            />
                            <span className="text-sm text-muted-foreground">{pageSettings.columnGap}cm</span>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>

                <Dialog open={showSymbolDialog} onOpenChange={setShowSymbolDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <AtSign className="h-4 w-4 mr-1" />
                      Symbols
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Insert Symbol</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-8 gap-2 p-4">
                      {symbols.map((symbol) => (
                        <Button
                          key={symbol}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            insertSymbol(symbol);
                            setShowSymbolDialog(false);
                          }}
                          className="h-10 w-10"
                        >
                          {symbol}
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFindReplace(!showFindReplace)}
                >
                  <Search className="h-4 w-4 mr-1" />
                  Find & Replace
                </Button>

                <Button variant="ghost" size="sm" onClick={insertDate}>
                  <Calendar className="h-4 w-4 mr-1" />
                  Date
                </Button>

                <Button variant="ghost" size="sm" onClick={insertTime}>
                  <Clock className="h-4 w-4 mr-1" />
                  Time
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExport('html')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    HTML
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExport('markdown')}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Markdown
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExport('txt')}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Text
                  </Button>
                </div>
              </div>

              {/* Find & Replace */}
              {showFindReplace && (
                <Card className="p-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Find..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Replace..."
                      value={replaceTerm}
                      onChange={(e) => setReplaceTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={findAndReplace} disabled={!searchTerm}>
                      <Replace className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="container mx-auto px-4 py-8">
        <div 
          className="shadow-lg rounded-lg overflow-hidden"
          style={{
            backgroundColor: pageSettings.backgroundColor,
            border: `1px solid ${editorStyles.borderColor}`
          }}
        >
          {pageSettings.headerText && (
            <div className="border-b p-4 text-center text-sm text-muted-foreground">
              {pageSettings.headerText}
            </div>
          )}
          
          <div className="relative">
            <EditorContent 
              editor={editor} 
              className="min-h-[600px] focus:outline-none"
            />
          </div>

          {pageSettings.footerText && (
            <div className="border-t p-4 text-center text-sm text-muted-foreground">
              {pageSettings.footerText}
              {pageSettings.showPageNumbers && (
                <span className="ml-4">Página 1</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernPageEditor;
