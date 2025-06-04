
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Calendar, User, Tag, Share, Heart, Bookmark, Eye, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { database } from '@/stores/database';
import { Page } from '@/types';

interface EnhancedPageViewProps {
  pageId: string;
  onBack: () => void;
  onEdit: () => void;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  replies: Comment[];
}

const EnhancedPageView: React.FC<EnhancedPageViewProps> = ({ pageId, onBack, onEdit }) => {
  const [pageData, setPageData] = useState<Page | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [readingMode, setReadingMode] = useState<'normal' | 'dark' | 'sepia'>('normal');
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const pages = database.getPages();
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setPageData(page);
    }
  }, [pageId]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
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
              <span className="text-sm text-muted-foreground">0 visualizações</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
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
              className={isLiked ? 'text-red-500' : ''}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likes}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={isBookmarked ? 'text-blue-500' : ''}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
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
                    {pageData.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Atualizado em {new Date(pageData.updatedAt).toLocaleDateString('pt-BR')}
                  </div>
                  <Badge variant={pageData.status === 'published' ? 'default' : 'secondary'}>
                    {pageData.status === 'published' ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="h-3 w-3" />
              <span className="font-medium">Categoria:</span>
              <span>{pageData.category}</span>
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
