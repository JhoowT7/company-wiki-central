
import React, { useState } from 'react';
import { MessageCircle, Send, Reply, Heart, MoreHorizontal, AtSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
  isResolved?: boolean;
  mentions: string[];
}

interface CommentsPanelProps {
  pageId: string;
}

const CommentsPanel: React.FC<CommentsPanelProps> = ({ pageId }) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: {
        name: 'João Silva',
        avatar: '/placeholder.svg',
        initials: 'JS'
      },
      content: 'Excelente conteúdo! Sugiro adicionar mais exemplos práticos na seção de senhas.',
      timestamp: '2024-01-20 14:30',
      likes: 3,
      replies: [
        {
          id: '1-1',
          author: {
            name: 'Maria Santos',
            avatar: '/placeholder.svg',
            initials: 'MS'
          },
          content: 'Concordo! @João Silva, você poderia elaborar mais sobre políticas de senhas corporativas?',
          timestamp: '2024-01-20 15:15',
          likes: 1,
          replies: [],
          mentions: ['João Silva']
        }
      ],
      mentions: []
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showMentions, setShowMentions] = useState(false);

  const users = [
    { name: 'João Silva', initials: 'JS' },
    { name: 'Maria Santos', initials: 'MS' },
    { name: 'Pedro Costa', initials: 'PC' },
    { name: 'Ana Lima', initials: 'AL' }
  ];

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: 'Usuário Atual',
        avatar: '/placeholder.svg',
        initials: 'UC'
      },
      content: newComment,
      timestamp: new Date().toLocaleString('pt-BR'),
      likes: 0,
      replies: [],
      mentions: extractMentions(newComment)
    };

    if (replyingTo) {
      setComments(prev => prev.map(c => 
        c.id === replyingTo 
          ? { ...c, replies: [...c.replies, comment] }
          : c
      ));
    } else {
      setComments(prev => [comment, ...prev]);
    }

    setNewComment('');
    setReplyingTo(null);
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+\s\w+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(m => m.substring(1)) : [];
  };

  const insertMention = (userName: string) => {
    setNewComment(prev => prev + `@${userName} `);
    setShowMentions(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const CommentItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({ comment, isReply = false }) => (
    <div className={`space-y-3 ${isReply ? 'ml-6 pl-4 border-l-2 border-muted' : ''}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
          <AvatarFallback>{comment.author.initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">{formatTimestamp(comment.timestamp)}</span>
            {comment.isResolved && (
              <Badge variant="secondary" className="text-xs">Resolvido</Badge>
            )}
          </div>
          
          <div className="text-sm leading-relaxed">
            {comment.content.split(' ').map((word, index) => {
              if (word.startsWith('@')) {
                return (
                  <span key={index} className="text-blue-600 bg-blue-50 px-1 rounded">
                    {word}
                  </span>
                );
              }
              return word + ' ';
            })}
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Heart className="h-3 w-3 mr-1" />
              {comment.likes}
            </Button>
            
            {!isReply && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                onClick={() => setReplyingTo(comment.id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Responder
              </Button>
            )}
            
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-80 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5" />
          Comentários
          <Badge variant="secondary" className="ml-auto">
            {comments.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* New Comment */}
        <div className="space-y-2">
          <div className="relative">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={replyingTo ? "Escreva uma resposta..." : "Adicione um comentário..."}
              className="min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === '@') {
                  setShowMentions(true);
                }
              }}
            />
            
            {showMentions && (
              <Card className="absolute top-full left-0 right-0 z-10 mt-1 shadow-lg">
                <CardContent className="p-2">
                  {users.map(user => (
                    <Button
                      key={user.name}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => insertMention(user.name)}
                    >
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                      </Avatar>
                      {user.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowMentions(!showMentions)}
            >
              <AtSign className="h-4 w-4 mr-1" />
              Mencionar
            </Button>
            
            <div className="flex gap-2">
              {replyingTo && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancelar
                </Button>
              )}
              <Button 
                size="sm" 
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                <Send className="h-4 w-4 mr-1" />
                {replyingTo ? 'Responder' : 'Comentar'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Comments List */}
        <div className="flex-1 space-y-4 overflow-y-auto">
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          
          {comments.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum comentário ainda.</p>
              <p className="text-sm">Seja o primeiro a comentar!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentsPanel;
