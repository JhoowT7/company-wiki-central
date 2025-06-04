
import React, { useState, useEffect } from 'react';
import { Edit, Lock, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { database } from '@/stores/database';
import { Page } from '@/types';

interface MainPageViewProps {
  onEdit?: () => void;
  isAdmin?: boolean;
}

const MainPageView: React.FC<MainPageViewProps> = ({ onEdit, isAdmin = false }) => {
  const [mainPage, setMainPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMainPage();
  }, []);

  const loadMainPage = () => {
    setIsLoading(true);
    const page = database.getMainPage();
    setMainPage(page || null);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Carregando página principal...</span>
      </div>
    );
  }

  if (!mainPage) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Página Principal Não Encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Nenhuma página principal foi configurada ainda.
            </p>
            {isAdmin && (
              <Button onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Criar Página Principal
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Página Principal</span>
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Button onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Metadata Card */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl">{mainPage.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Settings className="h-3 w-3" />
                    {mainPage.author}
                  </div>
                  <Badge variant={mainPage.isPublic ? 'default' : 'secondary'}>
                    {mainPage.isPublic ? 'Público' : 'Privado'}
                  </Badge>
                  {mainPage.hasPassword && (
                    <Badge variant="destructive">
                      <Lock className="h-3 w-3 mr-1" />
                      Protegido
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Content */}
        <Card>
          <CardContent className="p-6">
            <div 
              className="prose dark:prose-invert max-w-none"
              style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: 'inherit'
              }}
              dangerouslySetInnerHTML={{ __html: mainPage.content }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainPageView;
