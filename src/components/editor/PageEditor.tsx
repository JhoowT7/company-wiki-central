
import { useState, useEffect } from "react";
import { Save, Eye, X, Upload, Bold, Italic, List, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PageEditorProps {
  pageId?: string;
  onSave: (content: any) => void;
  onCancel: () => void;
}

const PageEditor = ({ pageId, onSave, onCancel }: PageEditorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Recursos Humanos",
    "TI",
    "Comercial",
    "Templates e Documentos",
    "Procedimentos",
    "Políticas"
  ];

  useEffect(() => {
    if (pageId) {
      loadPage(pageId);
    }
  }, [pageId]);

  const loadPage = async (id: string) => {
    // Simulação de carregamento da página
    setIsLoading(true);
    try {
      // Aqui você integrará com Supabase
      const mockPage = {
        title: "Página Exemplo",
        content: "Conteúdo da página exemplo...",
        category: "TI"
      };
      setTitle(mockPage.title);
      setContent(mockPage.content);
      setCategory(mockPage.category);
    } catch (error) {
      console.error("Erro ao carregar página:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const pageData = {
        title,
        content,
        category,
        updatedAt: new Date().toISOString(),
      };
      
      // Aqui você integrará com Supabase
      console.log("Salvando página:", pageData);
      onSave(pageData);
    } catch (error) {
      console.error("Erro ao salvar página:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    // Implementar upload de mídia
    console.log("Upload de arquivo:", file.name);
  };

  const insertText = (prefix: string, suffix: string = "") => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
      setContent(newText);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            {pageId ? "Editar Página" : "Nova Página"}
          </h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreview ? "Editar" : "Pré-visualizar"}
            </Button>
            
            <Button 
              size="sm"
              onClick={handleSave}
              disabled={isLoading || !title.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 p-6">
          {!isPreview ? (
            <div className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Página</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Digite o título da página..."
                    className="text-lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Conteúdo</Label>
                
                {/* Toolbar simples */}
                <div className="flex items-center gap-1 p-2 border rounded-md bg-muted/50">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText("**", "**")}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText("*", "*")}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText("- ")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText("[", "](url)")}
                  >
                    <Link2 className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Digite o conteúdo da página usando Markdown..."
                  className="min-h-[400px] font-mono"
                />
              </div>
            </div>
          ) : (
            <Card className="max-w-4xl">
              <CardHeader>
                <CardTitle>{title || "Título da Página"}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Categoria: {category || "Não definida"}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  {content ? (
                    <div dangerouslySetInnerHTML={{ 
                      __html: content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/^- (.*)$/gm, '<li>$1</li>')
                        .replace(/\n/g, '<br>')
                    }} />
                  ) : (
                    <p className="text-muted-foreground">
                      Pré-visualização do conteúdo aparecerá aqui...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
