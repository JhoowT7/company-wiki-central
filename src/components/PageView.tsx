
import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Heart, Share, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PageViewProps {
  pageId: string;
  onBack: () => void;
  onEdit: () => void;
}

interface PageData {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  lastModified: string;
  views: number;
  isFavorite: boolean;
}

export function PageView({ pageId, onBack, onEdit }: PageViewProps) {
  const [page, setPage] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPage(pageId);
  }, [pageId]);

  const loadPage = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulação de carregamento da página
      const mockPage: PageData = {
        id,
        title: "Boas Práticas de Segurança",
        content: `
          <h2>Introdução</h2>
          <p>Este documento apresenta as principais boas práticas de segurança que devem ser seguidas por todos os colaboradores da empresa.</p>
          
          <h3>Senhas Seguras</h3>
          <ul>
            <li>Use senhas com pelo menos 12 caracteres</li>
            <li>Inclua letras maiúsculas, minúsculas, números e símbolos</li>
            <li>Não reutilize senhas em diferentes sistemas</li>
            <li>Use um gerenciador de senhas</li>
          </ul>
          
          <h3>Phishing e E-mails Suspeitos</h3>
          <p>Sempre verifique o remetente antes de clicar em links ou baixar anexos. Em caso de dúvida, entre em contato com o TI.</p>
          
          <h3>Atualizações de Software</h3>
          <p>Mantenha sempre seus sistemas e aplicativos atualizados com as últimas versões de segurança.</p>
        `,
        category: "TI",
        author: "João Silva",
        lastModified: "2024-01-20",
        views: 189,
        isFavorite: false
      };
      
      setPage(mockPage);
    } catch (error) {
      console.error("Erro ao carregar página:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (page) {
      setPage({ ...page, isFavorite: !page.isFavorite });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-6">
        <p>Página não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            
            <div>
              <h1 className="text-xl font-semibold">{page.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {page.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {page.lastModified}
                </span>
                <Badge variant="secondary">{page.category}</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleFavorite}
              className={page.isFavorite ? "text-red-500" : ""}
            >
              <Heart className={`h-4 w-4 ${page.isFavorite ? "fill-current" : ""}`} />
            </Button>
            
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
            
            <Button size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{page.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {page.views} visualizações
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
