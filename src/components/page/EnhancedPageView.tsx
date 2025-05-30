
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Calendar, User, Tag, Share, Heart, Bookmark, MoreVertical, Eye, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface EnhancedPageViewProps {
  pageId: string;
  onBack: () => void;
  onEdit: () => void;
}

interface PageData {
  id: string;
  title: string;
  content: string;
  author: string;
  lastModified: string;
  status: 'published' | 'draft' | 'archived';
  tags: string[];
  category: string;
  views: number;
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  responsible: string;
  createdDate: string;
  version: string;
  metadata: {
    responsible: string;
    updatedAt: string;
    status: string;
    version: string;
    category: string;
  };
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  replies: Comment[];
}

const EnhancedPageView: React.FC<EnhancedPageViewProps> = ({ pageId, onBack, onEdit }) => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [readingMode, setReadingMode] = useState<'normal' | 'dark' | 'sepia'>('normal');

  // Mock data
  useEffect(() => {
    const mockData: PageData = {
      id: pageId,
      title: "Políticas de Segurança da Informação",
      content: `
        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Introdução</h2>
          <p class="text-gray-700 dark:text-gray-300">Este documento estabelece as diretrizes fundamentais para a proteção da informação na empresa, garantindo a confidencialidade, integridade e disponibilidade dos dados.</p>
          
          <figure class="my-6">
            <img src="https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800" alt="Segurança Digital" class="rounded-xl shadow-lg w-full" />
            <figcaption class="text-center text-sm text-gray-500 mt-2">Representação visual da segurança digital empresarial</figcaption>
          </figure>
          
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Políticas de Senhas</h2>
          <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 class="font-semibold text-blue-900 dark:text-blue-200">Requisitos Obrigatórios</h3>
            <ul class="mt-2 space-y-1 text-blue-800 dark:text-blue-300">
              <li>• Mínimo de 12 caracteres</li>
              <li>• Incluir maiúsculas, minúsculas, números e símbolos</li>
              <li>• Não reutilizar senhas anteriores</li>
              <li>• Alteração obrigatória a cada 90 dias</li>
            </ul>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Acesso a Sistemas</h2>
          <p class="text-gray-700 dark:text-gray-300">Todos os colaboradores devem seguir as seguintes diretrizes:</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Autenticação em dois fatores obrigatória</li>
            <li>Logout automático após 30 minutos de inatividade</li>
            <li>Acesso via VPN para sistemas críticos</li>
          </ul>
          
          <div class="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Portal de Acesso Rápido</h3>
            <p class="text-gray-700 dark:text-gray-300 mb-4">Acesse o portal interno da empresa para mais informações sobre segurança.</p>
            <a href="https://exemplo.com/portal" target="_blank" rel="noopener noreferrer">
              <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                Acessar Portal Interno
              </button>
            </a>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Vídeo Explicativo</h2>
          <div class="rounded-xl overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="400"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              frameborder="0"
              allowfullscreen
              class="w-full"
            ></iframe>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Backup e Recuperação</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
              <h4 class="font-semibold text-gray-900 dark:text-white">Backup Diário</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Automatizado às 02:00</p>
            </div>
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border">
              <h4 class="font-semibold text-gray-900 dark:text-white">Testes de Restauração</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Mensais - primeira segunda-feira</p>
            </div>
          </div>
        </div>
      `,
      author: "João Silva",
      lastModified: "2024-01-22T10:30:00Z",
      status: 'published',
      tags: ["Segurança", "TI", "Políticas", "Compliance"],
      category: "Tecnologia da Informação > Segurança",
      views: 245,
      likes: 12,
      isLiked: false,
      isBookmarked: false,
      responsible: "João Silva - TI",
      createdDate: "2024-01-15",
      version: "v2.1",
      metadata: {
        responsible: "João Silva - TI",
        updatedAt: "22/01/2024",
        status: "Publicado",
        version: "v2.1",
        category: "TI > Segurança"
      }
    };

    setPageData(mockData);
    
    const mockComments: Comment[] = [
      {
        id: '1',
        author: 'Maria Santos',
        content: 'Excelente documentação! Muito clara e objetiva.',
        timestamp: '2024-01-20T14:30:00Z',
        replies: [
          {
            id: '1-1',
            author: 'João Silva',
            content: 'Obrigado pelo feedback, Maria!',
            timestamp: '2024-01-20T15:00:00Z',
            replies: []
          }
        ]
      },
      {
        id: '2',
        author: 'Pedro Costa',
        content: 'Seria possível adicionar exemplos práticos de senhas seguras?',
        timestamp: '2024-01-21T09:15:00Z',
        replies: []
      }
    ];
    
    setComments(mockComments);
  }, [pageId]);

  const handleLike = () => {
    if (pageData) {
      setPageData({
        ...pageData,
        isLiked: !pageData.isLiked,
        likes: pageData.isLiked ? pageData.likes - 1 : pageData.likes + 1
      });
    }
  };

  const handleBookmark = () => {
    if (pageData) {
      setPageData({
        ...pageData,
        isBookmarked: !pageData.isBookmarked
      });
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Usuário Atual',
        content: newComment,
        timestamp: new Date().toISOString(),
        replies: []
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const getReadingModeStyles = () => {
    switch (readingMode) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'sepia':
        return 'bg-amber-50 text-amber-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  const getReadingModeContentStyles = () => {
    const baseStyles = {
      fontSize: '16px',
      lineHeight: '1.7',
      maxWidth: 'none'
    };

    switch (readingMode) {
      case 'dark':
        return {
          ...baseStyles,
          color: '#f3f4f6',
        };
      case 'sepia':
        return {
          ...baseStyles,
          color: '#92400e',
        };
      default:
        return {
          ...baseStyles,
          color: '#374151',
        };
    }
  };

  if (!pageData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getReadingModeStyles()}`}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="hover:bg-accent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{pageData.views} visualizações</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Reading Mode Toggle */}
            <select
              value={readingMode}
              onChange={(e) => setReadingMode(e.target.value as any)}
              className="text-sm border rounded px-3 py-1 bg-background"
            >
              <option value="normal">Normal</option>
              <option value="dark">Escuro</option>
              <option value="sepia">Sépia</option>
            </select>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={pageData.isLiked ? 'text-red-500' : ''}
            >
              <Heart className={`h-4 w-4 mr-1 ${pageData.isLiked ? 'fill-current' : ''}`} />
              {pageData.likes}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={pageData.isBookmarked ? 'text-blue-500' : ''}
            >
              <Bookmark className={`h-4 w-4 ${pageData.isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            
            <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Share className="h-4 w-4 mr-1" />
                  Compartilhar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Compartilhar Página</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input 
                    value={`${window.location.origin}/page/${pageData.id}`}
                    readOnly
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <Button className="w-full">Copiar Link</Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Metadata Card */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">{pageData.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {pageData.metadata.responsible}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Atualizado em {pageData.metadata.updatedAt}
                  </div>
                  <Badge variant={pageData.status === 'published' ? 'default' : 'secondary'}>
                    {pageData.metadata.status}
                  </Badge>
                  <Badge variant="outline">
                    {pageData.metadata.version}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-3 w-3" />
              <span className="font-medium">Categoria:</span>
              <span>{pageData.metadata.category}</span>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {pageData.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-6">
            <div 
              className="prose max-w-none"
              style={getReadingModeContentStyles()}
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Comentários ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Comment */}
            <div className="space-y-2">
              <Textarea
                placeholder="Adicione um comentário..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                Comentar
              </Button>
            </div>
            
            <Separator />
            
            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      
                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="ml-6 mt-3 space-y-2 border-l-2 border-muted pl-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs font-medium">
                                {reply.author.charAt(0)}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="font-medium">{reply.author}</span>
                                  <span className="text-muted-foreground">
                                    {new Date(reply.timestamp).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                                <p className="text-xs">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedPageView;
