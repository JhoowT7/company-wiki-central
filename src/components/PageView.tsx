
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Edit, Clock, FileText } from "lucide-react";

interface PageViewProps {
  pageId: string;
  onBack: () => void;
}

// Mock data for demonstration
const pageData: Record<string, any> = {
  "rh-beneficios": {
    title: "Benefícios",
    category: "Recursos Humanos",
    lastModified: "15 de Janeiro, 2024",
    author: "Maria Silva",
    content: `
      <h2>Plano de Benefícios da Empresa</h2>
      <p>Nossa empresa oferece um pacote completo de benefícios para garantir o bem-estar e a qualidade de vida dos nossos colaboradores.</p>
      
      <h3>🏥 Benefícios de Saúde</h3>
      <ul>
        <li><strong>Plano de Saúde Completo:</strong> Cobertura nacional com rede credenciada ampla</li>
        <li><strong>Plano Odontológico:</strong> Incluindo procedimentos preventivos e corretivos</li>
        <li><strong>Seguro de Vida:</strong> Cobertura para funcionários e dependentes</li>
      </ul>

      <h3>💰 Benefícios Financeiros</h3>
      <ul>
        <li><strong>Vale Refeição:</strong> R$ 35,00 por dia útil</li>
        <li><strong>Vale Transporte:</strong> 100% do custo do transporte público</li>
        <li><strong>Participação nos Lucros:</strong> Distribuição anual baseada nos resultados</li>
      </ul>

      <h3>🎓 Desenvolvimento Profissional</h3>
      <ul>
        <li><strong>Verba para Cursos:</strong> Até R$ 3.000 anuais para capacitação</li>
        <li><strong>Licença Educacional:</strong> Horário flexível para estudos</li>
        <li><strong>Mentoria Interna:</strong> Programa de desenvolvimento de carreira</li>
      </ul>

      <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
        <p><strong>📋 Importante:</strong> Para mais informações sobre como solicitar benefícios, entre em contato com o departamento de RH.</p>
      </div>
    `
  },
  "ti-sistemas": {
    title: "Acesso a Sistemas",
    category: "Tecnologia da Informação",
    lastModified: "20 de Janeiro, 2024",
    author: "João Santos",
    content: `
      <h2>Guia de Acesso aos Sistemas da Empresa</h2>
      <p>Este guia contém informações essenciais para acessar todos os sistemas corporativos de forma segura e eficiente.</p>
      
      <h3>🔐 Sistemas Principais</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
        <tr style="background: #f9fafb;">
          <th style="border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left;">Sistema</th>
          <th style="border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left;">URL</th>
          <th style="border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left;">Função</th>
        </tr>
        <tr>
          <td style="border: 1px solid #e5e7eb; padding: 0.75rem;">ERP Corporativo</td>
          <td style="border: 1px solid #e5e7eb; padding: 0.75rem;">erp.empresa.com</td>
          <td style="border: 1px solid #e5e7eb; padding: 0.75rem;">Gestão financeira e operacional</td>
        </tr>
        <tr>
          <td style="border: 1px solid #e5e7eb; padding: 0.75rem;">CRM</td>
          <td style="border: 1px solid #e5e7eb; padding: 0.75rem;">crm.empresa.com</td>
          <td style="border: 1px solid #e5e7eb; padding: 0.75rem;">Gestão de clientes</td>
        </tr>
        <tr>
          <td style="border: 1px solid #e5e7eb; padding: 0.75rem;">Portal RH</td>
          <td style="border: 1px solid #e5e7eb; padding: 0.75rem;">rh.empresa.com</td>
          <td style="border: 1px solid #e5e7eb; padding: 0.75rem;">Recursos humanos</td>
        </tr>
      </table>

      <h3>🔑 Primeiro Acesso</h3>
      <ol>
        <li>Acesse o sistema desejado usando a URL correspondente</li>
        <li>Use seu CPF como login inicial</li>
        <li>A senha temporária será enviada por email</li>
        <li>Altere a senha no primeiro login</li>
      </ol>

      <div style="background: #fef3c7; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
        <p><strong>⚠️ Segurança:</strong> Nunca compartilhe suas credenciais de acesso. Em caso de suspeita de comprometimento, altere sua senha imediatamente.</p>
      </div>
    `
  }
};

export function PageView({ pageId, onBack }: PageViewProps) {
  const page = pageData[pageId] || {
    title: "Página não encontrada",
    category: "Erro",
    lastModified: "N/A",
    author: "Sistema",
    content: "<p>Esta página ainda não foi criada ou não existe.</p>"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{page.title}</h1>
                <Badge variant="secondary">{page.category}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {page.lastModified}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {page.author}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Histórico
            </Button>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8">
            <div 
              className="prose prose-gray dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </CardContent>
        </Card>

        {/* Related Pages */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Páginas Relacionadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer hover-scale">
                <h4 className="font-medium mb-2">Regras Internas</h4>
                <p className="text-sm text-muted-foreground">Normas e políticas da empresa</p>
              </div>
              <div className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer hover-scale">
                <h4 className="font-medium mb-2">Políticas de Férias</h4>
                <p className="text-sm text-muted-foreground">Procedimentos para solicitação de férias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
