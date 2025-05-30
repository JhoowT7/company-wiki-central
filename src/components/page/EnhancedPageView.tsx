
import React, { useState } from 'react';
import { ArrowLeft, Edit, Heart, Share, Clock, User, Calendar, Tag, ExternalLink, Globe, Play, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PageMetadata {
  responsible: string;
  lastUpdate: string;
  status: 'published' | 'draft' | 'archived' | 'review';
  internalLink?: string;
  tags: string[];
  category: string;
}

interface EnhancedPageViewProps {
  pageId: string;
  onBack: () => void;
  onEdit: () => void;
}

const EnhancedPageView: React.FC<EnhancedPageViewProps> = ({ pageId, onBack, onEdit }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data with enhanced structure
  const mockPage = {
    id: pageId,
    title: "Políticas de Segurança da Informação",
    content: `
      <h2>🔒 Introdução à Segurança da Informação</h2>
      <p>Este documento estabelece as diretrizes fundamentais para a proteção da informação na empresa, garantindo a confidencialidade, integridade e disponibilidade dos dados organizacionais.</p>
      
      <div class="info-box bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <h3>📋 Informações Importantes</h3>
        <ul>
          <li><strong>Documento obrigatório</strong> para todos os colaboradores</li>
          <li><strong>Revisão anual</strong> ou quando necessário</li>
          <li><strong>Treinamento</strong> disponível no portal de RH</li>
        </ul>
      </div>
      
      <h3>🔑 Políticas de Senhas</h3>
      <ul>
        <li>Mínimo de 12 caracteres</li>
        <li>Incluir maiúsculas, minúsculas, números e símbolos especiais</li>
        <li>Não reutilizar as últimas 5 senhas</li>
        <li>Renovação obrigatória a cada 90 dias</li>
      </ul>
      
      <h3>🌐 Acesso a Sistemas</h3>
      <ul>
        <li>Autenticação em dois fatores (2FA) obrigatória</li>
        <li>Logout automático após 30 minutos de inatividade</li>
        <li>VPN obrigatória para acesso remoto</li>
      </ul>
      
      <h3>💾 Backup e Recuperação</h3>
      <p>Todos os dados críticos devem seguir nossa política de backup:</p>
      <ul>
        <li>Backup diário automatizado às 22:00</li>
        <li>Testes de restauração mensais</li>
        <li>Retenção de 30 dias para backups incrementais</li>
        <li>Backup anual arquivado por 7 anos</li>
      </ul>
      
      <div class="video-container my-6">
        <h4>📹 Vídeo Tutorial: Configuração do 2FA</h4>
        <div class="bg-gray-100 border rounded-lg p-6 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
            </svg>
          </div>
          <p class="text-gray-600 mb-4">Tutorial de configuração do Two-Factor Authentication</p>
          <a href="https://youtube.com/watch?v=exemplo" target="_blank" class="inline-block">
            <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
              </svg>
              Assistir Tutorial
            </button>
          </a>
        </div>
      </div>
      
      <div class="image-gallery my-6">
        <h4>🖼️ Galeria: Exemplos de Configuração</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="bg-gray-100 border rounded-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400" alt="Exemplo de configuração 1" class="w-full h-40 object-cover" />
            <div class="p-3">
              <p class="text-sm text-gray-600">Tela de configuração do 2FA</p>
            </div>
          </div>
          <div class="bg-gray-100 border rounded-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400" alt="Exemplo de configuração 2" class="w-full h-40 object-cover" />
            <div class="p-3">
              <p class="text-sm text-gray-600">Interface do aplicativo autenticador</p>
            </div>
          </div>
        </div>
      </div>
      
      <h3>🚨 Incidentes de Segurança</h3>
      <p>Em caso de suspeita de violação de segurança:</p>
      <ol>
        <li>Relate imediatamente ao TI através do email: <strong>security@empresa.com</strong></li>
        <li>Não tente resolver sozinho</li>
        <li>Preserve evidências (não apague logs ou arquivos)</li>
        <li>Documente o ocorrido em detalhes</li>
      </ol>
      
      <div class="button-container my-6 space-y-3">
        <a href="https://portal.empresa.com/treinamentos" target="_blank">
          <button class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 w-full justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            Acessar Treinamentos
          </button>
        </a>
        
        <a href="/formularios/incidente-seguranca">
          <button class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 w-full justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            Reportar Incidente
          </button>
        </a>
      </div>
      
      <div class="note-box bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
        <h4>💡 Dica Importante</h4>
        <p>Mantenha sempre seus dispositivos atualizados e use apenas software licenciado. A segurança é responsabilidade de todos!</p>
      </div>
    `,
    metadata: {
      responsible: "João Silva (TI)",
      lastUpdate: "2024-01-22",
      status: 'published' as const,
      internalLink: "/politicas/ti/seguranca-avancada",
      tags: ["segurança", "política", "obrigatório", "TI"],
      category: "Tecnologia da Informação"
    },
    author: "João Silva",
    views: 247,
    createdAt: "2024-01-15"
  };

  const statusColors = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800',
    review: 'bg-blue-100 text-blue-800'
  };

  const statusLabels = {
    published: 'Publicado',
    draft: 'Rascunho',
    archived: 'Arquivado',
    review: 'Em Revisão'
  };

  return (
    <div className="h-full flex flex-col">
      {/* Enhanced Header with Metadata */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              
              <Badge className={statusColors[mockPage.metadata.status]}>
                {statusLabels[mockPage.metadata.status]}
              </Badge>
            </div>
            
            <h1 className="text-2xl font-bold mb-4">{mockPage.title}</h1>
            
            {/* Metadata Card */}
            <Card className="mb-4 bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  📋 Informações da Página
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Responsável</p>
                    <p className="text-muted-foreground">{mockPage.metadata.responsible}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Última Atualização</p>
                    <p className="text-muted-foreground">{mockPage.metadata.lastUpdate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Categoria</p>
                    <p className="text-muted-foreground">{mockPage.metadata.category}</p>
                  </div>
                </div>
                
                {mockPage.metadata.internalLink && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Link Relacionado</p>
                      <a 
                        href={mockPage.metadata.internalLink} 
                        className="text-primary hover:underline text-muted-foreground"
                      >
                        Ver página avançada
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {mockPage.metadata.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Criado em {mockPage.createdAt}
              </span>
              <span>{mockPage.views} visualizações</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-red-500" : ""}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
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

      {/* Enhanced Content */}
      <div className="flex-1 p-6">
        <Card className="max-w-5xl mx-auto">
          <CardContent className="p-8">
            <div 
              className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-img:rounded-lg prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: mockPage.content }}
              style={{
                // Enhanced styles for embedded content
                '--tw-prose-body': 'rgb(55 65 81)',
                '--tw-prose-headings': 'rgb(17 24 39)',
                '--tw-prose-links': 'rgb(59 130 246)',
                '--tw-prose-bold': 'rgb(17 24 39)',
                '--tw-prose-counters': 'rgb(107 114 128)',
                '--tw-prose-bullets': 'rgb(107 114 128)',
                '--tw-prose-hr': 'rgb(229 231 235)',
                '--tw-prose-quotes': 'rgb(107 114 128)',
                '--tw-prose-quote-borders': 'rgb(229 231 235)',
                '--tw-prose-captions': 'rgb(107 114 128)',
                '--tw-prose-code': 'rgb(17 24 39)',
                '--tw-prose-pre-code': 'rgb(229 231 235)',
                '--tw-prose-pre-bg': 'rgb(17 24 39)',
                '--tw-prose-th-borders': 'rgb(209 213 219)',
                '--tw-prose-td-borders': 'rgb(229 231 235)'
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedPageView;
