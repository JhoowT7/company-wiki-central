
import { useState, useEffect } from "react";
import { Search, Clock, Star, TrendingUp, FileText, Plus, Bookmark, Eye, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface DashboardProps {
  onPageSelect: (pageId: string) => void;
  onNewPage: () => void;
}

interface RecentPage {
  id: string;
  title: string;
  category: string;
  lastModified: string;
  author: string;
  isNew?: boolean;
  excerpt?: string;
}

interface PopularPage {
  id: string;
  title: string;
  views: number;
  category: string;
  growth?: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: () => void;
  color: string;
}

const recentPages: RecentPage[] = [
  {
    id: "ti-sistemas",
    title: "Acesso a Sistemas",
    category: "TI",
    lastModified: "2024-01-20",
    author: "Admin",
    isNew: true,
    excerpt: "Guia completo para acesso aos sistemas internos da empresa..."
  },
  {
    id: "com-vendas",
    title: "Estratégias de Vendas",
    category: "Comercial",
    lastModified: "2024-01-22",
    author: "João Silva",
    excerpt: "Metodologias e técnicas para aumentar conversão de vendas..."
  },
  {
    id: "temp-contratos",
    title: "Modelos de Contratos",
    category: "Templates",
    lastModified: "2024-01-19",
    author: "Maria Santos",
    excerpt: "Templates padronizados para diferentes tipos de contratos..."
  },
  {
    id: "rh-beneficios",
    title: "Plano de Benefícios 2024",
    category: "RH",
    lastModified: "2024-01-18",
    author: "Ana Costa",
    excerpt: "Novos benefícios e atualizações para este ano..."
  }
];

const popularPages: PopularPage[] = [
  { id: "rh-beneficios", title: "Benefícios", views: 245, category: "RH", growth: 12 },
  { id: "ti-seguranca", title: "Boas Práticas de Segurança", views: 189, category: "TI", growth: 8 },
  { id: "com-atendimento", title: "Scripts de Atendimento", views: 156, category: "Comercial", growth: 15 },
  { id: "temp-emails", title: "Modelos de E-mail", views: 134, category: "Templates", growth: 5 }
];

const stats = [
  { 
    label: "Total de Páginas", 
    value: "127", 
    icon: FileText, 
    trend: "+12%", 
    trendUp: true,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30"
  },
  { 
    label: "Visualizações Hoje", 
    value: "1,234", 
    icon: Eye, 
    trend: "+8%", 
    trendUp: true,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30"
  },
  { 
    label: "Usuários Ativos", 
    value: "23", 
    icon: Users, 
    trend: "+3%", 
    trendUp: true,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30"
  },
  { 
    label: "Páginas Criadas", 
    value: "8", 
    icon: Plus, 
    trend: "Esta semana", 
    trendUp: true,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30"
  }
];

export function Dashboard({ onPageSelect, onNewPage }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const quickActions: QuickAction[] = [
    {
      id: "new-page",
      title: "Criar Nova Página",
      description: "Adicione novo conteúdo à wiki",
      icon: Plus,
      action: onNewPage,
      color: "bg-primary text-primary-foreground hover:bg-primary/90"
    },
    {
      id: "categories",
      title: "Gerenciar Categorias",
      description: "Organize a estrutura do conhecimento",
      icon: FileText,
      action: () => {},
      color: "bg-blue-500 text-white hover:bg-blue-600"
    },
    {
      id: "analytics",
      title: "Ver Estatísticas",
      description: "Analise o uso da wiki",
      icon: TrendingUp,
      action: () => {},
      color: "bg-green-500 text-white hover:bg-green-600"
    }
  ];

  return (
    <div className={`p-6 space-y-6 transition-all duration-700 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Wiki Empresarial
          </h1>
          <p className="text-muted-foreground text-lg">
            Bem-vindo à base de conhecimento da sua empresa
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Última atualização: hoje
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              23 usuários online
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar páginas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button onClick={onNewPage} size="lg" className="shadow-lg hover:shadow-xl transition-all duration-200">
            <Plus className="h-4 w-4 mr-2" />
            Nova Página
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={action.id} 
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-scale-in border-0 shadow-md"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={action.action}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${action.color} shadow-lg`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="transition-all duration-300 hover:shadow-lg animate-slide-in-left border-0 shadow-md"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend}
                </span>
                <span className="text-xs text-muted-foreground">desde ontem</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Pages */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span>Páginas Recentes</span>
                <CardDescription className="mt-1">
                  Últimas páginas editadas ou criadas
                </CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPages.map((page, index) => (
              <div
                key={page.id}
                className="flex items-start gap-4 p-4 rounded-xl border border-border/50 cursor-pointer hover:bg-muted/50 transition-all duration-200 hover:shadow-md animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onPageSelect(page.id)}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold hover:text-primary transition-colors">{page.title}</h4>
                    {page.isNew && <Badge variant="secondary" className="text-xs">Novo</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {page.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">{page.category}</Badge>
                    <span>Por {page.author}</span>
                    <span>{page.lastModified}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Popular Pages */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <span>Páginas Populares</span>
                <CardDescription className="mt-1">
                  Páginas mais visualizadas esta semana
                </CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {popularPages.map((page, index) => (
              <div
                key={page.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border/50 cursor-pointer hover:bg-muted/50 transition-all duration-200 hover:shadow-md animate-slide-in-right"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onPageSelect(page.id)}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-600 text-white text-sm font-bold shadow-lg">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold hover:text-primary transition-colors">{page.title}</h4>
                    <Badge variant="outline" className="text-xs">{page.category}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {page.views} visualizações
                    </div>
                    {page.growth && (
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        +{page.growth}%
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
