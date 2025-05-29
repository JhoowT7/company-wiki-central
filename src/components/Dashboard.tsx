
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, Users, FileText, Search, Plus } from "lucide-react";

interface DashboardProps {
  onPageSelect: (pageId: string) => void;
}

const quickStats = [
  { title: "Total de Páginas", value: "127", icon: FileText, trend: "+12" },
  { title: "Páginas Editadas (30d)", value: "34", icon: TrendingUp, trend: "+8" },
  { title: "Usuários Ativos", value: "23", icon: Users, trend: "+3" },
  { title: "Visualizações (30d)", value: "1,247", icon: Search, trend: "+156" },
];

const recentActivity = [
  { title: "Acesso a Sistemas", category: "TI", action: "criada", time: "há 2 horas", isNew: true },
  { title: "Estratégias de Vendas", category: "Comercial", action: "atualizada", time: "há 4 horas" },
  { title: "Contratos", category: "Templates", action: "revisada", time: "há 1 dia" },
  { title: "Benefícios", category: "RH", action: "comentada", time: "há 2 dias" },
];

const popularPages = [
  { title: "Acesso a Sistemas", category: "TI", views: 89 },
  { title: "Benefícios", category: "RH", views: 76 },
  { title: "Scripts de Atendimento", category: "Comercial", views: 54 },
  { title: "Boas Práticas de Segurança", category: "TI", views: 43 },
];

const categories = [
  { id: "rh", name: "Recursos Humanos", icon: "👥", pages: 12, color: "bg-blue-500" },
  { id: "ti", name: "Tecnologia da Informação", icon: "💻", pages: 28, color: "bg-green-500" },
  { id: "comercial", name: "Comercial", icon: "📈", pages: 15, color: "bg-purple-500" },
  { id: "templates", name: "Templates e Documentos", icon: "📄", pages: 72, color: "bg-orange-500" },
];

export function Dashboard({ onPageSelect }: DashboardProps) {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo à Wiki Empresarial - Centralize e organize todo o conhecimento da empresa</p>
        </div>
        <Button className="hover-scale">
          <Plus className="h-4 w-4 mr-2" />
          Nova Página
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stat.trend}</span> em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
          <CardDescription>Explore o conteúdo organizado por departamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer hover-scale"
                onClick={() => console.log(`Navigate to ${category.id}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center text-white text-lg`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.pages} páginas</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
            <CardDescription>Últimas atualizações e criações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{activity.title}</span>
                    {activity.isNew && <Badge variant="secondary">Nova</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.category} • {activity.action} • {activity.time}
                  </p>
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
            <CardDescription>Conteúdos mais acessados este mês</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularPages.map((page, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onPageSelect(`${page.category.toLowerCase()}-${page.title.toLowerCase()}`)}
              >
                <div className="flex-1">
                  <span className="font-medium">{page.title}</span>
                  <p className="text-sm text-muted-foreground">{page.category}</p>
                </div>
                <Badge variant="outline">{page.views} views</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
