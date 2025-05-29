
import { useState } from "react";
import { Search, Clock, Star, TrendingUp, FileText, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
}

interface PopularPage {
  id: string;
  title: string;
  views: number;
  category: string;
}

const recentPages: RecentPage[] = [
  {
    id: "ti-sistemas",
    title: "Acesso a Sistemas",
    category: "TI",
    lastModified: "2024-01-20",
    author: "Admin",
    isNew: true
  },
  {
    id: "com-vendas",
    title: "Estratégias de Vendas",
    category: "Comercial",
    lastModified: "2024-01-22",
    author: "João Silva"
  },
  {
    id: "temp-contratos",
    title: "Contratos",
    category: "Templates",
    lastModified: "2024-01-19",
    author: "Maria Santos"
  }
];

const popularPages: PopularPage[] = [
  { id: "rh-beneficios", title: "Benefícios", views: 245, category: "RH" },
  { id: "ti-seguranca", title: "Boas Práticas de Segurança", views: 189, category: "TI" },
  { id: "com-atendimento", title: "Scripts de Atendimento", views: 156, category: "Comercial" }
];

const stats = [
  { label: "Total de Páginas", value: "127", icon: FileText, trend: "+12%" },
  { label: "Visualizações Hoje", value: "1,234", icon: TrendingUp, trend: "+8%" },
  { label: "Usuários Ativos", value: "23", icon: Star, trend: "+3%" },
];

export function Dashboard({ onPageSelect, onNewPage }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Wiki Empresarial</h1>
          <p className="text-muted-foreground">
            Bem-vindo à base de conhecimento da sua empresa
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar páginas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={onNewPage}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Página
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.trend}</span> desde ontem
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Páginas Recentes
            </CardTitle>
            <CardDescription>
              Últimas páginas editadas ou criadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPages.map((page) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onPageSelect(page.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{page.title}</h4>
                    {page.isNew && <Badge variant="secondary">Novo</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {page.category} • Editado por {page.author}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {page.lastModified}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Popular Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Páginas Populares
            </CardTitle>
            <CardDescription>
              Páginas mais visualizadas esta semana
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularPages.map((page, index) => (
              <div
                key={page.id}
                className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onPageSelect(page.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{page.title}</h4>
                    <p className="text-sm text-muted-foreground">{page.category}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {page.views} visualizações
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
